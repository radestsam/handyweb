import { expect, test } from "@playwright/test";

// Every page in the sitemap: a unique title and description, a canonical URL
// that points at itself, one h1, and structured data that parses.
test("sitemap pages have unique, complete metadata", async ({ request, browserName }, info) => {
    test.skip(browserName !== "chromium" || info.project.name !== "chromium", "Runs once.");
    const xml = await (await request.get("/sitemap.xml")).text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
        (m) => new URL(m[1] as string).pathname,
    );
    expect(urls.length).toBeGreaterThan(10);

    const titles = new Map<string, string>();
    const descriptions = new Map<string, string>();
    for (const path of urls) {
        const html = await (await request.get(path)).text();
        const title = /<title>([^<]+)<\/title>/.exec(html)?.[1] ?? "";
        const description = /<meta name="description" content="([^"]+)"/.exec(html)?.[1] ?? "";
        const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1] ?? "";
        expect(title, path).not.toBe("");
        expect(title.length, `${path} title length`).toBeLessThanOrEqual(70);
        expect(description.length, `${path} description length`).toBeGreaterThanOrEqual(50);
        expect(description.length, `${path} description length`).toBeLessThanOrEqual(170);
        expect(new URL(canonical).pathname, path).toBe(path);
        expect(html.match(/<h1[\s>]/g)?.length, `${path} h1 count`).toBe(1);
        for (const block of html.matchAll(
            /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
        )) {
            expect(() => JSON.parse(block[1] as string), `${path} JSON-LD`).not.toThrow();
        }
        expect(titles.get(title), `duplicate title: ${title}`).toBeUndefined();
        expect(descriptions.get(description), `duplicate description on ${path}`).toBeUndefined();
        titles.set(title, path);
        descriptions.set(description, path);
    }
});
