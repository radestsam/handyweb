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

test("image-metadata runs locally and stores nothing", async ({ page, requests, baseURL }) => {
    const { RICH_JPEG } = await import("../../packages/tools/src/image/image-metadata/fixtures");
    await page.goto("/en/tools/image-metadata/");
    await page.locator('input[type="file"]').setInputFiles({
        name: "secret-holiday-photo.jpg",
        mimeType: "image/jpeg",
        buffer: Buffer.from(RICH_JPEG),
    });
    await page.locator("[data-tool-run]").click();
    await expect(page.locator("[data-tool-output]")).toHaveValue("0");
    await page.waitForLoadState("networkidle");
    expectNoLeak(requests, new URL(baseURL as string).origin, ["secret-holiday-photo", "SN12345"]);
    await expectCleanStorage(page, ["secret-holiday-photo"]);
});

test("image-color-picker runs locally and stores nothing", async ({ page, requests, baseURL }) => {
    await page.goto("/en/tools/image-color-picker/");
    await page.locator('input[type="file"]').setInputFiles({
        name: "secret-holiday-photo.png",
        mimeType: "image/png",
        buffer: makePng(40, 20),
    });
    await page.locator("[data-tool-canvas][data-ready]").click({ position: { x: 5, y: 5 } });
    await expect(page.locator("[data-tool-output]")).toHaveValue(/^#[0-9a-f]{6}$/);
    await page.waitForLoadState("networkidle");
    expectNoLeak(requests, new URL(baseURL as string).origin, ["secret-holiday-photo"]);
    await expectCleanStorage(page, ["secret-holiday-photo"]);
});

test("image-palette runs locally and stores nothing", async ({ page, requests, baseURL }) => {
    await page.goto("/en/tools/image-palette/");
    await page.locator('input[type="file"]').setInputFiles({
        name: "secret-holiday-photo.png",
        mimeType: "image/png",
        buffer: makePng(40, 20),
    });
    await expect(page.locator("[data-tool-output]")).toHaveValue(/^#[0-9a-f]{6}(,#[0-9a-f]{6})*$/);
    await page.waitForLoadState("networkidle");
    expectNoLeak(requests, new URL(baseURL as string).origin, ["secret-holiday-photo"]);
    await expectCleanStorage(page, ["secret-holiday-photo"]);
});

test("image-compare runs locally and stores nothing", async ({ page, requests, baseURL }) => {
    await page.goto("/en/tools/image-compare/");
    const files = page.locator('input[type="file"]');
    await files.first().setInputFiles({
        name: "secret-before.png",
        mimeType: "image/png",
        buffer: makePng(40, 20),
    });
    await page.locator('[data-compare-slot="second"] input[type="file"]').setInputFiles({
        name: "secret-after.png",
        mimeType: "image/png",
        buffer: makePng(40, 20, true, 2),
    });
    await page.getByRole("radio", { name: "Pixel difference" }).check({ force: true });
    await expect(page.locator("[data-tool-output]")).toHaveValue(/^\d+$/);
    await page.waitForLoadState("networkidle");
    expectNoLeak(requests, new URL(baseURL as string).origin, ["secret-before", "secret-after"]);
    await expectCleanStorage(page, ["secret-before", "secret-after"]);
});

test("image-blur runs locally and stores nothing", async ({ page, requests, baseURL }) => {
    await page.goto("/en/tools/image-blur/");
    await page.locator('input[type="file"]').setInputFiles({
        name: "secret-holiday-photo.png",
        mimeType: "image/png",
        buffer: makePng(40, 20),
    });
    await page.locator("[data-tool-run]").click();
    await expect(page.locator("[data-tool-output]")).toHaveValue(
        "secret-holiday-photo-blurred.png",
    );
    await page.waitForLoadState("networkidle");
    expectNoLeak(requests, new URL(baseURL as string).origin, ["secret-holiday-photo"]);
    await expectCleanStorage(page, ["secret-holiday-photo"]);
});

test("image-pixelate runs locally and stores nothing", async ({ page, requests, baseURL }) => {
    await page.goto("/en/tools/image-pixelate/");
    await page.locator('input[type="file"]').setInputFiles({
        name: "secret-holiday-photo.png",
        mimeType: "image/png",
        buffer: makePng(40, 20),
    });
    await page.locator("[data-tool-run]").click();
    await expect(page.locator("[data-tool-output]")).toHaveValue(
        "secret-holiday-photo-pixelated.png",
    );
    await page.waitForLoadState("networkidle");
    expectNoLeak(requests, new URL(baseURL as string).origin, ["secret-holiday-photo"]);
    await expectCleanStorage(page, ["secret-holiday-photo"]);
});

test("image-watermark runs locally and stores nothing", async ({ page, requests, baseURL }) => {
    await page.goto("/fa/tools/image-watermark/");
    await page.locator('input[type="file"]').setInputFiles({
        name: "secret-holiday-photo.png",
        mimeType: "image/png",
        buffer: makePng(80, 40),
    });
    await page.locator("[data-watermark-text]").fill("متن پنهان من");
    await page.locator("[data-tool-run]").click();
    await expect(page.locator("[data-tool-output]")).toHaveValue(
        "secret-holiday-photo-watermark.png",
    );
    await page.waitForLoadState("networkidle");
    expectNoLeak(requests, new URL(baseURL as string).origin, [
        "secret-holiday-photo",
        "متن پنهان من",
    ]);
    await expectCleanStorage(page, ["secret-holiday-photo", "متن پنهان من"]);
});

test("favicon-generator runs locally and stores nothing", async ({ page, requests, baseURL }) => {
    await page.goto("/en/tools/favicon-generator/");
    await page
        .locator('input[type="file"]')
        .setInputFiles({ name: "secret-logo.png", mimeType: "image/png", buffer: makePng(64, 64) });
    await page.locator("[data-tool-run]").click();
    await expect(page.locator("[data-tool-output]")).toHaveValue(/^\d+$/);
    await page.waitForLoadState("networkidle");
    expectNoLeak(requests, new URL(baseURL as string).origin, ["secret-logo"]);
    await expectCleanStorage(page, ["secret-logo"]);
});

test("code-reader runs locally and stores nothing", async ({ page, requests, baseURL }) => {
    const { makeQr } = await import("../../packages/tools/src/qr/qr-generator/logic");
    const { qrPng } = await import("../support/qr-png");
    await page.goto("/en/tools/code-reader/");
    await page.locator('input[type="file"]').setInputFiles({
        name: "secret-ticket.png",
        mimeType: "image/png",
        buffer: qrPng(makeQr("secret-ticket-code-1234", "M")),
    });
    await expect(page.locator("[data-tool-output]")).toHaveValue("secret-ticket-code-1234");
    await page.waitForLoadState("networkidle");
    expectNoLeak(requests, new URL(baseURL as string).origin, ["secret-ticket"]);
    await expectCleanStorage(page, ["secret-ticket"]);
});
