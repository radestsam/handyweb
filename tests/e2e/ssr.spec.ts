import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

// Tool UIs are rendered into the HTML at build time. These tests check that
// the browser takes over that HTML without an error, and that no random value
// (a password, a token, an ID) is in the HTML: the same file goes to every
// visitor.

const sitemap = readFileSync(join(import.meta.dirname, "../../apps/web/dist/sitemap.xml"), "utf8");
const toolPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => new URL(match[1] ?? "/", "https://handyweb.ir").pathname)
    .filter((path) => /^\/(fa|en)\/tools\/[^/]+\/$/.test(path));

const RANDOM_TOOLS = ["password-generator", "random-token", "uuid-generator", "lorem-ipsum"];

test("the sitemap lists the tool pages", () => {
    expect(toolPaths.length).toBeGreaterThan(20);
});

for (const id of RANDOM_TOOLS) {
    test(`the HTML of ${id} holds no random value`, async ({ request }) => {
        const html = await (await request.get(`/en/tools/${id}/`)).text();
        const outputs = [
            ...html.matchAll(/<textarea[^>]*data-tool-output[^>]*>([^<]*)<\/textarea>/g),
            ...html.matchAll(/<input[^>]*data-tool-output[^>]*value="([^"]*)"/g),
        ].map((match) => match[1]);
        expect(outputs.length).toBeGreaterThan(0);
        expect(outputs.filter(Boolean)).toEqual([]);
    });

    test(`${id} draws a value in the browser`, async ({ page }) => {
        await page.goto(`/en/tools/${id}/`);
        await expect(page.locator("[data-tool-output]").first()).not.toHaveValue("");
    });
}

for (const path of toolPaths) {
    test(`${path} starts without an error`, async ({ page, browserName }) => {
        test.skip(browserName !== "chromium", "One browser is enough for this sweep.");
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        page.on("console", (message) => {
            if (message.type() === "error") errors.push(message.text());
        });
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        expect(errors).toEqual([]);
    });
}
