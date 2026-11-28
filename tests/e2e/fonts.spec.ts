import { expect, test } from "@playwright/test";

// The fallback fonts in apps/web/src/styles/fonts.css have the metrics of the
// web fonts. This test holds the font files back, so the page first paints with
// the fallbacks. When the page is ready, the test releases the fonts and
// measures the layout shift of the swap only. Only Chromium reports
// layout-shift entries.
//
// The fallbacks match the average width, not the width of each word. A line
// that is within about 1% of the width where it wraps can still wrap after the
// swap (the title of the hash tool on a phone, for example), so the test uses
// pages whose lines are not that close.

const pages = [
    { path: "/fa/", ready: "main" },
    { path: "/en/", ready: "main" },
    { path: "/fa/categories/text/", ready: "main" },
    { path: "/fa/tools/json-formatter/", ready: "[data-tool-input]" },
    { path: "/en/tools/json-formatter/", ready: "[data-tool-input]" },
];

// A CLS of 0.1 or less is "good" (web.dev). The swap must stay far below it.
const MAX_CLS = 0.01;

for (const { path, ready } of pages) {
    test(`${path} does not shift when the fonts load`, async ({ page, browserName }) => {
        test.skip(browserName !== "chromium", "Only Chromium reports layout shifts.");
        let release = () => {};
        const fontsHeld = new Promise<void>((resolve) => (release = resolve));
        await page.route("**/*.woff2", async (route) => {
            await fontsHeld;
            await route.continue();
        });
        await page.addInitScript(() => {
            const scope = window as unknown as { __cls: number };
            scope.__cls = 0;
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries() as unknown as {
                    value: number;
                    hadRecentInput: boolean;
                }[]) {
                    if (!entry.hadRecentInput) scope.__cls += entry.value;
                }
            }).observe({ type: "layout-shift", buffered: true });
        });
        await page.goto(path, { waitUntil: "domcontentloaded" });
        await page.locator(ready).first().waitFor();
        await page.waitForTimeout(500);
        // A machine without the system fonts (for example a Linux CI runner
        // without Arial or Tahoma) has no fallback to test.
        const fallbacks = await page.evaluate(async () => {
            const loaded = async (family: string, text: string) => {
                try {
                    const faces = await document.fonts.load(`16px "${family}"`, text);
                    return faces.length > 0;
                } catch {
                    return false;
                }
            };
            const persian = [
                "Estedad HW Fallback Tahoma",
                "Estedad HW Fallback Geeza",
                "Estedad HW Fallback Naskh",
            ];
            const results = await Promise.all(persian.map((family) => loaded(family, "ب")));
            return {
                latin: await loaded("Noto Sans HW Fallback", "a"),
                persian: results.some(Boolean),
            };
        });
        test.skip(
            !fallbacks.latin || (path.startsWith("/fa/") && !fallbacks.persian),
            "This machine has none of the fallback system fonts.",
        );
        await page.evaluate(() => {
            (window as unknown as { __cls: number }).__cls = 0;
        });

        release();
        await expect
            .poll(() =>
                page.evaluate(() =>
                    [...document.fonts].some(
                        (font) => font.family.endsWith("HW") && font.status === "loaded",
                    ),
                ),
            )
            .toBe(true);
        await page.evaluate(() => document.fonts.ready);
        // Two frames, so the browser reports the shift of the swap.
        await page.evaluate(
            () =>
                new Promise((resolve) =>
                    requestAnimationFrame(() => requestAnimationFrame(resolve)),
                ),
        );
        const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
        test.info().annotations.push({ type: "cls of the font swap", description: String(cls) });
        expect(cls).toBeLessThanOrEqual(MAX_CLS);
    });
}
