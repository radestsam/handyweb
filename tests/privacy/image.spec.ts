import { makePng } from "../support/png";
import { expect, expectCleanStorage, expectNoLeak, test } from "../support/privacy";

/*
 * Image tools take a file, not text, so the text suite (tools.spec.ts) does
 * not run them. These tests upload a file made here, run the tool, and check
 * that nothing left the browser and nothing was stored.
 */

for (const locale of ["fa", "en"] as const) {
    test(`image-resize (${locale}) runs locally and stores nothing`, async ({
        page,
        requests,
        baseURL,
    }) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(`/${locale}/tools/image-resize/`);
        await page.locator('input[type="file"]').setInputFiles({
            name: "secret-holiday-photo.png",
            mimeType: "image/png",
            buffer: makePng(1200, 900),
        });
        await page.locator("[data-tool-width]").fill("600");
        await expect(page.locator("[data-tool-height]")).toHaveValue("450");
        await page.locator("[data-tool-run]").click();
        await expect(page.locator("[data-tool-output]")).toHaveValue("600x450");
        const download = page.waitForEvent("download");
        await page.getByRole("button", { name: locale === "fa" ? "دانلود" : "Download" }).click();
        expect((await download).suggestedFilename()).toBe("secret-holiday-photo-600x450.png");
        await page.waitForLoadState("networkidle");
        expectNoLeak(requests, new URL(baseURL as string).origin, ["secret-holiday-photo"]);
        await expectCleanStorage(page, ["secret-holiday-photo"]);
        expect(errors).toEqual([]);
    });
}

for (const slug of [
    "image-rotate",
    "image-flip",
    "image-crop",
    "image-converter",
    "image-compressor",
]) {
    test(`${slug} runs locally and stores nothing`, async ({ page, requests, baseURL }) => {
        await page.goto(`/en/tools/${slug}/`);
        await page.locator('input[type="file"]').setInputFiles({
            name: "secret-holiday-photo.png",
            mimeType: "image/png",
            buffer: makePng(40, 20),
        });
        if (slug === "image-rotate") await page.locator("[data-tool-rotate-right]").click();
        else if (slug === "image-flip") await page.getByLabel("Flip horizontally").check();
        else if (slug === "image-crop") await page.locator('[data-crop-field="width"]').fill("10");
        await page.locator("[data-tool-run]").click();
        const expected: Record<string, RegExp> = {
            "image-rotate": /^20x40$/,
            "image-flip": /^40x20$/,
            "image-crop": /^0,0,10x20$/,
            "image-converter": /^secret-holiday-photo\.png$/,
            "image-compressor": /^\d+$/,
        };
        await expect(page.locator("[data-tool-output]")).toHaveValue(expected[slug] as RegExp);
        await page.waitForLoadState("networkidle");
        expectNoLeak(requests, new URL(baseURL as string).origin, ["secret-holiday-photo"]);
        await expectCleanStorage(page, ["secret-holiday-photo"]);
    });
}
