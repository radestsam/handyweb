import { describe, expect, it } from "vitest";
import { joinPages, pageText, textName } from "./logic";

describe("pdf text", () => {
    it("joins items into lines", () => {
        expect(
            pageText([
                { str: "Hello", hasEOL: false },
                { str: " ", hasEOL: false },
                { str: "world  ", hasEOL: true },
                { str: "", hasEOL: true },
                { str: "", hasEOL: true },
                { str: "", hasEOL: true },
                { str: "سلام دنیا", hasEOL: false },
            ]),
        ).toBe("Hello world\n\nسلام دنیا");
        expect(pageText([])).toBe("");
    });

    it("joins pages with and without headers", () => {
        const label = (page: number) => `Page ${page}`;
        expect(joinPages(["a", "", "c"], false, label)).toBe("a\n\nc");
        expect(joinPages(["a", "b"], true, label)).toBe("--- Page 1 ---\na\n\n--- Page 2 ---\nb");
    });

    it("names the file", () => {
        expect(textName("Report.PDF")).toBe("Report.txt");
        expect(textName("")).toBe("document.txt");
    });
});
