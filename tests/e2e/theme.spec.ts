import { expect, test, type Page } from "@playwright/test";

// Records the theme at the moment <body> enters the DOM. The theme script in
// <head> must have set it by then, or the first paint shows the wrong theme.
const recordThemeAtBody = () => {
    const observer = new MutationObserver(() => {
        if (document.body) {
            (window as unknown as { themeAtBody?: string | undefined }).themeAtBody =
                document.documentElement.dataset.theme;
            observer.disconnect();
        }
    });
    observer.observe(document, { childList: true, subtree: true });
};

const themeAtBody = (page: Page) =>
    page.evaluate(() => (window as unknown as { themeAtBody?: string | undefined }).themeAtBody);

test.describe("theme", () => {
    test("follows the system theme on the first visit", async ({ page }) => {
        await page.emulateMedia({ colorScheme: "dark" });
        await page.addInitScript(recordThemeAtBody);
        await page.goto("/");
        expect(await themeAtBody(page)).toBe("dark");
    });

    test("keeps the chosen theme across navigation with no flash", async ({ page }) => {
        await page.emulateMedia({ colorScheme: "light" });
        await page.addInitScript(recordThemeAtBody);
        await page.goto("/");
        const toggle = page.locator("[data-theme-toggle]");
        await toggle.click(); // system -> light
        await toggle.click(); // light -> dark
        await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

        await page.goto("/about");
        expect(await themeAtBody(page)).toBe("dark");
        await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

        const keys = await page.evaluate(() => Object.keys(localStorage));
        expect(keys).toEqual(["handyweb:theme"]);
    });

    test("works when storage is blocked", async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.addInitScript(() => {
            Object.defineProperty(window, "localStorage", {
                get() {
                    throw new DOMException("Blocked", "SecurityError");
                },
            });
        });
        await page.emulateMedia({ colorScheme: "light" });
        await page.goto("/");
        await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
        await page.locator("[data-theme-toggle]").click();
        await page.locator("[data-theme-toggle]").click();
        await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
        expect(errors).toEqual([]);
    });
});

test("loads every font and asset from the site itself", async ({ page, baseURL }) => {
    const foreign: string[] = [];
    page.on("request", (request) => {
        if (!request.url().startsWith(baseURL as string)) foreign.push(request.url());
    });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(foreign).toEqual([]);
    const loaded = await page.evaluate(() =>
        [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family),
    );
    expect(loaded).toContain("Estedad HW");
    expect(loaded).toContain("Noto Sans HW");
});
