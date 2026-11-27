import { describe, expect, it } from "vitest";
import { normalizeForSearch } from "@handyweb/core/i18n";
import { catalog } from "@handyweb/tools/catalog";
import type { SearchEntry } from "../pages/search-index.json";

// rank() lives in a browser script that also sets up the dialog on import.
// The dialog setup does nothing without a document, so the import is safe.
const { rank } = await import("./search");

const entries: SearchEntry[] = catalog.map((tool) => ({
    slug: tool.slug,
    category: tool.category,
    title: tool.title,
    description: tool.description,
    titles: normalizeForSearch(`${tool.title.fa} | ${tool.title.en}`),
    terms: normalizeForSearch(
        [...tool.keywords.fa, ...tool.keywords.en, ...tool.aliases].join(" | "),
    ),
    text: normalizeForSearch(`${tool.description.fa} | ${tool.description.en}`),
}));

const top = (query: string) => rank(entries, query)[0]?.slug;

describe("search ranking", () => {
    it("finds tools by English and Persian names", () => {
        expect(top("base64")).toBe("base64");
        expect(top("بیس۶۴")).toBe("base64");
        expect(top("json")).toBe("json-formatter");
        expect(top("sha256")).toBe("hash");
        expect(top("sha512")).toBe("hash");
        expect(top("md5")).toBe("hash");
        expect(top("word count")).toBe("text-counter");
        expect(top("title case")).toBe("case-converter");
        expect(top("remove duplicates")).toBe("remove-duplicate-lines");
        expect(top("مرتب سازی")).toBe("sort-lines");
        expect(top("remove extra spaces")).toBe("text-cleaner");
        expect(top("حذف فاصله اضافه")).toBe("text-cleaner");
        expect(top("url decode")).toBe("url-encoding");
        expect(top("لینک فارسی")).toBe("url-encoding");
        expect(top("html entities")).toBe("html-entities");
        expect(top("nbsp")).toBe("html-entities");
        expect(top("unicode escape")).toBe("unicode-escape");
        expect(top("xml validator")).toBe("xml-formatter");
        expect(top("jwt")).toBe("jwt-decoder");
        expect(top("hmac")).toBe("hmac");
        expect(top("password generator")).toBe("password-generator");
        expect(top("random bytes")).toBe("random-token");
        expect(top("uuid")).toBe("uuid-generator");
        expect(top("ulid")).toBe("uuid-generator");
        expect(top("diff checker")).toBe("text-diff");
        expect(top("regex")).toBe("regex-tester");
        expect(top("epoch")).toBe("unix-timestamp");
        expect(top("binary to decimal")).toBe("number-base");
        expect(top("qr code")).toBe("qr-generator");
        expect(top("reverse text")).toBe("reverse-text");
        expect(top("تکرار متن")).toBe("text-repeater");
        expect(top("join lines")).toBe("split-join");
        expect(top("find and replace")).toBe("find-replace");
        expect(top("json escape")).toBe("json-string");
        expect(top("slug")).toBe("slug-generator");
        expect(top("لورم ایپسوم")).toBe("lorem-ipsum");
        expect(top("email extractor")).toBe("text-extractor");
        expect(top("عدد به حروف")).toBe("number-to-words");
        expect(top("نیم فاصله")).toBe("zwnj-fixer");
        expect(top("ویرگول فارسی")).toBe("punctuation-fixer");
        expect(top("rtl fix")).toBe("direction-fixer");
        expect(top("yaml validator")).toBe("yaml-formatter");
        expect(top("json to yaml")).toBe("json-yaml");
        expect(top("sql")).toBe("sql-formatter");
        expect(top("html formatter")).toBe("html-formatter");
        expect(top("css formatter")).toBe("css-formatter");
        expect(top("javascript formatter")).toBe("js-formatter");
        expect(top("json to csv")).toBe("json-csv");
        expect(top("compare json")).toBe("json-diff");
        expect(top("json schema")).toBe("json-schema-validator");
        expect(top("hex to rgb")).toBe("color-converter");
        expect(top("url parser")).toBe("url-parser");
        expect(top("cron")).toBe("cron-parser");
        expect(top("security headers")).toBe("http-header-parser");
        expect(top("user agent")).toBe("user-agent-parser");
        expect(top("text to hex")).toBe("hex");
        expect(top("text to binary")).toBe("binary");
        expect(top("image to base64")).toBe("base64-file");
        expect(top("gunzip")).toBe("gzip");
        expect(top("srt to vtt")).toBe("subtitle-converter");
        expect(top("encrypt text")).toBe("aes-gcm");
        expect(top("2fa code")).toBe("totp");
        expect(top("magic number")).toBe("file-signature");
        expect(top("csr decoder")).toBe("pem-decoder");
        expect(top("html preview")).toBe("html-preview");
        expect(top("markdown")).toBe("markdown-editor");
        expect(top("زیرنویس")).toBe("subtitle-converter");
        expect(top("لینک مشکوک")).toBe("url-parser");
        expect(top("کیو آر کد")).toBe("qr-generator");
        expect(top("تبدیل مبنا")).toBe("number-base");
        expect(top("تایم استمپ")).toBe("unix-timestamp");
        expect(top("مقایسه متن")).toBe("text-diff");
        expect(top("کلید api")).toBe("random-token");
        expect(top("رمز عبور قوی")).toBe("password-generator");
        expect(top("webhook signature")).toBe("hmac");
        expect(top("نویسه نامرئی")).toBe("unicode-explorer");
        expect(top("حروف بزرگ")).toBe("case-converter");
        expect(top("شمارش کلمات")).toBe("text-counter");
    });

    it("finds Persian text typed with an Arabic keyboard", () => {
        expect(top("تاريخ")).toBe("jalali-converter");
        expect(top("ي عربي")).toBe("persian-normalizer");
    });

    it("needs every word to match", () => {
        expect(rank(entries, "base64 jalali")).toEqual([]);
        expect(rank(entries, "   ")).toEqual([]);
    });
});
