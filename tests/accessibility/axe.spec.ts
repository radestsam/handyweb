import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { catalog } from "@handyweb/tools/catalog";
import { categories } from "@handyweb/tools/categories";

// Every page, in both languages and both themes, must have no axe violations
// at WCAG 2.2 AA. Tool and category pages come from the registry.
const published = catalog.filter((tool) => tool.status === "published");
const PAGES = [
    "/",
    "/about/",
    "/privacy/",
    "/opensource/",
    "/contribute/",
    "/tools/",
    ...published.map((tool) => `/tools/${tool.slug}/`),
    ...categories
        .filter((c) => published.some((t) => t.category === c.id || t.alsoIn.includes(c.id)))
        .map((c) => `/categories/${c.slug}/`),
];
const LOCALES = ["fa", "en"] as const;
const THEMES = ["light", "dark"] as const;

for (const locale of LOCALES) {
    for (const path of PAGES) {
        for (const theme of THEMES) {
            test(`/${locale}${path} has no axe violations (${theme})`, async ({ page }) => {
                await page.addInitScript((value) => {
                    localStorage.setItem("handyweb:theme", value);
                }, theme);
                await page.goto(`/${locale}${path}`);
                await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
                await page.waitForLoadState("networkidle");
                const results = await new AxeBuilder({ page })
                    // A sandboxed preview frame runs no script, so axe cannot run inside it.
                    .exclude("iframe[sandbox]")
                    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
                    .analyze();
                expect(
                    results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`),
                ).toEqual([]);
            });
        }
    }
}

test("a keyboard user reaches the skip link first and lands on main", async ({
    page,
    browserName,
}) => {
    test.skip(browserName === "webkit", "WebKit skips links on Tab unless the OS setting is on.");
    await page.goto("/en/about/");
    await page.keyboard.press("Tab");
    const skip = page.locator('a[href="#main"]');
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
});

test("every interactive control in the header is reachable by Tab", async ({
    page,
    browserName,
}) => {
    test.skip(browserName === "webkit", "WebKit skips links on Tab unless the OS setting is on.");
    await page.goto("/fa/");
    const reached = new Set<string>();
    // The sidebar comes first in the tab order, so this needs more steps.
    for (let i = 0; i < 40; i++) {
        await page.keyboard.press("Tab");
        const id = await page.evaluate(() => {
            const el = document.activeElement as HTMLElement | null;
            return el?.dataset.themeToggle !== undefined
                ? "theme"
                : el?.dataset.localeSwitch
                  ? "locale"
                  : (el?.getAttribute("href") ?? "");
        });
        reached.add(id);
    }
    expect(reached).toContain("theme");
    expect(reached).toContain("locale");
});
