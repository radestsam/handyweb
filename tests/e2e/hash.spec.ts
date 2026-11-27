import { createHash } from "node:crypto";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

test.describe("hash tool", () => {
    test("hashes text and compares it with an expected value", async ({ page }) => {
        await page.goto("/en/tools/hash/");
        await page.locator("[data-tool-input]").fill("abc");
        const expected = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";
        await expect(page.locator("[data-tool-output]")).toHaveValue(expected);
        await page
            .getByLabel("Compare with an expected hash (optional)")
            .fill(expected.toUpperCase());
        await expect(page.locator("[data-tool-match]")).toHaveAttribute("data-tool-match", "yes");
    });

    test("the SHA-512 preset hashes text and files", async ({ page }) => {
        await page.goto("/en/tools/hash/?preset=sha512");
        const algorithm = page.getByRole("group", { name: "Algorithm" });
        await page.locator("[data-tool-input]").fill("abc");
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            createHash("sha512").update("abc").digest("hex"),
        );
        await algorithm.getByText("SHA-384", { exact: true }).click();
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            createHash("sha384").update("abc").digest("hex"),
        );
        await page.getByText("File", { exact: true }).click();
        const data = Buffer.alloc(3_000_000, 9);
        await page.locator('input[type="file"]').setInputFiles({
            name: "sample.bin",
            mimeType: "application/octet-stream",
            buffer: data,
        });
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            createHash("sha384").update(data).digest("hex"),
        );
        await algorithm.getByText("SHA-512", { exact: true }).click();
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            createHash("sha512").update(data).digest("hex"),
        );
    });

    test("hashes a file in a worker without uploading it", async ({ page }) => {
        const data = Buffer.alloc(5_000_000, 7);
        const requests: string[] = [];
        page.on("request", (request) => {
            if (request.method() !== "GET") requests.push(`${request.method()} ${request.url()}`);
        });
        await page.goto("/en/tools/hash/?preset=file");
        await page.locator('input[type="file"]').setInputFiles({
            name: "sample.bin",
            mimeType: "application/octet-stream",
            buffer: data,
        });
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            createHash("sha256").update(data).digest("hex"),
        );
        expect(requests).toEqual([]);
    });

    test("cancel stops the job and terminates the worker", async ({ page, browserName }) => {
        test.skip(browserName !== "chromium", "One engine is enough for the large-file test.");
        const dir = mkdtempSync(join(tmpdir(), "handyweb-"));
        const path = join(dir, "large.bin");
        writeFileSync(path, Buffer.alloc(800_000_000, 1));
        try {
            const closed = new Promise<void>((resolve) => {
                page.on("worker", (worker) => worker.on("close", () => resolve()));
            });
            await page.goto("/en/tools/hash/?preset=file");
            await page.locator('input[type="file"]').setInputFiles(path);
            await page.locator("[data-tool-cancel]").click();
            await closed;
            await expect(page.getByRole("alert")).toContainText("canceled");
            await expect(page.locator("[data-tool-output]")).toHaveValue("");
        } finally {
            rmSync(dir, { recursive: true, force: true });
        }
    });
});
