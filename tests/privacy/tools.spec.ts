import { catalog } from "@handyweb/tools/catalog";
import { expect, expectCleanStorage, expectNoLeak, test } from "../support/privacy";

// Every published tool, in both languages: run it with its example input, and
// check that a result appears, that nothing left the browser, and that
// nothing was stored (plan section 11.3, T0.14).
const published = catalog.filter((tool) => tool.status === "published" && tool.example);

for (const tool of published) {
    for (const locale of ["fa", "en"] as const) {
        test(`${tool.id} (${locale}) runs locally and stores nothing`, async ({
            page,
            requests,
            baseURL,
        }) => {
            const errors: string[] = [];
            page.on("pageerror", (error) => errors.push(error.message));

            await page.goto(`/${locale}/tools/${tool.slug}/`);
            const input = page.locator("[data-tool-input]").first();
            await input.fill(tool.example as string);
            const output = page.locator("[data-tool-output]").first();
            await expect(output).not.toHaveValue("");
            const result = await output.inputValue();

            await page.waitForLoadState("networkidle");
            expectNoLeak(requests, new URL(baseURL as string).origin, [
                tool.example as string,
                result,
            ]);
            await expectCleanStorage(page);
            expect(errors).toEqual([]);
        });
    }
}

test("the harness catches a request to another origin", async ({ page, requests, baseURL }) => {
    await page.goto("/en/");
    await page.evaluate(() => fetch("https://example.com/collect?x=1").catch(() => undefined));
    await page.waitForTimeout(200);
    expect(() => expectNoLeak(requests, new URL(baseURL as string).origin, [])).toThrow();
});

test("the harness catches a stored key", async ({ page }) => {
    await page.goto("/en/");
    await page.evaluate(() => localStorage.setItem("history", "secret"));
    await expect(expectCleanStorage(page)).rejects.toThrow();
});
