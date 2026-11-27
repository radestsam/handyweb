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
