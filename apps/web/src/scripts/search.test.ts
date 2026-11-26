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
    });

    it("needs every word to match", () => {
        expect(rank(entries, "   ")).toEqual([]);
    });
});
