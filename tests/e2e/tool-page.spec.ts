import { expect, test, type Download, type Page } from "@playwright/test";

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
    expect(xml).toContain("<loc>https://handyweb.ir/en/categories/pdf/</loc>");
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

test.describe("color converter", () => {
    test("converts a color name and shows contrast", async ({ page }) => {
        await page.goto("/en/tools/color-converter/");
        await page.locator("[data-tool-input]").fill("tomato");
        await expect(page.locator("[data-tool-output]")).toHaveValue("#ff6347");
        await expect(page.locator('[data-format="rgb"]')).toHaveText("rgb(255 99 71)");
        await expect(page.getByText("On white:")).toBeVisible();
    });
});

test.describe("url parser", () => {
    test("splits a URL and flags a credentials trick", async ({ page }) => {
        await page.goto("/en/tools/url-parser/");
        await page
            .locator("[data-tool-input]")
            .fill("https://google.com@evil.example/login?next=https://x.example/");
        await expect(page.locator('[data-part="host"]')).toHaveText("evil.example");
        await expect(page.locator("[data-tool-flags]")).toHaveAttribute(
            "data-tool-flags",
            "credentials redirect-param",
        );
        await expect(page.locator("[data-tool-params]")).toContainText("next");
    });
});

test.describe("cron parser", () => {
    test("describes an expression and lists runs", async ({ page }) => {
        await page.goto("/en/tools/cron-parser/");
        await page.locator("[data-tool-input]").fill("30 9 * * 1-5");
        await expect(page.locator("[data-tool-meaning]")).toHaveText(
            "At 09:30, on Monday, Tuesday, Wednesday, Thursday and Friday.",
        );
        await expect(page.locator("[data-tool-runs] li")).toHaveCount(10);
        await page.locator("[data-tool-input]").fill("61 * * * *");
        await expect(page.getByRole("alert")).toContainText("61");
    });
});

test.describe("header and user-agent parsers", () => {
    test("checks response security headers", async ({ page }) => {
        await page.goto("/en/tools/http-header-parser/");
        await page
            .locator("[data-tool-input]")
            .fill("HTTP/1.1 200 OK\nX-Content-Type-Options: nosniff\nSet-Cookie: sid=1; Secure");
        await expect(page.locator("[data-tool-kind]")).toHaveAttribute(
            "data-tool-kind",
            "response",
        );
        await expect(page.locator('[data-check="nosniff"]')).toHaveAttribute("data-ok", "true");
        await expect(page.locator('[data-check="hsts"]')).toHaveAttribute("data-ok", "false");
    });

    test("reads this browser's User-Agent", async ({ page }) => {
        await page.goto("/fa/tools/user-agent-parser/");
        await page.getByRole("button", { name: "User-Agent این مرورگر" }).click();
        await expect(page.locator('[data-field="browser"]')).not.toHaveText("ناشناخته");
    });
});

test.describe("hex and binary", () => {
    test("encodes text to hex and back", async ({ page }) => {
        await page.goto("/en/tools/hex/");
        await page.locator("[data-tool-input]").fill("سلام");
        await expect(page.locator("[data-tool-output]")).toHaveValue("D8 B3 D9 84 D8 A7 D9 85");
        await page.getByRole("button", { name: "Swap input and output" }).click();
        await expect(page.locator("[data-tool-output]")).toHaveValue("سلام");
    });

    test("the binary decode preset reads bits", async ({ page }) => {
        await page.goto("/fa/tools/binary/?preset=decode");
        await page.locator("[data-tool-input]").fill("01001000 01101001");
        await expect(page.locator("[data-tool-output]")).toHaveValue("Hi");
    });
});

test.describe("base64 file", () => {
    test("encodes a file to a Data URI", async ({ page }) => {
        await page.goto("/en/tools/base64-file/");
        await page.locator('input[type="file"]').setInputFiles({
            name: "hello.txt",
            mimeType: "text/plain",
            buffer: Buffer.from("hello"),
        });
        await expect(page.getByText("data:text/plain;base64,aGVsbG8=")).toBeVisible();
    });

    test("decodes a Data URI and downloads the file", async ({ page }) => {
        await page.goto("/fa/tools/base64-file/?preset=decode");
        await page.locator("[data-tool-input]").fill("data:text/plain;base64,aGVsbG8=");
        await expect(page.locator("[data-tool-decoded]")).toContainText("text/plain");
        const download = page.waitForEvent("download");
        await page.getByRole("button", { name: "دانلود فایل" }).click();
        expect((await download).suggestedFilename()).toBe("file.bin");
    });
});

test.describe("gzip", () => {
    test("compresses text and decompresses it again", async ({ page }) => {
        await page.goto("/en/tools/gzip/");
        await page.locator("[data-tool-input]").fill("hello hello hello hello");
        await expect(page.locator("[data-tool-output]")).toHaveValue(/^H4sI/);
        const base64 = await page.locator("[data-tool-output]").inputValue();
        await page.getByText("Decompress", { exact: true }).click();
        await page.locator("[data-tool-input]").fill(base64);
        await expect(page.locator("[data-tool-output]")).toHaveValue("hello hello hello hello");
    });
});

test.describe("subtitle converter", () => {
    test("converts SRT to VTT with a shift", async ({ page }) => {
        await page.goto("/en/tools/subtitle-converter/");
        await page.getByLabel("Time shift (seconds)").fill("1.5");
        await page.locator("[data-tool-input]").fill("1\n00:00:01,000 --> 00:00:02,000\nسلام\n");
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            "WEBVTT\n\n00:00:02.500 --> 00:00:03.500\nسلام\n",
        );
    });

    test("repairs a Windows-1256 file", async ({ page }) => {
        await page.goto("/fa/tools/subtitle-converter/");
        const header = Buffer.from("1\r\n00:00:01,000 --> 00:00:02,000\r\n");
        await page.locator('input[type="file"]').setInputFiles({
            name: "movie.srt",
            mimeType: "application/x-subrip",
            buffer: Buffer.concat([header, Buffer.from([0xd3, 0xe1, 0xc7, 0xe3])]),
        });
        await expect(page.locator("[data-tool-input]")).toHaveValue(/سلام/);
    });
});

test.describe("aes-gcm", () => {
    test("encrypts and decrypts text", async ({ page }) => {
        await page.goto("/en/tools/aes-gcm/");
        await page.getByLabel("Passphrase", { exact: true }).fill("correct horse");
        await page.getByLabel("Text", { exact: true }).fill("سلام");
        await expect(page.locator("[data-tool-output]")).toHaveValue(/^A[Q-Za-f]/, {
            timeout: 15_000,
        });
        await page.getByText("Decrypt", { exact: true }).click();
        await expect(page.locator("[data-tool-output]")).toHaveValue("سلام", { timeout: 15_000 });
        await page.getByLabel("Passphrase", { exact: true }).fill("wrong");
        await expect(page.getByRole("alert")).toContainText("passphrase is wrong", {
            timeout: 15_000,
        });
    });
});

test.describe("totp", () => {
    test("shows the RFC 6238 code at a fixed time", async ({ page }) => {
        await page.clock.setFixedTime(new Date(59_000));
        await page.goto("/en/tools/totp/");
        // "12345678901234567890" in Base32.
        await page.locator("[data-tool-input]").fill("GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ");
        await page.getByText("8", { exact: true }).click();
        await expect(page.locator("[data-tool-output]")).toHaveValue("94287082");
    });
});

test.describe("file signature", () => {
    test("flags a program named as an image", async ({ page }) => {
        await page.goto("/en/tools/file-signature/");
        await page.locator('input[type="file"]').setInputFiles({
            name: "photo.jpg",
            mimeType: "image/jpeg",
            buffer: Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03]),
        });
        await expect(page.locator("[data-tool-type]")).toContainText("Windows program");
        await expect(page.locator("[data-tool-warning]")).toContainText("does not match");
    });
});

test.describe("pem decoder", () => {
    test("reads a certificate and refuses a private key", async ({ page }) => {
        const { pemDecoderMeta } = await import("../../packages/tools/src/crypto/pem-decoder/meta");
        await page.goto("/en/tools/pem-decoder/");
        await page.locator("[data-tool-input]").fill(pemDecoderMeta.example as string);
        await expect(page.locator('[data-field="san"]')).toHaveText(
            "DNS:handyweb.ir, DNS:www.handyweb.ir",
        );
        await page
            .locator("[data-tool-input]")
            .fill(
                "-----BEGIN PRIVATE KEY-----\nMC4CAQAwBQYDK2VwBCIEIA==\n-----END PRIVATE KEY-----",
            );
        await expect(page.getByRole("alert")).toContainText("private key");
    });
});

test.describe("html preview", () => {
    test("renders HTML in the sandbox and blocks network and scripts", async ({ page }) => {
        // A request that the CSP blocks fails before it is sent. Count only
        // requests that finished, that is, that reached a server.
        const external: string[] = [];
        page.on("requestfinished", (request) => {
            if (!request.url().startsWith("http://localhost")) external.push(request.url());
        });
        const dialogs: string[] = [];
        page.on("dialog", (dialog) => {
            dialogs.push(dialog.message());
            void dialog.dismiss();
        });
        await page.goto("/en/tools/html-preview/");
        await page
            .locator("[data-tool-input]")
            .fill(
                '<h1 id="t">سلام</h1><img src="https://example.com/x.png"><script>alert(1)</script>',
            );
        const frame = page.frameLocator("[data-tool-frame]");
        await expect(frame.locator("#t")).toHaveText("سلام");
        await page.waitForTimeout(500);
        expect(external).toEqual([]);
        expect(dialogs).toEqual([]);
        await expect(page.locator("[data-tool-frame]")).toHaveAttribute("sandbox", "");
    });
});

test.describe("markdown editor", () => {
    test("previews Markdown and removes scripts", async ({ page }) => {
        const dialogs: string[] = [];
        page.on("dialog", (dialog) => {
            dialogs.push(dialog.message());
            void dialog.dismiss();
        });
        await page.goto("/fa/tools/markdown-editor/");
        await page.locator("[data-tool-input]").fill("# سلام\n\n<script>alert(1)</script>");
        await expect(page.frameLocator("[data-tool-frame]").locator("h1")).toHaveText("سلام");
        await expect(page.locator("[data-tool-output]")).not.toHaveValue(/script/);
        expect(dialogs).toEqual([]);
    });
});

test.describe("image resize", () => {
    test("applies the EXIF orientation and refuses a huge image before decoding", async ({
        page,
    }) => {
        const { makePng } = await import("../support/png");
        await page.goto("/en/tools/image-resize/");
        // A 5 x 3 JPEG with EXIF orientation 6 shows as 3 x 5.
        await page.locator('input[type="file"]').setInputFiles({
            name: "turned.jpg",
            mimeType: "image/jpeg",
            buffer: Buffer.from(
                "/9j/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAAAAAD/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAABaADAAQAAAABAAAAAwAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgAAwAFAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMAAgICAgICAwICAwUDAwMFBgUFBQUGCAYGBgYGCAoICAgICAgKCgoKCgoKCgwMDAwMDA4ODg4ODw8PDw8PDw8PD//bAEMBAgICBAQEBwQEBxALCQsQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEP/dAAQAAf/aAAwDAQACEQMRAD8A+e6KKK/Gz/Sw/9k=",
                "base64",
            ),
        });
        await expect(page.locator("[data-tool-source-size]")).toContainText("3 × 5");
        await page.getByRole("button", { name: "Another image" }).click();
        // The header says 10000 x 10000 (100 megapixels); there are no pixels.
        await page.locator('input[type="file"]').setInputFiles({
            name: "huge.png",
            mimeType: "image/png",
            buffer: makePng(10_000, 10_000, false),
        });
        await expect(page.getByRole("alert")).toContainText("50 megapixels");
    });
});

test.describe("image rotate", () => {
    test("rotates pixels clockwise", async ({ page }) => {
        const { makePng } = await import("../support/png");
        await page.goto("/en/tools/image-rotate/");
        // Red is 60 x column and green is 60 x row, so each pixel has its own color.
        await page.locator('input[type="file"]').setInputFiles({
            name: "a.png",
            mimeType: "image/png",
            buffer: makePng(4, 2, true, 60),
        });
        await page.locator("[data-tool-rotate-right]").click();
        await page.locator("[data-tool-run]").click();
        await expect(page.locator("[data-tool-output]")).toHaveValue("2x4");
        const pixels = await page.locator("section img").evaluate(async (img: HTMLImageElement) => {
            await img.decode();
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const context = canvas.getContext("2d") as CanvasRenderingContext2D;
            context.drawImage(img, 0, 0);
            return [...context.getImageData(0, 0, 2, 4).data].filter((_, k) => k % 4 < 2);
        });
        // A clockwise turn puts the old pixel (x, y) at (1 - y, x). Some
        // browsers (Brave) add noise of 1 or 2 to read-back pixels.
        const expected = [0, 60, 0, 0, 60, 60, 60, 0, 120, 60, 120, 0, 180, 60, 180, 0];
        pixels.forEach((value, index) =>
            expect(Math.abs(value - (expected[index] as number))).toBeLessThanOrEqual(3),
        );
    });
});

test.describe("image crop", () => {
    test("drags the area, keeps the ratio, and crops", async ({ page }) => {
        const { makePng } = await import("../support/png");
        await page.goto("/en/tools/image-crop/");
        await page
            .locator('input[type="file"]')
            .setInputFiles({ name: "a.png", mimeType: "image/png", buffer: makePng(400, 200) });
        await page.locator("[data-crop-ratio]").selectOption("1:1");
        await expect(page.locator('[data-crop-field="x"]')).toHaveValue("100");
        await expect(page.locator('[data-crop-field="width"]')).toHaveValue("200");
        // Drag the area to the left edge: it stops at x = 0.
        const area = page.locator("[data-crop-area]");
        const box = (await area.boundingBox())!;
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x - 500, box.y + box.height / 2, { steps: 5 });
        await page.mouse.up();
        await expect(page.locator('[data-crop-field="x"]')).toHaveValue("0");
        // Typing the width keeps the square.
        await page.locator('[data-crop-field="width"]').fill("50");
        await expect(page.locator('[data-crop-field="height"]')).toHaveValue("50");
        await page.locator("[data-tool-run]").click();
        await expect(page.locator("[data-tool-output]")).toHaveValue("0,0,50x50");
    });
});

test.describe("image converter", () => {
    // The test reads the result with fetch(blob:). The site never does that, so
    // its connect-src does not allow it.
    test.use({ bypassCSP: true });
    test("the png-to-jpg preset writes a JPEG", async ({ page }) => {
        const { makePng } = await import("../support/png");
        await page.goto("/en/tools/image-converter/?preset=png-to-jpg");
        await page
            .locator('input[type="file"]')
            .setInputFiles({ name: "logo.png", mimeType: "image/png", buffer: makePng(60, 40) });
        await page.locator("[data-tool-run]").click();
        await expect(page.locator("[data-tool-output]")).toHaveValue("logo.jpg");
        const head = await page.locator("section img").evaluate(async (img: HTMLImageElement) => {
            const bytes = new Uint8Array(await (await fetch(img.src)).arrayBuffer());
            return [...bytes.slice(0, 3)];
        });
        expect(head).toEqual([0xff, 0xd8, 0xff]);
    });
});

test.describe("image compressor", () => {
    test("makes a large photo smaller and limits the size", async ({ page }) => {
        const { makePng } = await import("../support/png");
        await page.goto("/en/tools/image-compressor/");
        await page.locator('input[type="file"]').setInputFiles({
            name: "photo.png",
            mimeType: "image/png",
            buffer: makePng(1600, 1200),
        });
        await page.getByLabel("Maximum longest side").selectOption("800");
        await page.locator("[data-tool-run]").click();
        await expect(page.locator("[data-tool-result-size]")).toContainText("800 × 600");
        await expect(page.locator("[data-tool-result-size]")).toContainText("smaller");
        await expect(page.locator("[data-tool-larger]")).toHaveCount(0);
    });
});

test.describe("image metadata", () => {
    test("warns about GPS, removes metadata, and the clean file still opens", async ({ page }) => {
        const { RICH_JPEG } =
            await import("../../packages/tools/src/image/image-metadata/fixtures");
        const { readMetadata } =
            await import("../../packages/tools/src/image/image-metadata/logic");
        await page.goto("/fa/tools/image-metadata/");
        await page.locator('input[type="file"]').setInputFiles({
            name: "photo.jpg",
            mimeType: "image/jpeg",
            buffer: Buffer.from(RICH_JPEG),
        });
        await expect(page.locator("[data-tool-gps]")).toContainText("35.69000, 51.38333");
        await page.locator("[data-tool-run]").click();
        await expect(page.locator("[data-tool-verified]")).toBeVisible();
        const download = page.waitForEvent("download");
        await page.getByRole("button", { name: "دانلود" }).click();
        const file = await download;
        expect(file.suggestedFilename()).toBe("photo-clean.jpg");
        const { readFile } = await import("node:fs/promises");
        const clean = new Uint8Array(await readFile((await file.path()) as string));
        expect(readMetadata(clean).exif?.gps).toBeNull();
        // The browser can still open the clean file.
        const size = await page.evaluate(
            async (data) => {
                const bitmap = await createImageBitmap(
                    new Blob([new Uint8Array(data)], { type: "image/jpeg" }),
                );
                return [bitmap.width, bitmap.height];
            },
            [...clean],
        );
        expect(size).toEqual([3, 5]);
    });
});

test.describe("image color picker", () => {
    test("picks a pixel by click and moves it with the keyboard", async ({ page }) => {
        const { makePng } = await import("../support/png");
        await page.goto("/en/tools/image-color-picker/");
        // Red is 60 x column, green is 60 x row, blue is 128.
        await page.locator('input[type="file"]').setInputFiles({
            name: "a.png",
            mimeType: "image/png",
            buffer: makePng(4, 4, true, 60),
        });
        const canvas = page.locator("[data-tool-canvas][data-ready]");
        await expect(canvas).toBeVisible();
        const box = (await canvas.boundingBox())!;
        // The center of pixel (2, 1).
        await canvas.click({ position: { x: (box.width / 4) * 2.5, y: (box.height / 4) * 1.5 } });
        const rgb = async () => {
            const hex = await page.locator("[data-tool-output]").inputValue();
            return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
        };
        const near = (got: number[], want: number[]) =>
            got.forEach((v, i) => expect(Math.abs(v - (want[i] as number))).toBeLessThanOrEqual(3));
        near(await rgb(), [120, 60, 128]);
        await canvas.press("ArrowRight");
        await canvas.press("ArrowDown");
        near(await rgb(), [180, 120, 128]);
    });
});

test.describe("image palette", () => {
    test("finds the colors and changes the count", async ({ page }) => {
        const { makePng } = await import("../support/png");
        await page.goto("/en/tools/image-palette/");
        await page.locator('input[type="file"]').setInputFiles({
            name: "a.png",
            mimeType: "image/png",
            buffer: makePng(64, 64, true, 4),
        });
        await expect(page.locator("[data-tool-palette] li")).toHaveCount(8);
        await page.getByRole("radio", { name: "5" }).check({ force: true });
        await expect(page.locator("[data-tool-palette] li")).toHaveCount(5);
        await expect(page.locator("pre")).toContainText("--color-5:");
    });
});

test.describe("image compare", () => {
    test("counts changed pixels and finds equal images", async ({ page }) => {
        const { makePng } = await import("../support/png");
        await page.goto("/en/tools/image-compare/");
        await page
            .locator('[data-compare-slot="first"] input[type="file"]')
            .setInputFiles({ name: "a.png", mimeType: "image/png", buffer: makePng(10, 10) });
        // Step 30 changes red and green by more than the threshold, except in
        // columns and rows 0 and 9 (9 x 30 = 270 wraps to 14). So 4 pixels stay the same.
        await page.locator('[data-compare-slot="second"] input[type="file"]').setInputFiles({
            name: "b.png",
            mimeType: "image/png",
            buffer: makePng(10, 10, true, 30),
        });
        await page.getByRole("radio", { name: "Pixel difference" }).check({ force: true });
        await expect(page.locator("[data-tool-output]")).toHaveValue("96");
        await expect(page.locator("[data-tool-diff]")).toContainText("96 pixels changed (96.00%)");
        await page.getByRole("button", { name: "Other images" }).click();
        await page
            .locator('[data-compare-slot="first"] input[type="file"]')
            .setInputFiles({ name: "a.png", mimeType: "image/png", buffer: makePng(10, 10) });
        await page
            .locator('[data-compare-slot="second"] input[type="file"]')
            .setInputFiles({ name: "c.png", mimeType: "image/png", buffer: makePng(10, 10) });
        await page.getByRole("radio", { name: "Pixel difference" }).check({ force: true });
        await expect(page.locator("[data-tool-diff]")).toContainText("the same");
    });
});

test.describe("image blur", () => {
    test("blurs only the drawn area", async ({ page }) => {
        const { makePng } = await import("../support/png");
        await page.goto("/en/tools/image-blur/?preset=area");
        // Red is 8 x column: a strong left-to-right gradient.
        await page.locator('input[type="file"]').setInputFiles({
            name: "a.png",
            mimeType: "image/png",
            buffer: makePng(32, 16, true, 8),
        });
        const frame = page.locator("[data-effect-frame]");
        const box = (await frame.boundingBox())!;
        // Draw the right half.
        await page.mouse.move(box.x + box.width * 0.5, box.y + 1);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width - 0.5, box.y + box.height - 0.5, { steps: 4 });
        await page.mouse.up();
        await expect(page.locator("[data-effect-region]")).toBeVisible();
        await page.locator("[data-tool-run]").click();
        await expect(page.locator("[data-tool-output]")).toHaveValue("a-blurred.png");
        const reds = await page
            .locator("[data-effect-frame] img")
            .evaluate(async (img: HTMLImageElement) => {
                await img.decode();
                const canvas = document.createElement("canvas");
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const context = canvas.getContext("2d") as CanvasRenderingContext2D;
                context.drawImage(img, 0, 0);
                const line = context.getImageData(0, 8, 32, 1).data;
                return [...line].filter((_, i) => i % 4 === 0);
            });
        // The left half is not changed: red still goes up by 8 each pixel (Brave adds noise of 1 or 2).
        for (let x = 0; x < 14; x++)
            expect(Math.abs((reds[x] as number) - x * 8)).toBeLessThanOrEqual(3);
        // The right half is blurred: its far edge is pulled toward the inside.
        expect(reds[31] as number).toBeLessThan(31 * 8 - 10);
    });
});

test.describe("image pixelate", () => {
    test("makes blocks of one color", async ({ page }) => {
        const { makePng } = await import("../support/png");
        await page.goto("/en/tools/image-pixelate/");
        await page.locator('input[type="file"]').setInputFiles({
            name: "a.png",
            mimeType: "image/png",
            buffer: makePng(32, 32, true, 8),
        });
        await page.locator("[data-effect-strength]").fill("16");
        await page.locator("[data-tool-run]").click();
        await expect(page.locator("[data-tool-output]")).toHaveValue("a-pixelated.png");
        const reds = await page
            .locator("[data-effect-frame] img")
            .evaluate(async (img: HTMLImageElement) => {
                await img.decode();
                const canvas = document.createElement("canvas");
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const context = canvas.getContext("2d") as CanvasRenderingContext2D;
                context.drawImage(img, 0, 0);
                return [...context.getImageData(0, 0, 32, 1).data].filter((_, i) => i % 4 === 0);
            });
        // Columns 0 to 15 average to 60, and 16 to 31 to 188 (Brave adds noise of 1 or 2).
        for (let x = 0; x < 32; x++)
            expect(Math.abs((reds[x] as number) - (x < 16 ? 60 : 188))).toBeLessThanOrEqual(3);
    });
});

test.describe("image watermark", () => {
    test("draws white text in the chosen corner only", async ({ page }) => {
        const { makePng } = await import("../support/png");
        await page.goto("/en/tools/image-watermark/");
        // A dark picture: red and green are 0, blue is 128.
        await page.locator('input[type="file"]').setInputFiles({
            name: "a.png",
            mimeType: "image/png",
            buffer: makePng(400, 200, true, 0),
        });
        await page.locator("[data-watermark-text]").fill("WATERMARK");
        await page.locator('[data-watermark-field="opacity"]').fill("100");
        await page.locator("[data-tool-run]").click();
        await expect(page.locator("[data-tool-output]")).toHaveValue("a-watermark.png");
        const bright = await page.locator("section img").evaluate(async (img: HTMLImageElement) => {
            await img.decode();
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const context = canvas.getContext("2d") as CanvasRenderingContext2D;
            context.drawImage(img, 0, 0);
            const count = (x: number, y: number, w: number, h: number) =>
                [...context.getImageData(x, y, w, h).data].filter((v, i) => i % 4 === 0 && v > 200)
                    .length;
            return { bottomRight: count(200, 100, 200, 100), topLeft: count(0, 0, 200, 100) };
        });
        expect(bright.bottomRight).toBeGreaterThan(50);
        expect(bright.topLeft).toBe(0);
    });
});

test.describe("favicon generator", () => {
    test("downloads a ZIP with a valid ICO and icons of the right sizes", async ({ page }) => {
        const { makePng } = await import("../support/png");
        const { readStoredZip } = await import("../../packages/core/src/files/zip");
        const { readImageHeader } = await import("../../packages/core/src/image/size");
        await page.goto("/en/tools/favicon-generator/");
        await page
            .locator('input[type="file"]')
            .setInputFiles({ name: "logo.png", mimeType: "image/png", buffer: makePng(600, 600) });
        await page.getByRole("radio", { name: "Rounded" }).check({ force: true });
        await page.locator("[data-tool-run]").click();
        await expect(page.locator("[data-favicon-previews] li")).toHaveCount(6);
        const download = page.waitForEvent("download");
        await page.getByRole("button", { name: "Download the ZIP" }).click();
        const file = await download;
        expect(file.suggestedFilename()).toBe("favicon.zip");
        const { readFile } = await import("node:fs/promises");
        const entries = readStoredZip(
            new Uint8Array(await readFile((await file.path()) as string)),
        );
        expect(entries.map((e) => e.name)).toEqual([
            "favicon.ico",
            "apple-touch-icon.png",
            "icon-192.png",
            "icon-512.png",
            "site.webmanifest",
        ]);
        const size = (name: string) =>
            readImageHeader(entries.find((e) => e.name === name)!.data)?.width;
        expect([size("apple-touch-icon.png"), size("icon-192.png"), size("icon-512.png")]).toEqual([
            180, 192, 512,
        ]);
        const ico = entries[0]!.data;
        const view = new DataView(ico.buffer, ico.byteOffset);
        expect(view.getUint16(4, true)).toBe(3);
        // The first image in the ICO is a 16 x 16 PNG.
        const first = ico.subarray(view.getUint32(18, true));
        expect(readImageHeader(first)).toMatchObject({ format: "png", width: 16, height: 16 });
    });
});

test.describe("svg viewer", () => {
    test("removes a script, loads nothing, and exports a PNG", async ({ page }) => {
        const dialogs: string[] = [];
        page.on("dialog", (dialog) => {
            dialogs.push(dialog.message());
            void dialog.dismiss();
        });
        const external: string[] = [];
        page.on("requestfinished", (request) => {
            if (!/^(http:\/\/localhost|blob:|data:)/.test(request.url()))
                external.push(request.url());
        });
        await page.goto("/en/tools/svg-viewer/");
        await page
            .locator("[data-tool-input]")
            .fill(
                '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20" onload="alert(1)"><script>alert(2)</script><image href="https://example.com/t.png" width="1" height="1"/><rect width="40" height="20" fill="red"/></svg>',
            );
        await expect(page.locator("[data-svg-risks]")).toContainText("Script");
        await expect(page.locator("[data-svg-preview]")).toBeVisible();
        await expect(page.locator("[data-tool-output]")).not.toHaveValue(
            /script|onload|example\.com/,
        );
        const download = page.waitForEvent("download");
        await page.locator("[data-svg-png]").click();
        expect((await download).suggestedFilename()).toBe("image-512x256.png");
        await page.waitForTimeout(300);
        expect(dialogs).toEqual([]);
        expect(external).toEqual([]);
    });
});

test.describe("svg optimizer", () => {
    test("makes the example smaller and the result still opens as an image", async ({ page }) => {
        const { svgOptimizerMeta } =
            await import("../../packages/tools/src/image/svg-optimizer/meta");
        await page.goto("/en/tools/svg-optimizer/");
        await page.locator("[data-tool-input]").fill(svgOptimizerMeta.example as string);
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 12L20 12" stroke="#bc4a3c" stroke-width="2"/></svg>',
        );
        await expect(page.locator("[data-svg-saving]")).toContainText("smaller");
        const size = await page
            .getByRole("img", { name: "After" })
            .evaluate(async (img: HTMLImageElement) => {
                await img.decode();
                return img.naturalWidth > 0;
            });
        expect(size).toBe(true);
    });
});

test.describe("unit converter", () => {
    test("the mesghal preset converts Persian digits to grams", async ({ page }) => {
        await page.goto("/fa/tools/unit-converter/?preset=mesghal-to-gram");
        await page.locator("[data-tool-input]").fill("۲٫۵");
        await expect(page.locator('[data-unit="g"] [data-unit-value]')).toHaveText("۱۱٫۵۲");
        await page.locator("[data-unit-kind]").selectOption("temperature");
        await page.locator("[data-tool-input]").fill("100");
        await expect(page.locator('[data-unit="f"] [data-unit-value]')).toHaveText("۲۱۲");
    });
});

test.describe("percentage calculator", () => {
    test("answers with Persian digits", async ({ page }) => {
        await page.goto("/fa/tools/percentage-calculator/");
        await page.locator("[data-tool-input]").fill("۲۰");
        await expect(page.locator("[data-tool-output]")).toHaveValue("30");
        const change = page.locator('[data-percent="change"]');
        await expect(change).toContainText("افزایش");
        await expect(change).toContainText("۲۵");
    });
});

test.describe("discount calculator", () => {
    test("stacks two discounts", async ({ page }) => {
        await page.goto("/en/tools/discount-calculator/");
        await page.locator("[data-tool-input]").fill("100");
        await page.getByLabel("Second discount (optional)").fill("10");
        await expect(page.locator('[data-discount="final"]')).toHaveText("72");
        await expect(page.locator('[data-discount="total"]')).toHaveText("28%");
        await expect(page.locator('[data-discount="reverse"]')).toHaveText("20%");
    });
});

test.describe("vat calculator", () => {
    test("takes VAT out with the remove preset", async ({ page }) => {
        await page.goto("/en/tools/vat-calculator/?preset=remove");
        await page.locator("[data-tool-input]").fill("1,100,000");
        await expect(page.locator('[data-vat="net"]')).toHaveText("1,000,000");
        await expect(page.locator('[data-vat="vat"]')).toHaveText("100,000");
    });
});

test.describe("date difference", () => {
    test("counts Jalali days and keeps the days when the calendar changes", async ({ page }) => {
        await page.goto("/fa/tools/date-difference/");
        await page.locator("[data-tool-input]").fill("۱۴۰۳/۱۲/۰۱");
        await page.getByLabel("تا تاریخ").fill("1404/01/01");
        await expect(page.locator('[data-date="days"]')).toContainText("۳۰");
        await page.getByRole("radio", { name: "میلادی" }).check({ force: true });
        await expect(page.locator("[data-tool-input]")).toHaveValue("2025/02/19");
        await expect(page.locator('[data-date="days"]')).toContainText("۳۰");
    });
});

test.describe("aspect ratio", () => {
    test("simplifies a size and finds the other side", async ({ page }) => {
        await page.goto("/en/tools/aspect-ratio/");
        await page.locator("[data-tool-input]").fill("1366");
        await page.getByLabel("Height", { exact: true }).first().fill("768");
        await expect(page.locator('[data-ratio="simple"]')).toHaveText("683:384");
        await expect(page.locator('[data-ratio="near"]')).toHaveText("16:9");
        await page.getByRole("button", { name: "4:5" }).click();
        await page.getByLabel("Size").fill("1080");
        await expect(page.locator('[data-ratio="other"]')).toHaveText("1,350");
    });
});

test.describe("image resolution", () => {
    test("gives the print size and the pixels for A4", async ({ page }) => {
        await page.goto("/en/tools/image-resolution/");
        await page.locator("[data-tool-input]").fill("3000");
        await page.getByLabel("Height (pixels)").fill("2000");
        await page.getByRole("radio", { name: "in" }).check({ force: true });
        await expect(page.locator('[data-resolution="print"]')).toContainText("10 × 6.7");
        await expect(page.locator('[data-resolution="need"]')).toContainText("2,480 × 3,508");
    });
});

test.describe("css units", () => {
    test("converts px to rem with a custom root size", async ({ page }) => {
        await page.goto("/en/tools/css-units/");
        await page.locator("[data-tool-input]").fill("24");
        await expect(page.locator('[data-css="rem"]')).toContainText("1.5rem");
        await page.locator("summary", { hasText: /^Context$/ }).click();
        await page.getByLabel("Root font size (px)").fill("10");
        await expect(page.locator('[data-css="rem"]')).toContainText("2.4rem");
        await expect(page.locator('[data-css="pt"]')).toContainText("18pt");
    });
});

test.describe("roman numerals", () => {
    test("converts both ways and refuses a non-standard numeral", async ({ page }) => {
        await page.goto("/fa/tools/roman-numerals/");
        await page.locator("[data-tool-input]").fill("۱۹۹۴");
        await expect(page.locator('[data-roman="roman"]')).toHaveText("MCMXCIV");
        await page.locator("[data-tool-input]").fill("mmxxvi");
        await expect(page.locator('[data-roman="number"]')).toHaveText("۲۰۲۶");
        await page.locator("[data-tool-input]").fill("IIII");
        await expect(page.getByRole("alert")).toBeVisible();
    });
});

test.describe("binary calculator", () => {
    test("adds binary numbers and does XOR", async ({ page }) => {
        await page.goto("/en/tools/binary-calculator/");
        await page.locator("[data-tool-input]").fill("1010");
        await expect(page.locator('[data-binary="decimal"]')).toHaveText("16");
        await page.locator("[data-binary-op]").selectOption("XOR");
        await expect(page.locator('[data-binary="binary"]')).toHaveText("1100");
    });
});

test.describe("color contrast", () => {
    test("fails a light gray and fixes it with the suggestion", async ({ page }) => {
        await page.goto("/en/tools/color-contrast/");
        await page.locator("[data-tool-input]").fill("#777777");
        await expect(page.locator('[data-contrast="ratio"]')).toHaveText("4.47:1");
        await page
            .locator('[data-contrast="suggestion"]')
            .getByRole("button", { name: "Use it" })
            .click();
        await expect(page.locator('[data-contrast="suggestion"]')).toHaveCount(0);
        const ratio = Number((await page.locator("[data-tool-output]").inputValue()) || 0);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
});

test.describe("time zone converter", () => {
    test("converts noon in Tehran to other zones", async ({ page }) => {
        await page.goto("/en/tools/time-zone-converter/");
        await page.locator("[data-tz-from]").selectOption("Asia/Tehran");
        await page.locator("[data-tool-input]").fill("2026-03-21T12:00");
        await expect(page.locator("[data-tool-output]")).toHaveValue("2026-03-21T08:30:00.000Z");
        await expect(page.locator('[data-tz="UTC"]')).toContainText("8:30");
        await expect(page.locator('[data-tz="Asia/Tokyo"]')).toContainText("5:30");
        await expect(page.locator('[data-tz="Asia/Tehran"]')).toContainText("UTC+03:30");
    });
});

test.describe("barcode generator", () => {
    test("adds the EAN check digit, and a barcode reader decodes it", async ({ page }) => {
        await page.goto("/en/tools/barcode-generator/?preset=ean13");
        await page.locator("[data-tool-input]").fill("400638133393");
        await expect(page.locator("[data-tool-output]")).toHaveValue("4006381333931");
        for (const [format, text] of [
            ["EAN-13", "4006381333931"],
            ["Code 128", "HW-2026-001"],
        ] as const) {
            await page.getByRole("radio", { name: format }).check({ force: true });
            await page.locator("[data-tool-input]").fill(text);
            // Chromium has a barcode reader (BarcodeDetector); it checks the bars independently.
            const decoded = await page
                .locator("[data-barcode-image]")
                .evaluate(async (img: HTMLImageElement) => {
                    await img.decode();
                    const Detector = (
                        window as unknown as {
                            BarcodeDetector?: new (o: object) => {
                                detect: (
                                    i: ImageBitmapSource,
                                ) => Promise<Array<{ rawValue: string }>>;
                            };
                        }
                    ).BarcodeDetector;
                    if (!Detector) return null;
                    const bitmap = await createImageBitmap(img);
                    const found = await new Detector({ formats: ["ean_13", "code_128"] }).detect(
                        bitmap,
                    );
                    return found[0]?.rawValue ?? "";
                });
            if (decoded !== null) expect(decoded).toBe(text);
        }
    });
});

test.describe("code reader", () => {
    test("reads a Wi-Fi QR code from a picture and asks for no camera", async ({
        page,
        context,
    }) => {
        const { makeQr } = await import("../../packages/tools/src/qr/qr-generator/logic");
        const { qrPng } = await import("../support/qr-png");
        await page.goto("/en/tools/code-reader/");
        await page.locator('input[type="file"]').setInputFiles({
            name: "wifi.png",
            mimeType: "image/png",
            buffer: qrPng(makeQr("WIFI:T:WPA;S:Cafe Net;P:secret123;;", "M")),
        });
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            "WIFI:T:WPA;S:Cafe Net;P:secret123;;",
        );
        await expect(page.getByText("Wi-Fi network")).toBeVisible();
        await expect(page.getByText("Cafe Net", { exact: true })).toBeVisible();
        // Opening the page and reading a picture must not touch the camera.
        const asked = await page.evaluate(
            async () =>
                (await navigator.permissions.query({ name: "camera" as PermissionName })).state,
        );
        expect(asked).toBe("prompt");
        await context.clearPermissions();
    });
});

test.describe("ip calculator", () => {
    test("works out IPv4 and IPv6 subnets", async ({ page }) => {
        await page.goto("/fa/tools/ip-calculator/");
        await page.locator("[data-tool-input]").fill("10.1.2.3 255.255.240.0");
        await expect(page.locator('[data-ip="network"]')).toContainText("10.1.0.0");
        await expect(page.locator('[data-ip="hosts"]')).toContainText("۴٬۰۹۴");
        await expect(page.locator('[data-ip="special"]')).toContainText("خصوصی");
        await page.locator("[data-tool-input]").fill("2001:db8::1/64");
        await expect(page.locator('[data-ip="last"]')).toContainText(
            "2001:db8::ffff:ffff:ffff:ffff",
        );
        await expect(page.locator('[data-ip="addresses"]')).toContainText("2^64");
    });
});

test.describe("mac formatter", () => {
    test("formats many addresses and reads the local bit", async ({ page }) => {
        await page.goto("/en/tools/mac-formatter/");
        await page.locator("[data-tool-input]").fill("da-a1-19-00-00-01\nnot a mac");
        await page.getByRole("radio", { name: "001A.2B3C" }).check({ force: true });
        await expect(page.locator("[data-tool-output]")).toHaveValue(
            "DAA1.1900.0001\n# not a mac (not valid)",
        );
        await expect(page.locator('[data-mac="origin"]')).toContainText("Local or random");
    });
});

test.describe("http status", () => {
    test("finds a code and filters by class", async ({ page }) => {
        await page.goto("/fa/tools/http-status/");
        await page.locator("[data-tool-input]").fill("۴۲۹");
        await expect(page.locator("[data-status-list] li")).toHaveCount(1);
        await expect(page.locator('[data-status="429"]')).toContainText("درخواست بیش از اندازه");
        await page.locator("[data-tool-input]").fill("");
        await page.getByRole("radio", { name: "5xx" }).check({ force: true });
        await expect(page.locator('[data-status="503"]')).toBeVisible();
        await expect(page.locator('[data-status="404"]')).toHaveCount(0);
    });
});

test.describe("mime types", () => {
    test("finds a type from a file name", async ({ page }) => {
        await page.goto("/en/tools/mime-types/");
        await page.locator("[data-tool-input]").fill("photo.HEIC");
        await expect(page.locator("[data-tool-output]")).toHaveValue("image/heic");
        await page.locator("[data-tool-input]").fill("font/");
        await expect(page.locator('[data-mime="font/woff2"]')).toBeVisible();
    });
});

test.describe("ip ranges", () => {
    test("names a range and says when an address is public", async ({ page }) => {
        await page.goto("/en/tools/ip-ranges/");
        await page.locator("[data-tool-input]").fill("172.20.1.1");
        await expect(page.locator("[data-range-answer]")).toContainText("172.16.0.0/12");
        await page.locator("[data-tool-input]").fill("1.1.1.1");
        await expect(page.locator("[data-range-answer]")).toContainText("public");
    });
});

test.describe("qr generator presets", () => {
    test("the Wi-Fi preset makes a code that the reader reads back", async ({ page }) => {
        const { parseWifi } = await import("../../packages/tools/src/qr/code-reader/logic");
        await page.goto("/en/tools/qr-generator/?preset=wifi");
        await page.locator('[data-qr-field="ssid"]').fill("Cafe;Net");
        await page.locator('[data-qr-field="password"]').fill("p@ss:1");
        await page.getByText("Code content").click();
        const payload = (await page.locator("[data-qr-payload]").textContent()) ?? "";
        expect(parseWifi(payload)).toEqual({
            ssid: "Cafe;Net",
            password: "p@ss:1",
            security: "WPA",
            hidden: false,
        });
        await expect(page.locator("[data-tool-qr]")).toBeVisible();
    });
});

test.describe("pdf merger", () => {
    test("merges files in the chosen order", async ({ page }) => {
        const { makePdf, pageWidths } = await import("../support/pdf");
        await page.goto("/en/tools/pdf-merge/");
        await page.locator('input[type="file"]').setInputFiles([
            { name: "a.pdf", mimeType: "application/pdf", buffer: await makePdf(2, 0) },
            { name: "b.pdf", mimeType: "application/pdf", buffer: await makePdf(1, 10) },
        ]);
        await expect(page.locator("[data-tool-files] li")).toHaveCount(2);
        await expect(page.locator("[data-tool-total-pages]")).toHaveText("3 pages");
        await page.getByRole("button", { name: "Move up: b.pdf" }).click();
        await page.locator("[data-tool-run]").click();
        await expect(page.locator("[data-tool-output]")).toHaveValue("3");
        const download = page.waitForEvent("download");
        await page.getByRole("button", { name: "Download" }).click();
        const file = await download;
        expect(file.suggestedFilename()).toBe("b-merged.pdf");
        const { readFile } = await import("node:fs/promises");
        const bytes = await readFile((await file.path()) as string);
        expect(await pageWidths(bytes)).toEqual([110, 100, 101]);
    });

    test("does not add a file that is not a PDF", async ({ page }) => {
        const { makePdf } = await import("../support/pdf");
        await page.goto("/fa/tools/pdf-merge/");
        await page.locator('input[type="file"]').setInputFiles([
            { name: "a.pdf", mimeType: "application/pdf", buffer: await makePdf(1) },
            { name: "notes.pdf", mimeType: "application/pdf", buffer: Buffer.from("hello") },
        ]);
        await expect(page.locator("[data-tool-files] li")).toHaveCount(1);
        await expect(page.locator("[data-tool-skipped] li")).toContainText("notes.pdf");
        await expect(page.locator("[data-tool-run]")).toBeDisabled();
    });
});

test.describe("images to pdf", () => {
    test("puts each image on its own page in the chosen order", async ({ page }) => {
        const { makePng } = await import("../support/png");
        const { pageWidths } = await import("../support/pdf");
        await page.goto("/en/tools/images-to-pdf/");
        await page.locator('input[type="file"]').setInputFiles([
            { name: "wide.png", mimeType: "image/png", buffer: makePng(40, 20) },
            { name: "tall.png", mimeType: "image/png", buffer: makePng(20, 40) },
        ]);
        await expect(page.locator("[data-tool-files] li")).toHaveCount(2);
        await page.getByRole("button", { name: "Move down: wide.png" }).click();
        await page.getByText("Same as image", { exact: true }).click();
        await page.getByText("None", { exact: true }).click();
        await expect(page.getByRole("radio", { name: "Same as image" })).toBeChecked();
        await expect(page.getByRole("radio", { name: "None" })).toBeChecked();
        await page.locator("[data-tool-run]").click();
        await expect(page.locator("[data-tool-output]")).toHaveValue("2");
        const download = page.waitForEvent("download");
        await page.getByRole("button", { name: "Download" }).click();
        const file = await download;
        expect(file.suggestedFilename()).toBe("tall.pdf");
        const { readFile } = await import("node:fs/promises");
        expect(await pageWidths(await readFile((await file.path()) as string))).toEqual([15, 30]);
    });

    test("does not add a file that is not an image", async ({ page }) => {
        const { makePng } = await import("../support/png");
        await page.goto("/fa/tools/images-to-pdf/");
        await page.locator('input[type="file"]').setInputFiles([
            { name: "photo.png", mimeType: "image/png", buffer: makePng(10, 10) },
            { name: "notes.jpg", mimeType: "image/jpeg", buffer: Buffer.from("hello") },
        ]);
        await expect(page.locator("[data-tool-files] li")).toHaveCount(1);
        await expect(page.locator("[data-tool-skipped] li")).toContainText("notes.jpg");
    });
});

test.describe("pdf to images", () => {
    test("renders the chosen pages and zips them", async ({ page }) => {
        const { makePdf } = await import("../support/pdf");
        const { readStoredZip } = await import("../../packages/core/src/files/zip");
        await page.goto("/en/tools/pdf-to-images/");
        await page.locator('input[type="file"]').setInputFiles({
            name: "report.pdf",
            mimeType: "application/pdf",
            buffer: await makePdf(3),
        });
        await expect(page.locator("[data-tool-page-count]")).toContainText("3 pages");
        await page.getByText("72 dpi", { exact: true }).click();
        await page.locator("[data-tool-pages]").fill("2-3");
        await page.locator("[data-tool-run]").click();
        await expect(page.locator("[data-tool-output]")).toHaveValue("2");
        await expect(page.locator("[data-tool-images] li")).toHaveCount(2);
        await expect(page.locator("[data-tool-images] li").first()).toContainText("101 × 200");
        const download = page.waitForEvent("download");
        await page.getByRole("button", { name: "Download all (ZIP)" }).click();
        const file = await download;
        const { readFile } = await import("node:fs/promises");
        const entries = readStoredZip(
            new Uint8Array(await readFile((await file.path()) as string)),
        );
        expect(entries.map((entry) => entry.name)).toEqual([
            "report-page-2.png",
            "report-page-3.png",
        ]);
        expect([...(entries[0]?.data.slice(0, 4) ?? [])]).toEqual([0x89, 0x50, 0x4e, 0x47]);
    });

    test("explains a bad page list and a locked PDF", async ({ page }) => {
        const { makePdf } = await import("../support/pdf");
        const { PDFDocument } = await import("@cantoo/pdf-lib");
        await page.goto("/fa/tools/pdf-to-images/");
        await page.locator('input[type="file"]').setInputFiles({
            name: "a.pdf",
            mimeType: "application/pdf",
            buffer: await makePdf(2),
        });
        await page.locator("[data-tool-pages]").fill("5");
        await page.locator("[data-tool-run]").click();
        await expect(page.getByRole("alert")).toContainText("۲");
        await page.getByRole("button", { name: "PDF دیگر" }).click();
        const locked = await PDFDocument.create();
        locked.addPage();
        locked.encrypt({ userPassword: "secret", ownerPassword: "owner" });
        await page.locator('input[type="file"]').setInputFiles({
            name: "locked.pdf",
            mimeType: "application/pdf",
            buffer: Buffer.from(await locked.save()),
        });
        await expect(page.getByRole("alert")).toContainText("گذرواژه");
    });
});

test.describe("pdf metadata", () => {
    test("edits the title and removes the author", async ({ page }) => {
        const { makePdfWithMetadata } = await import("../support/pdf");
        const { PDFDocument } = await import("@cantoo/pdf-lib");
        await page.goto("/en/tools/pdf-metadata/");
        await page.locator('input[type="file"]').setInputFiles({
            name: "plan.pdf",
            mimeType: "application/pdf",
            buffer: await makePdfWithMetadata("Draft", "Jane Roe"),
        });
        await expect(page.locator('[data-tool-field="Title"]')).toHaveValue("Draft");
        await expect(page.locator('[data-tool-field="Author"]')).toHaveValue("Jane Roe");
        await page.locator('[data-tool-field="Title"]').fill("گزارش نهایی");
        await page.locator('[data-tool-field="Author"]').fill("");
        await page.getByLabel("Keep").first().uncheck();
        await page.locator("[data-tool-run]").click();
        await expect(page.locator("[data-tool-output]")).toHaveValue("saved");
        const download = page.waitForEvent("download");
        await page.getByRole("button", { name: "Download" }).click();
        const file = await download;
        expect(file.suggestedFilename()).toBe("plan-metadata.pdf");
        const { readFile } = await import("node:fs/promises");
        const document = await PDFDocument.load(await readFile((await file.path()) as string), {
            updateMetadata: false,
        });
        expect(document.getTitle()).toBe("گزارش نهایی");
        expect(document.getAuthor()).toBeUndefined();
        expect(document.getCreationDate()).toBeUndefined();
    });
});

test.describe("pdf text extractor", () => {
    test("reads the text of each page", async ({ page }) => {
        const { makeTextPdf } = await import("../support/pdf");
        await page.goto("/en/tools/pdf-text/");
        await page.locator('input[type="file"]').setInputFiles({
            name: "notes.pdf",
            mimeType: "application/pdf",
            buffer: await makeTextPdf(["First page text", "Second page text"]),
        });
        const output = page.locator("[data-tool-output]");
        await expect(output).toHaveValue(
            "--- Page 1 ---\nFirst page text\n\n--- Page 2 ---\nSecond page text",
        );
        await page.getByLabel("Show the page number before the text of each page").uncheck();
        await expect(output).toHaveValue("First page text\n\nSecond page text");
        const download = page.waitForEvent("download");
        await page.getByRole("button", { name: "Download TXT" }).click();
        const file = await download;
        expect(file.suggestedFilename()).toBe("notes.txt");
        const { readFile } = await import("node:fs/promises");
        expect(await readFile((await file.path()) as string, "utf8")).toBe(
            "First page text\n\nSecond page text",
        );
    });

    test("explains a PDF without text", async ({ page }) => {
        const { makePdf } = await import("../support/pdf");
        await page.goto("/fa/tools/pdf-text/");
        await page.locator('input[type="file"]').setInputFiles({
            name: "scan.pdf",
            mimeType: "application/pdf",
            buffer: await makePdf(2),
        });
        await expect(page.locator("[data-tool-no-text]")).toContainText("OCR");
    });
});

test.describe("pdf watermark", () => {
    test("puts a Persian watermark on every page", async ({ page }) => {
        const { makePdf } = await import("../support/pdf");
        const { PDFDocument } = await import("@cantoo/pdf-lib");
        await page.goto("/fa/tools/pdf-watermark/");
        await page.locator('input[type="file"]').setInputFiles({
            name: "contract.pdf",
            mimeType: "application/pdf",
            buffer: await makePdf(3),
        });
        await expect(page.locator("[data-tool-text]")).toHaveValue("محرمانه");
        await page.locator("[data-tool-text]").fill("پیش‌نویس");
        await page.getByText("تکرار در سراسر برگه", { exact: true }).click();
        await page.locator("[data-tool-run]").click();
        await expect(page.locator("[data-tool-output]")).toHaveValue(/^\d+$/);
        const download = page.waitForEvent("download");
        await page.getByRole("button", { name: "دانلود" }).click();
        const file = await download;
        expect(file.suggestedFilename()).toBe("contract-watermarked.pdf");
        const { readFile } = await import("node:fs/promises");
        const bytes = await readFile((await file.path()) as string);
        expect((await PDFDocument.load(bytes)).getPageCount()).toBe(3);
        const raw = bytes.toString("latin1");
        // The image is stored once for all pages: one image and its alpha mask.
        expect(raw.match(/\/Subtype\s*\/Image/g)?.length).toBe(2);
        expect(raw).toContain("/SMask");
        expect(raw).toContain("/ca 0.25");
    });

    test("asks for a text", async ({ page }) => {
        const { makePdf } = await import("../support/pdf");
        await page.goto("/en/tools/pdf-watermark/");
        await page.locator('input[type="file"]').setInputFiles({
            name: "a.pdf",
            mimeType: "application/pdf",
            buffer: await makePdf(1),
        });
        await page.locator("[data-tool-text]").fill("   ");
        await page.locator("[data-tool-run]").click();
        await expect(page.getByRole("alert")).toContainText("Write the watermark text.");
    });
});

test.describe("pdf page organizer", () => {
    async function openPdf(page: Page, locale: "en" | "fa") {
        const { makePdf } = await import("../support/pdf");
        await page.goto(`/${locale}/tools/pdf-pages/`);
        await page.locator('input[type="file"]').setInputFiles({
            name: "book.pdf",
            mimeType: "application/pdf",
            buffer: await makePdf(4),
        });
        await expect(page.locator("[data-tool-pages] li")).toHaveCount(4);
        await expect(page.locator("[data-tool-pages] img")).toHaveCount(4);
    }

    async function pagesOf(download: Download) {
        const { PDFDocument } = await import("@cantoo/pdf-lib");
        const { readFile } = await import("node:fs/promises");
        const document = await PDFDocument.load(await readFile((await download.path()) as string));
        return document.getPages().map((item) => [item.getWidth(), item.getRotation().angle]);
    }

    test("turns, moves, and removes pages, then saves", async ({ page }) => {
        await openPdf(page, "en");
        await page.getByRole("button", { name: "Turn right: Page 2", exact: true }).click();
        await page.getByRole("button", { name: "Move earlier: Page 3", exact: true }).click();
        await page.getByRole("button", { name: "Remove page: Page 1", exact: true }).click();
        await expect(page.locator("[data-tool-pages] li")).toHaveCount(3);
        await expect(page.locator("[data-tool-summary]")).toContainText("1 removed");
        await page.locator("[data-tool-run]").click();
        await expect(page.locator("[data-tool-output]")).toHaveValue("pdf:3");
        const download = page.waitForEvent("download");
        await page.getByRole("button", { name: "Download" }).click();
        const file = await download;
        expect(file.suggestedFilename()).toBe("book-edited.pdf");
        // makePdf: page i is 100 + i points wide.
        expect(await pagesOf(file)).toEqual([
            [102, 0],
            [101, 90],
            [103, 0],
        ]);
    });

    test("extracts the selected pages and splits", async ({ page }) => {
        await openPdf(page, "fa");
        await page.getByRole("checkbox", { name: "گزینش: برگه ۲", exact: true }).check();
        await page.getByRole("checkbox", { name: "گزینش: برگه ۴", exact: true }).check();
        await page.locator("[data-tool-extract]").click();
        await expect(page.locator("[data-tool-output]")).toHaveValue("pdf:2");
        const download = page.waitForEvent("download");
        await page.getByRole("button", { name: "دانلود" }).click();
        const file = await download;
        expect(file.suggestedFilename()).toBe("book-selected.pdf");
        expect((await pagesOf(file)).map(([width]) => width)).toEqual([101, 103]);
        await page.locator("[data-tool-split]").click();
        await expect(page.locator("[data-tool-output]")).toHaveValue("zip:4");
    });
});

test.describe("pdf compressor", () => {
    test("makes a photo PDF smaller and the result still opens", async ({ page }) => {
        const { makePhotoPdf } = await import("../support/pdf");
        const { PDFDocument } = await import("@cantoo/pdf-lib");
        await page.goto("/en/tools/pdf-compress/");
        const source = await makePhotoPdf(page);
        await page.locator('input[type="file"]').setInputFiles({
            name: "photo.pdf",
            mimeType: "application/pdf",
            buffer: source,
        });
        await page.getByText("Strong (smaller file)", { exact: true }).click();
        await page.locator("[data-tool-run]").click();
        await expect(page.locator("[data-tool-result-size]")).toContainText("smaller");
        await expect(page.locator("[data-tool-result-size]")).toContainText("1 of 1 images");
        const download = page.waitForEvent("download");
        await page.getByRole("button", { name: "Download" }).click();
        const file = await download;
        expect(file.suggestedFilename()).toBe("photo-compressed.pdf");
        const { readFile } = await import("node:fs/promises");
        const bytes = await readFile((await file.path()) as string);
        expect(bytes.length).toBeLessThan(source.length / 2);
        expect((await PDFDocument.load(bytes)).getPageCount()).toBe(1);
    });

    test("says so when a PDF does not get smaller", async ({ page }) => {
        const { makeTextPdf } = await import("../support/pdf");
        await page.goto("/fa/tools/pdf-compress/");
        await page.locator('input[type="file"]').setInputFiles({
            name: "text.pdf",
            mimeType: "application/pdf",
            buffer: await makeTextPdf(["Only text here"]),
        });
        await page.locator("[data-tool-run]").click();
        await expect(page.locator("[data-tool-not-smaller]")).toContainText("کوچک‌تر نشد");
    });
});
