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

test.describe("text cleaner", () => {
    test("removes extra spaces and invisible characters, keeps ZWNJ", async ({ page }) => {
        await page.goto("/en/tools/text-cleaner/");
        await page.locator("[data-tool-input]").fill("  کتاب‌ها  را​  ببین  \n\n\n\nend");
        await expect(page.locator("[data-tool-output]")).toHaveValue("کتاب‌ها را ببین\n\nend");
        await expect(page.locator("[data-tool-counts]")).toContainText("Zero-width characters");
    });

    test("the Persian preset removes direction marks", async ({ page }) => {
        await page.goto("/fa/tools/text-cleaner/?preset=persian");
        await page.locator("[data-tool-input]").fill("‏سلام‏");
        await expect(page.locator("[data-tool-output]")).toHaveValue("سلام");
    });
});

test.describe("url encoding", () => {
    test("encodes a URL part and a full URL", async ({ page }) => {
        await page.goto("/en/tools/url-encoding/");
        await page.locator("[data-tool-input]").fill("سلام & x");
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            "%D8%B3%D9%84%D8%A7%D9%85%20%26%20x",
        );
        await page.getByText("Full URL", { exact: true }).click();
        await page.locator("[data-tool-input]").fill("https://x.ir/سلام?a=1&b=2");
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            "https://x.ir/%D8%B3%D9%84%D8%A7%D9%85?a=1&b=2",
        );
    });

    test("the decode preset reads a Persian link and reports a broken escape", async ({ page }) => {
        await page.goto("/fa/tools/url-encoding/?preset=decode");
        await page.locator("[data-tool-input]").fill("https://x.ir/%D8%B3%D9%84%D8%A7%D9%85");
        await expect(page.locator("[data-tool-output]")).toHaveValue("https://x.ir/سلام");
        await page.locator("[data-tool-input]").fill("a%2");
        await expect(page.getByRole("alert")).toContainText("جایگاه 2");
    });
});

test.describe("html entities", () => {
    test("encodes special characters and keeps Persian text", async ({ page }) => {
        await page.goto("/en/tools/html-entities/");
        await page.locator("[data-tool-input]").fill('<b>سلام & "x"</b>');
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            "&lt;b&gt;سلام &amp; &quot;x&quot;&lt;/b&gt;",
        );
        await page.getByLabel("Encode non-ASCII characters (such as Persian letters)").check();
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            "&lt;b&gt;&#1587;&#1604;&#1575;&#1605; &amp; &quot;x&quot;&lt;/b&gt;",
        );
    });

    test("the decode preset decodes references and runs no script", async ({ page }) => {
        const dialogs: string[] = [];
        page.on("dialog", (dialog) => {
            dialogs.push(dialog.message());
            void dialog.dismiss();
        });
        await page.goto("/fa/tools/html-entities/?preset=decode");
        await page
            .locator("[data-tool-input]")
            .fill("&#1587;&#x644;&#1575;&#1605; &copy; <img src=x onerror=alert(1)>");
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            "سلام © <img src=x onerror=alert(1)>",
        );
        expect(dialogs).toEqual([]);
    });
});

test.describe("unicode tools", () => {
    test("escapes Persian text and decodes it again", async ({ page }) => {
        await page.goto("/en/tools/unicode-escape/");
        await page.locator("[data-tool-input]").fill("سلام 😀");
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            "\\u0633\\u0644\\u0627\\u0645 \\uD83D\\uDE00",
        );
        await page.getByRole("button", { name: "Swap input and output" }).click();
        await expect(page.locator("[data-tool-output]")).toHaveValue("سلام 😀");
    });

    test("the decode preset reports half of a surrogate pair", async ({ page }) => {
        await page.goto("/fa/tools/unicode-escape/?preset=decode");
        await page.locator("[data-tool-input]").fill("ok \\uD83D");
        await expect(page.getByRole("alert")).toContainText("surrogate");
    });

    test("the inspector names Arabic yeh and highlights ZWNJ", async ({ page }) => {
        await page.goto("/en/tools/unicode-explorer/");
        await page.locator("[data-tool-input]").fill("علي می‌رود");
        const table = page.locator("[data-tool-table]");
        await expect(table).toContainText("ARABIC LETTER YEH");
        await expect(table).toContainText("ARABIC LETTER FARSI YEH");
        await expect(table.locator("tr[data-invisible]")).toHaveCount(2);
        await expect(page.locator('[data-stat="codePoints"]')).toHaveText("10");
    });
});

test.describe("xml formatter", () => {
    test("formats XML and keeps Persian text", async ({ page }) => {
        await page.goto("/en/tools/xml-formatter/");
        await page.locator("[data-tool-input]").fill("<a><b>سلام</b><c/></a>");
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            "<a>\n  <b>سلام</b>\n  <c/>\n</a>\n",
        );
    });

    test("the validate preset shows the line and column of an error", async ({ page }) => {
        await page.goto("/en/tools/xml-formatter/?preset=validate");
        await page.locator("[data-tool-input]").fill("<a>\n  <b></a>");
        await expect(page.getByRole("alert")).toContainText("line 2");
        await page.locator("[data-tool-input]").fill("<a><b/></a>");
        await expect(page.locator("[data-tool-status]")).toContainText("Root: a, 2 elements");
    });
});

test.describe("jwt decoder", () => {
    const b64url = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");

    test("decodes the payload, shows the banner, and never says valid", async ({ page }) => {
        await page.goto("/en/tools/jwt-decoder/");
        const jwt = `${b64url({ alg: "HS256" })}.${b64url({ name: "سارا", exp: 1 })}.c2ln`;
        await page.locator("[data-tool-input]").fill(`Bearer ${jwt}`);
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            '{\n  "name": "سارا",\n  "exp": 1\n}',
        );
        await expect(page.locator("[data-tool-banner]")).toContainText("not verified");
        await expect(page.locator("[data-tool-time]")).toHaveAttribute("data-tool-time", "expired");
        // The FAQ explains the word "valid"; the tool output itself must never use it.
        await expect(page.locator("astro-island")).toContainText("not verified");
        await expect(page.locator("astro-island")).not.toContainText(/\bvalid\b/i);
    });

    test("warns about alg none in Persian", async ({ page }) => {
        await page.goto("/fa/tools/jwt-decoder/");
        await page.locator("[data-tool-input]").fill(`${b64url({ alg: "none" })}.${b64url({})}.`);
        await expect(page.getByText("الگوریتم none است")).toBeVisible();
    });
});

test.describe("hmac", () => {
    test("generates an HMAC and verifies a webhook signature", async ({ page }) => {
        await page.goto("/en/tools/hmac/");
        await page.getByLabel("Message").fill("what do ya want for nothing?");
        await page.getByLabel("Secret key").fill("Jefe");
        const mac = "5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843";
        await expect(page.locator("[data-tool-output]")).toHaveValue(mac);
        await page.getByText("Verify", { exact: true }).click();
        await page.getByLabel("The HMAC you received").fill(`sha256=${mac}`);
        await expect(page.locator("[data-tool-verdict]")).toHaveAttribute(
            "data-tool-verdict",
            "yes",
        );
        await page.getByLabel("Message").fill("changed");
        await expect(page.locator("[data-tool-verdict]")).toHaveAttribute(
            "data-tool-verdict",
            "no",
        );
    });
});

test.describe("password generator", () => {
    test("makes a password of the chosen length and a new one on request", async ({ page }) => {
        await page.goto("/en/tools/password-generator/");
        const input = page.locator("[data-tool-input]");
        const output = page.locator("[data-tool-output]");
        await input.fill("32");
        await expect(output).toHaveValue(/^.{32}$/);
        const first = await output.inputValue();
        await page.getByRole("button", { name: "Generate again" }).click();
        await expect(output).not.toHaveValue(first);
        await page.getByLabel("Symbols (!#$…)").uncheck();
        await expect(output).toHaveValue(/^[A-Za-z0-9]{32}$/);
    });

    test("the passphrase preset uses words", async ({ page }) => {
        await page.goto("/fa/tools/password-generator/?preset=passphrase");
        await page.locator("[data-tool-input]").fill("4");
        await expect(page.locator("[data-tool-output]")).toHaveValue(/^[a-z-]+(-[a-z-]+){3}$/);
        await expect(page.locator("[data-tool-strength]")).toHaveAttribute(
            "data-tool-strength",
            "fair",
        );
    });
});

test.describe("random token", () => {
    test("makes tokens of the chosen alphabet and count", async ({ page }) => {
        await page.goto("/en/tools/random-token/");
        await page.locator("[data-tool-input]").fill("16");
        await page.getByText("Hex", { exact: true }).click();
        await page.getByLabel("How many").fill("3");
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            /^[0-9a-f]{16}\n[0-9a-f]{16}\n[0-9a-f]{16}$/,
        );
        await expect(page.locator("[data-tool-bits]")).toContainText("64");
    });

    test("the bytes preset writes Base64url", async ({ page }) => {
        await page.goto("/fa/tools/random-token/?preset=bytes");
        await page.locator("[data-tool-input]").fill("16");
        await page.getByText("Base64url", { exact: true }).click();
        await expect(page.locator("[data-tool-output]")).toHaveValue(/^[A-Za-z0-9_-]{22}$/);
    });
});

test.describe("uuid generator", () => {
    test("makes v4 UUIDs and inspects a v7 UUID", async ({ page }) => {
        await page.goto("/en/tools/uuid-generator/");
        await page.locator("[data-tool-input]").fill("2");
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            /^[0-9a-f-]{36}\n[0-9a-f-]{36}$/,
        );
        await page
            .getByLabel("Inspect a UUID or ULID")
            .fill("017f22e2-79b0-7cc3-98c4-dc0c0c07398f");
        await expect(page.locator('[data-field="type"]')).toHaveText("UUID v7");
        await expect(page.locator('[data-field="time"]')).toContainText("2022");
    });

    test("the ULID preset makes ULIDs", async ({ page }) => {
        await page.goto("/fa/tools/uuid-generator/?preset=ulid");
        await page.locator("[data-tool-input]").fill("3");
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            /^[0-9A-HJKMNP-TV-Z]{26}(\n[0-9A-HJKMNP-TV-Z]{26}){2}$/,
        );
    });
});

test.describe("text diff", () => {
    test("shows added and removed lines and a patch", async ({ page }) => {
        await page.goto("/en/tools/text-diff/");
        await page.getByLabel("Original text").fill("a\nb\nc");
        await page.getByLabel("Changed text").fill("a\nB\nc");
        await expect(page.locator("[data-tool-summary]")).toContainText("+1 added");
        await expect(page.locator("[data-tool-summary]")).toContainText("−1 removed");
        await expect(page.locator("[data-tool-diff] del")).toHaveText("b");
        await expect(page.locator("[data-tool-output]")).toHaveValue(/-b\n\+B/);
    });

    test("compares Persian words and says when texts are the same", async ({ page }) => {
        await page.goto("/fa/tools/text-diff/");
        await page.getByText("واژه", { exact: true }).click();
        await page.getByLabel("نوشته نخست").fill("به کتاب‌خانه رفتم");
        await page.getByLabel("نوشته دگرگون‌شده").fill("به کتاب‌فروشی رفتم");
        await expect(page.locator("[data-tool-diff] ins")).toHaveText("کتاب‌فروشی");
        await page.getByLabel("نوشته دگرگون‌شده").fill("به کتاب‌خانه رفتم");
        await expect(page.locator("[data-tool-identical]")).toBeVisible();
    });

    test("compares large texts in a worker", async ({ page }) => {
        // fill() types the text and is very slow for 100 KB. Set the value and
        // send one input event, as a paste does.
        const paste = (label: string, text: string) =>
            page.getByLabel(label).evaluate((element, value) => {
                const setter = Object.getOwnPropertyDescriptor(
                    HTMLTextAreaElement.prototype,
                    "value",
                )?.set;
                setter?.call(element, value);
                element.dispatchEvent(new Event("input", { bubbles: true }));
            }, text);
        await page.goto("/en/tools/text-diff/");
        const lines = Array.from({ length: 12_000 }, (_, i) => `line ${i}`);
        await paste("Original text", lines.join("\n"));
        lines[6_000] = "changed";
        await paste("Changed text", lines.join("\n"));
        await expect(page.locator("[data-tool-summary]")).toContainText("+1 added", {
            timeout: 30_000,
        });
        await expect(page.locator("[data-tool-diff]")).toContainText("unchanged lines");
    });
});

test.describe("regex tester", () => {
    test("highlights matches and lists groups", async ({ page }) => {
        await page.goto("/en/tools/regex-tester/");
        await page.getByLabel("Pattern (regex)").fill("(?<year>\\d{4})-(\\d{2})");
        await page.locator("[data-tool-input]").fill("1404-09 and 2025-11");
        await expect(page.locator("[data-tool-count]")).toHaveText("2");
        await expect(page.locator("[data-tool-highlight] mark").first()).toHaveText("1404-09");
        await expect(page.locator("[data-tool-output]")).toHaveValue("0\t1404-09\n12\t2025-11");
    });

    test("stops a catastrophic pattern and warns about it", async ({ page, browserName }) => {
        // JavaScriptCore (WebKit) finishes this pattern fast, so there is no timeout to see.
        test.skip(browserName === "webkit", "The pattern is not slow in JavaScriptCore.");
        await page.goto("/en/tools/regex-tester/");
        await page.getByLabel("Pattern (regex)").fill("^(a+)+$");
        await expect(page.locator("[data-tool-risk]")).toBeVisible();
        await page.locator("[data-tool-input]").fill(`${"a".repeat(40)}!`);
        await expect(page.getByRole("alert")).toContainText("stopped", { timeout: 10_000 });
    });

    test("shows an invalid pattern in Persian", async ({ page }) => {
        await page.goto("/fa/tools/regex-tester/");
        await page.getByLabel("الگو (regex)").fill("(abc");
        await page.locator("[data-tool-input]").fill("abc");
        await expect(page.getByRole("alert")).toContainText("الگو درست نیست");
    });
});

test.describe("unix timestamp", () => {
    test("reads milliseconds and shows ISO and Jalali dates", async ({ page }) => {
        await page.goto("/en/tools/unix-timestamp/");
        await page.locator("[data-tool-input]").fill("1732700000000");
        await expect(page.locator("[data-tool-detected]")).toContainText("milliseconds");
        await expect(page.locator("[data-tool-output]")).toHaveValue("2024-11-27T09:33:20.000Z");
        await expect(page.locator('[data-row="unixSeconds"]')).toHaveText("1732700000");
        await expect(page.locator('[data-row="jalaliTime"]')).toContainText("1403");
    });

    test("turns a Jalali date into a timestamp", async ({ page }) => {
        await page.goto("/fa/tools/unix-timestamp/");
        await page.getByText("UTC", { exact: true }).click();
        await page.locator("[data-tool-input]").fill("۱۴۰۴/۰۹/۰۶ ۱۰:۳۰");
        await expect(page.locator("[data-tool-output]")).toHaveValue("2025-11-27T10:30:00.000Z");
        await expect(page.locator('[data-row="unixSeconds"]')).toHaveText("1764239400");
    });
});

test.describe("number base", () => {
    test("converts a hex number to every base", async ({ page }) => {
        await page.goto("/en/tools/number-base/");
        await page.locator("[data-tool-input]").fill("0xFF");
        await expect(page.locator('[data-base="2"]')).toHaveText("11111111");
        await expect(page.locator('[data-base="10"]')).toHaveText("255");
        await expect(page.locator('[data-base="target"]')).toHaveText("73");
        await expect(page.locator("[data-tool-meta]")).toContainText("8 bits");
    });

    test("the binary preset reads Persian digits and reports a bad digit", async ({ page }) => {
        await page.goto("/fa/tools/number-base/?preset=binary");
        await page.locator("[data-tool-input]").fill("۱۰۱۰");
        await expect(page.locator('[data-base="10"]')).toHaveText("10");
        await page.locator("[data-tool-input]").fill("102");
        await expect(page.getByRole("alert")).toContainText("2");
    });
});

test.describe("qr generator", () => {
    test("draws a QR code for a URL and saves a PNG", async ({ page }) => {
        await page.goto("/en/tools/qr-generator/");
        await page.locator("[data-tool-input]").fill("https://handyweb.ir/");
        await expect(page.locator("[data-tool-qr]")).toBeVisible();
        await expect(page.locator("[data-tool-version]")).toContainText("Version 2");
        await expect(page.locator("[data-tool-output]")).toHaveValue(/^<svg /);
        const download = page.waitForEvent("download");
        await page.getByRole("button", { name: "Download PNG" }).click();
        expect((await download).suggestedFilename()).toBe("qr-code.png");
    });

    test("warns about inverted colors in Persian", async ({ page }) => {
        await page.goto("/fa/tools/qr-generator/");
        await page.locator("[data-tool-input]").fill("سلام");
        await page.getByLabel("رنگ نقطه‌ها").fill("#ffffff");
        await page.getByLabel("رنگ زمینه").fill("#000000");
        await expect(page.locator("[data-tool-warning]")).toHaveAttribute(
            "data-tool-warning",
            "inverted",
        );
    });
});

test.describe("small text tools", () => {
    test("reverse text reverses words", async ({ page }) => {
        await page.goto("/en/tools/reverse-text/?preset=words");
        await page.locator("[data-tool-input]").fill("one two three");
        await expect(page.locator("[data-tool-output]")).toHaveValue("three two one");
    });

    test("text repeater repeats with a new line", async ({ page }) => {
        await page.goto("/fa/tools/text-repeater/");
        await page.locator("[data-tool-input]").fill("سلام");
        await expect(page.locator("[data-tool-output]")).toHaveValue("سلام\nسلام\nسلام");
    });

    test("split and join round trip", async ({ page }) => {
        await page.goto("/en/tools/split-join/");
        await page.locator("[data-tool-input]").fill("a, b,,c");
        await expect(page.locator("[data-tool-output]")).toHaveValue("a\nb\nc");
        await page.getByText("Join", { exact: true }).click();
        await page.getByLabel("Delimiter").fill(";");
        await page.locator("[data-tool-input]").fill("a\nb");
        await expect(page.locator("[data-tool-output]")).toHaveValue("a;b");
    });
});

test.describe("find and replace", () => {
    test("replaces whole Persian words and counts", async ({ page }) => {
        await page.goto("/fa/tools/find-replace/");
        await page.getByLabel("جستجو برای").fill("کتاب");
        await page.getByLabel("جایگزین با").fill("دفتر");
        await page.getByLabel("تنها واژه کامل").check();
        await page.locator("[data-tool-input]").fill("کتاب کتابخانه کتاب");
        await expect(page.locator("[data-tool-output]")).toHaveValue("دفتر کتابخانه دفتر");
        await expect(page.locator("[data-tool-count]")).toContainText("۲");
    });

    test("the regex preset uses groups", async ({ page }) => {
        await page.goto("/en/tools/find-replace/?preset=regex");
        await page.getByLabel("Find").fill("(\\d+)-(\\d+)");
        await page.getByLabel("Replace with").fill("$2-$1");
        await page.locator("[data-tool-input]").fill("12-34");
        await expect(page.locator("[data-tool-output]")).toHaveValue("34-12");
    });
});

test.describe("json string", () => {
    test("escapes and unescapes", async ({ page }) => {
        await page.goto("/en/tools/json-string/");
        await page.locator("[data-tool-input]").fill('a "b"\nc');
        await expect(page.locator("[data-tool-output]")).toHaveValue('a \\"b\\"\\nc');
        await page.getByRole("button", { name: "Swap input and output" }).click();
        await expect(page.locator("[data-tool-output]")).toHaveValue('a "b"\nc');
    });
});

test.describe("slug, lorem, and extractor", () => {
    test("makes Latin and Persian slugs", async ({ page }) => {
        await page.goto("/en/tools/slug-generator/");
        await page.locator("[data-tool-input]").fill("Hello, World!\nشیراز زیبا");
        await expect(page.locator("[data-tool-output]")).toHaveValue("hello-world\nshiraz-ziba");
        await page.getByText("Keep Persian", { exact: true }).click();
        await expect(page.locator("[data-tool-output]")).toHaveValue("hello-world\nشیراز-زیبا");
    });

    test("makes Persian placeholder paragraphs", async ({ page }) => {
        await page.goto("/fa/tools/lorem-ipsum/");
        await page.locator("[data-tool-input]").fill("2");
        await expect(page.locator("[data-tool-output]")).toHaveValue(/^[^\n]+\n\n[^\n]+$/);
    });

    test("extracts phone numbers with Persian digits", async ({ page }) => {
        await page.goto("/fa/tools/text-extractor/?preset=phones");
        await page.locator("[data-tool-input]").fill("شماره ۰۹۱۲۳۴۵۶۷۸۹ و 09121112233");
        await expect(page.locator("[data-tool-output]")).toHaveValue("09123456789\n09121112233");
    });
});

test.describe("number to words", () => {
    test("writes an amount in Toman", async ({ page }) => {
        await page.goto("/fa/tools/number-to-words/?preset=toman");
        await page.locator("[data-tool-input]").fill("۱٬۲۵۰٬۰۰۰");
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            "یک میلیون و دویست و پنجاه هزار تومان",
        );
    });

    test("writes an ordinal and reports a bad number", async ({ page }) => {
        await page.goto("/en/tools/number-to-words/");
        await page.getByLabel("Ordinal (بیست و یکم)").check();
        await page.locator("[data-tool-input]").fill("23");
        await expect(page.locator("[data-tool-output]")).toHaveValue("بیست و سوم");
        await page.locator("[data-tool-input]").fill("12x");
        await expect(page.getByRole("alert")).toContainText("Enter a number");
    });
});

test.describe("zwnj fixer", () => {
    test("adds half-spaces and lists the changes", async ({ page }) => {
        await page.goto("/fa/tools/zwnj-fixer/");
        await page.locator("[data-tool-input]").fill("کتاب ها را می خوانم");
        await expect(page.locator("[data-tool-output]")).toHaveValue("کتاب‌ها را می‌خوانم");
        await expect(page.locator("[data-tool-counts] li")).toHaveCount(2);
    });
});

test.describe("punctuation and direction", () => {
    test("fixes Persian punctuation", async ({ page }) => {
        await page.goto("/fa/tools/punctuation-fixer/");
        await page.locator("[data-tool-input]").fill('سلام , "دوست" خوبی ?');
        await expect(page.locator("[data-tool-output]")).toHaveValue("سلام، «دوست» خوبی؟");
    });

    test("adds an LRM after C++ and removes marks", async ({ page }) => {
        await page.goto("/en/tools/direction-fixer/");
        await page.locator("[data-tool-input]").fill("من C++ بلدم");
        await expect(page.locator("[data-tool-output]")).toHaveValue("من C++‎ بلدم");
        await page.getByText("Remove", { exact: true }).click();
        await expect(page.locator("[data-tool-output]")).toHaveValue("من C++ بلدم");
    });
});

test.describe("yaml tools", () => {
    test("formats YAML and reports an error line", async ({ page }) => {
        await page.goto("/en/tools/yaml-formatter/");
        await page.locator("[data-tool-input]").fill("a:\n      b: 1\n");
        await expect(page.locator("[data-tool-output]")).toHaveValue("a:\n  b: 1\n");
        await page.locator("[data-tool-input]").fill("a: [1, 2\nb: 3\n");
        await expect(page.getByRole("alert")).toContainText("line");
    });

    test("converts YAML to JSON and swaps back", async ({ page }) => {
        await page.goto("/fa/tools/json-yaml/?preset=yaml-to-json");
        await page.locator("[data-tool-input]").fill("name: سارا\n");
        await expect(page.locator("[data-tool-output]")).toHaveValue('{\n  "name": "سارا"\n}');
        await page.getByRole("button", { name: "جابه‌جایی ورودی و خروجی" }).click();
        await expect(page.locator("[data-tool-output]")).toHaveValue("name: سارا\n");
    });
});

test.describe("sql formatter", () => {
    test("formats a query", async ({ page }) => {
        await page.goto("/en/tools/sql-formatter/?preset=postgresql");
        await page.locator("[data-tool-input]").fill("select a from t where x=1");
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            "SELECT\n  a\nFROM\n  t\nWHERE\n  x = 1",
        );
        await page.locator("[data-tool-input]").fill("select (a from t");
        await expect(page.getByRole("alert")).toContainText("line 1");
    });
});

test.describe("web formatters", () => {
    test("formats CSS, JavaScript, and HTML", async ({ page }) => {
        await page.goto("/en/tools/css-formatter/");
        await page.locator("[data-tool-input]").fill("a{color:red}");
        await expect(page.locator("[data-tool-output]")).toHaveValue("a {\n  color: red\n}\n");
        await page.goto("/en/tools/js-formatter/");
        await page.locator("[data-tool-input]").fill("if(a){b()}");
        await expect(page.locator("[data-tool-output]")).toHaveValue("if (a) {\n  b()\n}\n");
        await page.goto("/fa/tools/html-formatter/");
        await page.locator("[data-tool-input]").fill("<ul><li>یک</li><li>دو</li></ul>");
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            "<ul>\n  <li>یک</li>\n  <li>دو</li>\n</ul>\n",
        );
    });
});

test.describe("json csv", () => {
    test("converts JSON to CSV and downloads it", async ({ page }) => {
        await page.goto("/en/tools/json-csv/");
        await page.locator("[data-tool-input]").fill('[{"a":"x, y","b":1}]');
        await expect(page.locator("[data-tool-output]")).toHaveValue('a,b\n"x, y",1');
        const download = page.waitForEvent("download");
        await page.getByRole("button", { name: "Download file" }).click();
        expect((await download).suggestedFilename()).toBe("data.csv");
    });

    test("the CSV preset reads a semicolon file", async ({ page }) => {
        await page.goto("/fa/tools/json-csv/?preset=csv-to-json");
        await page.locator("[data-tool-input]").fill("name;age\nسارا;30");
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            '[\n  {\n    "name": "سارا",\n    "age": 30\n  }\n]',
        );
    });
});

test.describe("json diff", () => {
    test("lists structural differences", async ({ page }) => {
        await page.goto("/en/tools/json-diff/");
        await page.getByLabel("First JSON").fill('{"a":1,"b":2}');
        await page.getByLabel("Second JSON").fill('{"b":2,"a":3}');
        await expect(page.locator("[data-tool-count]")).toHaveText("1");
        await expect(page.locator("[data-tool-output]")).toHaveValue("~ $.a: 1 → 3");
        await page.getByLabel("Second JSON").fill('{ "b": 2, "a": 1 }');
        await expect(page.locator("[data-tool-identical]")).toBeVisible();
    });
});

test.describe("json schema validator", () => {
    test("lists errors with their paths", async ({ page }) => {
        await page.goto("/en/tools/json-schema-validator/");
        await page
            .getByLabel("Schema (JSON Schema)")
            .fill('{"type":"object","properties":{"age":{"type":"integer","minimum":0}}}');
        await page.getByLabel("JSON data").fill('{"age":-5}');
        await expect(page.locator("[data-tool-status]")).toHaveAttribute(
            "data-tool-status",
            "invalid",
        );
        await expect(page.locator("[data-tool-output]")).toHaveValue("/age: -5 is less than 0.");
        await page.getByLabel("JSON data").fill('{"age":5}');
        await expect(page.locator("[data-tool-status]")).toHaveAttribute(
            "data-tool-status",
            "valid",
        );
    });
});
