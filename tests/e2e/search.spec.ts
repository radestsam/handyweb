import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { catalog } from "@handyweb/tools/catalog";

test.describe("search", () => {
    test("opens with /, finds a tool typed with an Arabic keyboard, and opens it with Enter", async ({
        page,
    }) => {
        const urls: string[] = [];
        page.on("request", (request) => urls.push(request.url()));
        await page.goto("/fa/");
        await page.keyboard.press("/");
        const input = page.locator("[data-search-input]");
        await expect(input).toBeFocused();
        await input.fill("تاريخ");
        await expect(page.locator("[data-search-results] li").first()).toContainText("تاریخ");
        await page.keyboard.press("Enter");
        await page.waitForURL("**/fa/tools/jalali-converter/");
        expect(urls.some((url) => decodeURIComponent(url).includes("تاريخ"))).toBe(false);
    });

    test("opens with Ctrl+K and the button, and closes with Escape", async ({ page }) => {
        await page.goto("/en/about/");
        await page.keyboard.press("Control+k");
        await expect(page.locator("[data-search-dialog]")).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(page.locator("[data-search-dialog]")).toBeHidden();
        await page.locator("[data-search-open]:visible").click();
        await page.locator("[data-search-input]").fill("base64");
        await expect(page.locator("[data-search-results] li")).toHaveCount(1);
    });

    test("says when nothing matches", async ({ page }) => {
        await page.goto("/en/");
        await page.locator("[data-search-open]:visible").click();
        await page.locator("[data-search-input]").fill("zzzz");
        await expect(page.locator("[data-search-status]")).toHaveText("No tool found.");
    });

    test("the open dialog has no axe violations", async ({ page }) => {
        await page.goto("/fa/");
        await page.locator("[data-search-open]:visible").click();
        await page.locator("[data-search-input]").fill("json");
        await expect(page.locator("[data-search-results] li").first()).toBeVisible();
        const results = await new AxeBuilder({ page }).include("[data-search-dialog]").analyze();
        expect(results.violations.map((v) => v.id)).toEqual([]);
    });
});

test("the home page lists every tool once", async ({ page }) => {
    await page.goto("/fa/");
    const published = catalog.filter((tool) => tool.status === "published");
    await expect(page.locator("[data-tool-row]")).toHaveCount(published.length);
});

test("the arrow keys move between results", async ({ page }) => {
    await page.goto("/en/");
    await page.locator("[data-search-open]:visible").click();
    await page.locator("[data-search-input]").fill("e");
    await expect(page.locator("[data-search-results] a").nth(1)).toBeVisible();
    await page.keyboard.press("ArrowDown");
    await expect(page.locator("[data-search-results] a").first()).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(page.locator("[data-search-results] a").nth(1)).toBeFocused();
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowUp");
    await expect(page.locator("[data-search-input]")).toBeFocused();
});
