import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { headersFor, readHeaderRules, serveWithHeaders } from "../support/csp";

// T2.1: every page of the sitemap loads with the generated headers and the CSP
// meta tag, and the browser reports no CSP violation.

const sitemap = readFileSync(join(import.meta.dirname, "../../apps/web/dist/sitemap.xml"), "utf8");
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => new URL(match[1] ?? "/", "https://handyweb.ir").pathname,
);

test("the sitemap lists the pages", () => {
    expect(paths.length).toBeGreaterThan(20);
});

for (const path of paths) {
    test(`${path} has no CSP violation`, async ({ page, baseURL }) => {
        const violations = await serveWithHeaders(page, baseURL as string);
        const response = await page.goto(path);
        expect(response?.headers()["content-security-policy"]).toContain("default-src 'self'");
        await page.waitForLoadState("networkidle");
        expect(violations).toEqual([]);
    });
}

test.describe("headers", () => {
    const rules = readHeaderRules();

    test("a page gets the security headers and no frame-ancestors in its meta tag", async ({
        page,
    }) => {
        const headers = headersFor(rules, "/en/");
        expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
        expect(headers["content-security-policy"]).not.toContain("'unsafe-inline'");
        expect(headers["referrer-policy"]).toBe("no-referrer");
        expect(headers["x-content-type-options"]).toBe("nosniff");
        expect(headers["permissions-policy"]).toContain("microphone=()");
        await page.goto("/en/");
        const meta = await page
            .locator('meta[http-equiv="Content-Security-Policy"]')
            .getAttribute("content");
        expect(meta).toContain("default-src 'self'");
        expect(meta).not.toContain("frame-ancestors");
    });

    test("hashed assets are cached for a year and the service worker is not", () => {
        expect(headersFor(rules, "/_astro/client.js")["cache-control"]).toContain("immutable");
        expect(headersFor(rules, "/sw.js")["cache-control"]).toBe("no-cache");
        expect(headersFor(rules, "/en/")["cache-control"]).toBeUndefined();
    });

    test("only the preview tools allow inline styles, and each page has one policy", () => {
        for (const path of ["/en/tools/html-preview/", "/fa/tools/markdown-editor/"]) {
            const policy = headersFor(rules, path)["content-security-policy"];
            expect(policy).toContain("style-src 'self' 'unsafe-inline'");
            expect(policy).not.toContain(", ");
        }
        const hash = headersFor(rules, "/en/tools/hash/")["content-security-policy"];
        expect(hash).toMatch(/style-src 'self'( 'sha256-[^']+')*;/);
    });

    test("the CSP blocks a request to another origin", async ({ page, baseURL }) => {
        const violations = await serveWithHeaders(page, baseURL as string);
        const sent: string[] = [];
        page.on("request", (request) => sent.push(request.url()));
        await page.goto("/en/");
        await page.evaluate(() => fetch("https://example.com/collect?x=1").catch(() => undefined));
        await expect.poll(() => violations.length).toBeGreaterThan(0);
        expect(sent.filter((url) => url.startsWith("https://example.com"))).toEqual([]);
    });

    test("the CSP blocks an inline script that has no hash", async ({ page, baseURL }) => {
        const violations = await serveWithHeaders(page, baseURL as string);
        await page.goto("/en/");
        await page.evaluate(() => {
            const script = document.createElement("script");
            script.textContent = "window.__injected = true";
            document.body.append(script);
        });
        await expect.poll(() => violations.length).toBeGreaterThan(0);
        expect(await page.evaluate(() => "__injected" in window)).toBe(false);
    });
});

test.describe("preview tools under the CSP", () => {
    test("the HTML preview runs its own inline script and style", async ({ page, baseURL }) => {
        const violations = await serveWithHeaders(page, baseURL as string);
        await page.goto("/en/tools/html-preview/");
        await page
            .locator("[data-tool-input]")
            .first()
            .fill(
                '<style>p{color:rgb(1, 2, 3)}</style><p id="x">a</p><script>document.getElementById("x").textContent="ran"</script>',
            );
        await page.getByLabel("Run inline scripts").check();
        const frame = page.frameLocator("[data-tool-frame]");
        await expect(frame.locator("#x")).toHaveCSS("color", "rgb(1, 2, 3)");
        await expect(frame.locator("#x")).toHaveText("ran");
        expect(violations).toEqual([]);
    });
});
