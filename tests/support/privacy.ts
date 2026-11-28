import { test as base, expect, type Page, type Request } from "@playwright/test";

/** The only browser storage keys that HandyWeb may write (D5). */
export const ALLOWED_STORAGE_KEYS = ["handyweb:theme", "handyweb:locale"];

export interface RecordedRequest {
    url: string;
    method: string;
    body: string | null;
}

/**
 * A test with a request log. Every request that the page makes is recorded,
 * so a test can check that no tool input or output left the browser.
 */
export const test = base.extend<{ requests: RecordedRequest[] }>({
    requests: async ({ page }, use) => {
        const requests: RecordedRequest[] = [];
        page.on("request", (request: Request) => {
            requests.push({
                url: request.url(),
                method: request.method(),
                body: request.postData(),
            });
        });
        await use(requests);
    },
});

export { expect };

/**
 * Fails when a request went to another origin, used a method other than GET,
 * carried a body, or named any of the given secrets in its URL.
 */
export function expectNoLeak(requests: RecordedRequest[], origin: string, secrets: string[]): void {
    const problems: string[] = [];
    for (const request of requests) {
        const url = new URL(request.url);
        if (url.protocol === "data:" || url.protocol === "blob:") continue;
        if (url.origin !== origin) problems.push(`request to another origin: ${request.url}`);
        if (request.method !== "GET") problems.push(`${request.method} request: ${request.url}`);
        if (request.body) problems.push(`request with a body: ${request.url}`);
        for (const secret of secrets) {
            const needle = secret.slice(0, 64);
            if (needle.length >= 4 && decodeURIComponent(request.url).includes(needle)) {
                problems.push(`request URL contains tool data: ${request.url}`);
            }
        }
    }
    expect(problems).toEqual([]);
}

/**
 * Fails when the page stored anything except the allowed preference keys and
 * the static file cache of the service worker. That cache may hold only GET
 * responses of this origin, with no query string and none of the given
 * secrets in the URL.
 */
export async function expectCleanStorage(page: Page, secrets: string[] = []): Promise<void> {
    const stored = await page.evaluate(async () => {
        const databases = "databases" in indexedDB ? await indexedDB.databases() : [];
        return {
            local: Object.keys(localStorage),
            session: Object.keys(sessionStorage),
            indexedDB: databases.map((db) => db.name ?? ""),
            cookies: document.cookie,
        };
    });
    expect(stored.local.filter((key) => !ALLOWED_STORAGE_KEYS.includes(key))).toEqual([]);
    expect(stored.session).toEqual([]);
    expect(stored.indexedDB).toEqual([]);
    expect(stored.cookies).toBe("");
    const cached = await page.evaluate(async () => {
        if (!("caches" in window)) return { names: [] as string[], urls: [] as string[] };
        const names = await window.caches.keys();
        const urls: string[] = [];
        for (const name of names) {
            const cache = await window.caches.open(name);
            for (const request of await cache.keys()) urls.push(request.url);
        }
        return { names, urls };
    });
    expect(cached.names.filter((name) => !/^handyweb-[0-9a-f]{16}$/.test(name))).toEqual([]);
    const origin = new URL(page.url()).origin;
    const problems = cached.urls.filter((value) => {
        const url = new URL(value);
        const text = decodeURIComponent(value);
        return (
            url.origin !== origin ||
            url.search !== "" ||
            secrets.some((secret) => secret.length >= 4 && text.includes(secret.slice(0, 64)))
        );
    });
    expect(problems).toEqual([]);
}
