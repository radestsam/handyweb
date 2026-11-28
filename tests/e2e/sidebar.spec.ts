import { expect, test } from "@playwright/test";
import { catalog } from "@handyweb/tools/catalog";
import { FEATURED } from "../../apps/web/src/i18n/tools";

// The tool sidebar: every page shows all tools, and the open tool is marked.

test("a tool page marks its own tool in the sidebar", async ({ page, isMobile }) => {
    await page.goto("/en/tools/base64/");
    if (isMobile)
        await page
            .getByRole("navigation", { name: "Main navigation" })
            .getByRole("link", { name: "Tools" })
            .click();
    const list = page.getByRole("navigation", { name: "Tool list" });
    await expect(list).toBeVisible();
    const current = list.locator('[aria-current="page"]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveAttribute("href", "/en/tools/base64/");
    await expect(current).toBeInViewport();
});

test("the sidebar is on pages without a tool", async ({ page, isMobile }) => {
    test.skip(isMobile, "The drawer is checked in its own test.");
    await page.goto("/fa/about/");
    const list = page.getByRole("navigation", { name: "فهرست ابزارها" });
    await expect(list).toBeVisible();
    await expect(list.locator('[aria-current="page"]')).toHaveCount(0);
});

test("the filter narrows the list and Enter opens the first match", async ({ page, isMobile }) => {
    await page.goto("/en/");
    if (isMobile)
        await page
            .getByRole("navigation", { name: "Main navigation" })
            .getByRole("link", { name: "Tools" })
            .click();
    const filter = page.getByRole("searchbox", { name: "Filter the tool list" });
    await filter.fill("jalali");
    const list = page.getByRole("navigation", { name: "Tool list" });
    await expect(
        list.getByRole("link", { name: "Jalali and Gregorian Date Converter" }),
    ).toBeVisible();
    await expect(list.getByRole("link", { name: /Base64/ }).first()).toBeHidden();
    await filter.fill("zzzz");
    await expect(list.getByRole("status")).toHaveText("No tool has this name.");
    await filter.fill("jalali");
    await filter.press("Enter");
    await page.waitForURL("**/en/tools/jalali-converter/");
});

test("on a phone the Tools tab opens a drawer that Esc closes", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Only phones use the drawer from the tab bar.");
    await page.goto("/en/tools/hash/");
    const list = page.getByRole("navigation", { name: "Tool list" });
    await expect(list).toBeHidden();
    const tab = page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "Tools" });
    await tab.click();
    await expect(page).toHaveURL(/\/en\/tools\/hash\/$/);
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("searchbox", { name: "Filter the tool list" })).toBeFocused();
    // The page behind the drawer takes no focus and no clicks.
    expect(await page.locator("header").evaluate((el) => el.closest("[inert]") !== null)).toBe(
        true,
    );
    await page.keyboard.press("Escape");
    await expect(list).toBeHidden();
    await expect(tab).toBeFocused();
});

test("the home page lists the popular tools and links to all tools", async ({ page }) => {
    await page.goto("/fa/");
    const rows = page.locator("main [data-tool-row] a");
    await expect(rows).toHaveCount(FEATURED.length);
    expect(await rows.evaluateAll((links) => links.map((a) => a.getAttribute("href")))).toEqual(
        FEATURED.map((slug) => `/fa/tools/${slug}/`),
    );
    const published = catalog.filter((tool) => tool.status === "published");
    await expect(page.locator(".sidebar li[data-terms]")).toHaveCount(published.length);
    await expect(page.locator('main a[href="/fa/tools/"]')).toBeVisible();
});

test("/ opens the tool filter, also on a phone", async ({ page }) => {
    await page.goto("/en/about/");
    await page.keyboard.press("/");
    await expect(page.getByRole("searchbox", { name: "Filter the tool list" })).toBeFocused();
    await expect(page.locator("[data-search-dialog]")).toHaveCount(0);
});

test("the header band holds the breadcrumbs, the language link, and the theme button", async ({
    page,
}) => {
    await page.goto("/en/tools/base64/");
    const band = page.locator("header");
    await expect(band.getByRole("navigation", { name: "Breadcrumbs" })).toBeVisible();
    await expect(band.locator("[data-locale-switch]")).toBeVisible();
    await expect(band.locator("[data-theme-toggle]")).toBeVisible();
    await expect(page.locator("main nav[aria-label='Breadcrumbs']")).toHaveCount(0);
});
