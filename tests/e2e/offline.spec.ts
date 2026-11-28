import { expect, test } from "@playwright/test";
import { base64Meta } from "../../packages/tools/src/encoding/base64/meta";
import { expectCleanStorage } from "../support/privacy";

// The service worker runs in every browser, but Playwright can switch a
// service worker offline only in Chromium.
test.skip(({ browserName }) => browserName !== "chromium", "offline mode needs Chromium");

test("a tool that was opened once works offline", async ({ page, context }) => {
    await page.goto("/en/tools/base64/");
    await page.evaluate(async () => {
        await navigator.serviceWorker.ready;
    });
    // The first visit loads the tool before the worker controls the page, so
    // load it once more through the worker, which puts it in the cache.
    await page.reload();
    await expect
        .poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)))
        .toBe(true);
    const input = page.locator("[data-tool-input]").first();
    await input.fill(base64Meta.example as string);
    await expect(page.locator("[data-tool-output]").first()).not.toHaveValue("");

    await context.setOffline(true);
    await page.reload();
    await input.fill(base64Meta.example as string);
    await expect(page.locator("[data-tool-output]").first()).not.toHaveValue("");
    await expectCleanStorage(page, [base64Meta.example as string]);

    // A page that was never opened shows the start page of its language.
    await page.goto("/en/about/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await context.setOffline(false);
});

test("each language has a manifest", async ({ request }) => {
    for (const locale of ["fa", "en"]) {
        const response = await request.get(`/${locale}/manifest.webmanifest`);
        expect(response.ok()).toBe(true);
        const manifest = await response.json();
        expect(manifest).toMatchObject({ start_url: `/${locale}/`, display: "standalone" });
        for (const icon of manifest.icons) expect((await request.get(icon.src)).ok()).toBe(true);
    }
    expect((await request.get("/sw.js")).ok()).toBe(true);
});
