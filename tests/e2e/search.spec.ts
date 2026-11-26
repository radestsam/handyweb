import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("search", () => {
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
        const results = await new AxeBuilder({ page }).include("[data-search-dialog]").analyze();
        expect(results.violations.map((v) => v.id)).toEqual([]);
    });
});

test("the home page lists every tool once", async ({ page }) => {
    await page.goto("/fa/");
    await expect(page.locator("[data-tool-row]")).toHaveCount(1);
});
