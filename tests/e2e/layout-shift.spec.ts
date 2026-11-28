import { expect, test } from "@playwright/test";

// The tool UI is rendered into the HTML at build time, and React keeps that
// HTML until the code of the tool arrives. This test makes the code arrive
// late and checks that the page does not move when the tool starts. Only
// Chromium reports layout-shift entries.

const pages = [
    "/en/tools/hash/",
    "/fa/tools/hash/",
    "/fa/tools/json-formatter/",
    "/en/tools/password-generator/",
    "/fa/tools/image-resize/",
];

// A CLS of 0.1 or less is "good" (web.dev).
const MAX_CLS = 0.01;

for (const path of pages) {
    test(`${path} does not shift when the tool starts`, async ({ page, browserName }) => {
        test.skip(browserName !== "chromium", "Only Chromium reports layout shifts.");
        await page.route("**/_astro/*.js", async (route) => {
            const name = new URL(route.request().url()).pathname;
            if (/\/_astro\/(ui|logic|worker)\./.test(name)) {
                await new Promise((resolve) => setTimeout(resolve, 1_500));
            }
            await route.continue();
        });
        await page.addInitScript(() => {
            const scope = window as unknown as { __shifts: [number, number][] };
            scope.__shifts = [];
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries() as unknown as {
                    value: number;
                    startTime: number;
                    hadRecentInput: boolean;
                }[]) {
                    if (!entry.hadRecentInput) scope.__shifts.push([entry.startTime, entry.value]);
                }
            }).observe({ type: "layout-shift", buffered: true });
        });
        const toolCode = page.waitForResponse((response) =>
            /\/_astro\/ui\./.test(new URL(response.url()).pathname),
        );
        // The load event waits for the fonts, and the tool code is held back
        // longer. The font swap is measured in fonts.spec.ts, so only the
        // shifts after this point count here.
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        const start = await page.evaluate(() => performance.now());
        await toolCode;
        await page.waitForTimeout(500);
        const cls = await page.evaluate((after) => {
            const scope = window as unknown as { __shifts: [number, number][] };
            return scope.__shifts
                .filter(([time]) => time > after)
                .reduce((sum, [, value]) => sum + value, 0);
        }, start);
        test.info().annotations.push({ type: "cls", description: String(cls) });
        expect(cls).toBeLessThanOrEqual(MAX_CLS);
    });
}
