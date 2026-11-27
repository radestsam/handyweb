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

test.describe("json formatter", () => {
    test("shows the line and column of an error", async ({ page }) => {
        await page.goto("/en/tools/json-formatter/");
        await page.locator("[data-tool-input]").fill('{\n  "a": 1,\n}');
        await expect(page.getByRole("alert")).toContainText("line 3, column 1");
    });

    test("formats a large input in a worker", async ({ page }) => {
        const workers: string[] = [];
        page.on("worker", (worker) => workers.push(worker.url()));
        await page.goto("/en/tools/json-formatter/");
        const big = JSON.stringify(
            Array.from({ length: 30_000 }, (_, i) => ({
                id: i,
                name: `item ${i}`,
                tags: ["a", "b"],
            })),
        );
        expect(big.length).toBeGreaterThan(1_000_000);
        await page.locator("[data-tool-input]").fill(big);
        await expect(page.locator('[data-tool-status="valid"]')).toBeVisible({ timeout: 20_000 });
        const output = await page.locator("[data-tool-output]").inputValue();
        expect(output.startsWith('[\n  {\n    "id": 0,')).toBe(true);
        expect(workers.length).toBeGreaterThan(0);
    });
});

test.describe("persian normalizer", () => {
    test("shows each change and its count", async ({ page }) => {
        await page.goto("/fa/tools/persian-normalizer/");
        await page.locator("[data-tool-input]").fill("كتابـــهاي ١٢ ساله");
        await expect(page.locator("[data-tool-output]")).toHaveValue("کتابهای ۱۲ ساله");
        await expect(page.locator("[data-tool-counts] li")).toHaveCount(3);
        await expect(page.locator("[data-tool-diff] del").first()).toBeVisible();
    });

    test("the digit preset converts every digit to Latin", async ({ page }) => {
        await page.goto("/en/tools/persian-normalizer/?preset=digits-to-latin");
        await page.locator("[data-tool-input]").fill("۱۴۰۴/۰۹/۰۵ و ١٢");
        await expect(page.locator("[data-tool-output]")).toHaveValue("1404/09/05 و 12");
    });
});

test.describe("jalali converter", () => {
    test("converts Persian-digit input and shows the weekday", async ({ page }) => {
        await page.goto("/fa/tools/jalali-converter/");
        await page.locator("[data-tool-input]").fill("۱۴۰۴/۰۱/۰۱");
        await expect(page.locator("[data-tool-output]")).toHaveValue("2025/03/21");
        await expect(page.locator("[data-tool-long]")).toContainText("جمعه");
    });

    test("rejects Esfand 30 in a common year", async ({ page }) => {
        await page.goto("/en/tools/jalali-converter/");
        await page.locator("[data-tool-input]").fill("1404/12/30");
        await expect(page.getByRole("alert")).toContainText("Esfand 1404 has 29 days.");
    });

    test("the preset converts Gregorian to Jalali", async ({ page }) => {
        await page.goto("/en/tools/jalali-converter/?preset=to-jalali");
        await page.locator("[data-tool-input]").fill("2025-11-26");
        await expect(page.locator("[data-tool-output]")).toHaveValue("1404/09/05");
    });
});

test.describe("text counter", () => {
    test("counts a ZWNJ word as one word and shows the reading time", async ({ page }) => {
        await page.goto("/en/tools/text-counter/");
        await page
            .locator("[data-tool-input]")
            .fill("می‌روم به کتاب‌خانه.\n\nSecond paragraph here!");
        const stat = (name: string) => page.locator(`[data-stat="${name}"]`);
        await expect(stat("words")).toHaveText("6");
        await expect(stat("sentences")).toHaveText("2");
        await expect(stat("paragraphs")).toHaveText("2");
        await expect(stat("lines")).toHaveText("3");
        await expect(stat("reading")).toHaveText("2 s");
        await page.getByLabel("Words per minute").fill("60");
        await expect(stat("reading")).toHaveText("6 s");
    });

    test("shows Persian digits on the Persian page", async ({ page }) => {
        await page.goto("/fa/tools/text-counter/");
        await page.locator("[data-tool-input]").fill("یک دو سه");
        await expect(page.locator('[data-stat="words"]')).toHaveText("۳");
    });
});

test.describe("case converter", () => {
    test("uses Chicago title case by default", async ({ page }) => {
        await page.goto("/en/tools/case-converter/");
        await page
            .locator("[data-tool-input]")
            .fill("how to set up a server: a step-by-step guide");
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            "How to Set Up a Server: A Step-by-Step Guide",
        );
        await page.getByText("Sentence", { exact: true }).click();
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            "How to set up a server: a step-by-step guide",
        );
    });

    test("the uppercase preset keeps Persian text", async ({ page }) => {
        await page.goto("/fa/tools/case-converter/?preset=uppercase");
        await page.locator("[data-tool-input]").fill("سلام hello");
        await expect(page.locator("[data-tool-output]")).toHaveValue("سلام HELLO");
    });
});

test.describe("line tools", () => {
    test("removes duplicate lines and shows the count", async ({ page }) => {
        await page.goto("/en/tools/remove-duplicate-lines/");
        await page.locator("[data-tool-input]").fill("b\na\n b\nA");
        await expect(page.locator("[data-tool-output]")).toHaveValue("b\na\nA");
        await expect(page.locator("[data-tool-removed]")).toHaveText("1 duplicate line removed");
        await page.getByLabel("Ignore letter case").check();
        await expect(page.locator("[data-tool-output]")).toHaveValue("b\na");
    });

    test("sorts Persian lines in Persian order with natural numbers", async ({ page }) => {
        await page.goto("/fa/tools/sort-lines/");
        await page.locator("[data-tool-input]").fill("گل\nفصل ۱۰\nپدر\nفصل ۲");
        await expect(page.locator("[data-tool-output]")).toHaveValue("پدر\nفصل ۲\nفصل ۱۰\nگل");
    });

    test("the reverse preset flips the order", async ({ page }) => {
        await page.goto("/en/tools/sort-lines/?preset=reverse");
        await page.locator("[data-tool-input]").fill("b\nc\na");
        await expect(page.locator("[data-tool-output]")).toHaveValue("a\nc\nb");
    });
});
