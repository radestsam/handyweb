import { makePdf } from "../support/pdf";
import { expect, expectCleanStorage, expectNoLeak, test } from "../support/privacy";

/*
 * PDF tools take files, not text, so the text suite (tools.spec.ts) does not
 * run them. This test uploads files made here, runs the tool, and checks that
 * nothing left the browser and nothing was stored.
 */
for (const locale of ["fa", "en"] as const) {
    test(`pdf-merge (${locale}) runs locally and stores nothing`, async ({
        page,
        requests,
        baseURL,
    }) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(`/${locale}/tools/pdf-merge/`);
        await page.locator('input[type="file"]').setInputFiles([
            { name: "secret-contract.pdf", mimeType: "application/pdf", buffer: await makePdf(2) },
            { name: "secret-invoice.pdf", mimeType: "application/pdf", buffer: await makePdf(1) },
        ]);
        await page.locator("[data-tool-run]").click();
        await expect(page.locator("[data-tool-output]")).toHaveValue("3");
        const download = page.waitForEvent("download");
        await page.getByRole("button", { name: locale === "fa" ? "دانلود" : "Download" }).click();
        expect((await download).suggestedFilename()).toBe("secret-contract-merged.pdf");
        await page.waitForLoadState("networkidle");
        expectNoLeak(requests, new URL(baseURL as string).origin, [
            "secret-contract",
            "secret-invoice",
        ]);
        await expectCleanStorage(page, ["secret-contract", "secret-invoice"]);
        expect(errors).toEqual([]);
    });
}

test("images-to-pdf runs locally and stores nothing", async ({ page, requests, baseURL }) => {
    const { makePng } = await import("../support/png");
    await page.goto("/en/tools/images-to-pdf/");
    await page.locator('input[type="file"]').setInputFiles([
        { name: "secret-passport.png", mimeType: "image/png", buffer: makePng(40, 20) },
        { name: "secret-id-card.png", mimeType: "image/png", buffer: makePng(20, 40) },
    ]);
    await page.locator("[data-tool-run]").click();
    await expect(page.locator("[data-tool-output]")).toHaveValue("2");
    const download = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download" }).click();
    expect((await download).suggestedFilename()).toBe("secret-passport.pdf");
    await page.waitForLoadState("networkidle");
    expectNoLeak(requests, new URL(baseURL as string).origin, [
        "secret-passport",
        "secret-id-card",
    ]);
    await expectCleanStorage(page, ["secret-passport", "secret-id-card"]);
});

test("pdf-to-images runs locally and stores nothing", async ({ page, requests, baseURL }) => {
    await page.goto("/en/tools/pdf-to-images/");
    await page.locator('input[type="file"]').setInputFiles({
        name: "secret-bank-statement.pdf",
        mimeType: "application/pdf",
        buffer: await makePdf(2),
    });
    await page.locator("[data-tool-run]").click();
    await expect(page.locator("[data-tool-output]")).toHaveValue("2");
    const download = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download all (ZIP)" }).click();
    expect((await download).suggestedFilename()).toBe("secret-bank-statement-pages.zip");
    await page.waitForLoadState("networkidle");
    expectNoLeak(requests, new URL(baseURL as string).origin, ["secret-bank-statement"]);
    await expectCleanStorage(page, ["secret-bank-statement"]);
});

test("pdf-metadata runs locally and stores nothing", async ({ page, requests, baseURL }) => {
    const { makePdfWithMetadata } = await import("../support/pdf");
    await page.goto("/en/tools/pdf-metadata/");
    await page.locator('input[type="file"]').setInputFiles({
        name: "secret-merger-plan.pdf",
        mimeType: "application/pdf",
        buffer: await makePdfWithMetadata("Secret merger plan", "Jane Roe"),
    });
    await page.locator("[data-tool-clean]").click();
    await expect(page.locator("[data-tool-output]")).toHaveValue("cleaned");
    await page.waitForLoadState("networkidle");
    expectNoLeak(requests, new URL(baseURL as string).origin, [
        "secret-merger-plan",
        "Secret merger plan",
        "Jane Roe",
    ]);
    await expectCleanStorage(page, ["secret-merger-plan", "Jane Roe"]);
});
