import { expect, test } from "@playwright/test";

test.describe("tool pages", () => {
    test("the base64 tool encodes, swaps, and decodes", async ({ page }) => {
        await page.goto("/en/tools/base64/");
        await expect(page.locator("[data-privacy]")).toHaveAttribute("data-privacy", "local");
        await page.locator("[data-tool-input]").fill("سلام");
        await expect(page.locator("[data-tool-output]")).toHaveValue("2LPZhNin2YU=");
        await page.getByRole("button", { name: "Swap input and output" }).click();
        await expect(page.locator("[data-tool-output]")).toHaveValue("سلام");
    });

    test("an invalid input shows an error, not a result", async ({ page }) => {
        await page.goto("/fa/tools/base64/?preset=decode");
        await page.locator("[data-tool-input]").fill("Zm9v*mFy");
        await expect(page.getByRole("alert")).toContainText("5");
        await expect(page.locator("[data-tool-output]")).toHaveValue("");
    });

    test("an alias page redirects to the canonical tool", async ({ page }) => {
        await page.goto("/en/tools/base64-encoder/");
        await page.waitForURL("**/en/tools/base64/");
        await expect(page.locator("h1")).toHaveText("Base64 Encoder and Decoder");
    });

    test("the tool is listed in the directory and its categories", async ({ page }) => {
        await page.goto("/fa/tools/");
        await expect(
            page.locator('[data-tool-list] a[href="/fa/tools/base64/"]').first(),
        ).toBeVisible();
        await page.goto("/en/categories/developer/");
        await expect(page.locator("[data-tool-list] a")).toContainText([
            "Base64 Encoder and Decoder",
        ]);
    });

    test("a tool page loads only its own tool chunk", async ({ page }) => {
        const scripts: string[] = [];
        page.on("request", (request) => {
            if (request.resourceType() === "script") scripts.push(new URL(request.url()).pathname);
        });
        await page.goto("/en/about/");
        expect(scripts.some((s) => s.includes("ToolIsland"))).toBe(false);
        await page.goto("/en/tools/base64/");
        await expect(page.locator("[data-tool-input]")).toBeVisible();
        expect(scripts.some((s) => s.includes("ToolIsland"))).toBe(true);
    });
});

test("the sitemap lists canonical pages only", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    expect(xml).toContain("<loc>https://handyweb.ir/fa/tools/base64/</loc>");
    expect(xml).toContain("<loc>https://handyweb.ir/en/categories/encoding/</loc>");
    expect(xml).toContain('hreflang="x-default" href="https://handyweb.ir/fa/tools/base64/"');
    expect(xml).not.toContain("base64-encoder");
    expect(xml).not.toContain("/categories/pdf/");
});
