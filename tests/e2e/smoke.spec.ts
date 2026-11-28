import { expect, test } from "@playwright/test";

test("the bare root sends the visitor to /fa/", async ({ page }) => {
    await page.goto("/");
    await page.waitForURL("**/fa/");
    await expect(page.locator("html")).toHaveAttribute("lang", "fa");
});

for (const [locale, dir] of [
    ["fa", "rtl"],
    ["en", "ltr"],
] as const) {
    test(`/${locale}/ renders with dir=${dir}`, async ({ page }) => {
        await page.goto(`/${locale}/`);
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await expect(page.locator("html")).toHaveAttribute("dir", dir);
        await expect(page.locator("h1")).toBeVisible();
    });
}

test("each page links to its counterpart in the other language", async ({ page }) => {
    await page.goto("/fa/about/");
    const alternates = await page
        .locator('link[rel="alternate"]')
        .evaluateAll((links) =>
            links.map((l) => [l.getAttribute("hreflang"), l.getAttribute("href")]),
        );
    expect(alternates).toEqual([
        ["fa-IR", "https://handyweb.ir/fa/about/"],
        ["en", "https://handyweb.ir/en/about/"],
        ["x-default", "https://handyweb.ir/fa/about/"],
    ]);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        "https://handyweb.ir/fa/about/",
    );

    await page.locator("[data-locale-switch]:visible").click();
    await page.waitForURL("**/en/about/");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    expect(await page.evaluate(() => localStorage.getItem("handyweb:locale"))).toBe("en");
});

test("code stays left to right inside a Persian page", async ({ page }) => {
    await page.goto("/fa/privacy/");
    const code = page.locator("main code").first();
    await expect(code).toHaveAttribute("dir", "ltr");
    expect(await code.evaluate((el) => getComputedStyle(el).direction)).toBe("ltr");
    expect(await code.evaluate((el) => getComputedStyle(el).unicodeBidi)).toBe("isolate");
});
