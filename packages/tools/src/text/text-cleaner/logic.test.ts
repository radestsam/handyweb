import { describe, expect, it } from "vitest";
import { cleanText, DEFAULT_OPTIONS, PERSIAN_OPTIONS, type CleanOptions } from "./logic";

const none: CleanOptions = {
    controlChars: false,
    zeroWidth: false,
    bidiControls: false,
    unicodeSpaces: false,
    collapseSpaces: false,
    trimLines: false,
    emptyLines: "keep",
};
const only = (rule: Partial<CleanOptions>) => ({ ...none, ...rule });

describe("each rule alone", () => {
    it("does nothing with every rule off", () => {
        const text = " a\u200B\u00A0 \n\n\n";
        expect(cleanText(text, none)).toEqual({ text, counts: {} });
    });

    it("controlChars: removes control characters, keeps tab and line breaks", () => {
        expect(
            cleanText("a\u0000b\u0007\tc\r\nd\u000Be\u0085", only({ controlChars: true })),
        ).toEqual({ text: "ab\tc\r\nde", counts: { controlChars: 4 } });
    });

    it("zeroWidth: removes ZWSP, BOM, word joiner, and soft hyphen", () => {
        expect(cleanText("\uFEFFhel\u00ADlo\u200B wo\u2060rld", only({ zeroWidth: true }))).toEqual(
            {
                text: "hello world",
                counts: { zeroWidth: 4 },
            },
        );
    });

    it("bidiControls: removes direction marks", () => {
        expect(
            cleanText(
                "\u200Fسلام\u200E abc\u202B\u202C \u2067x\u2069",
                only({ bidiControls: true }),
            ),
        ).toEqual({
            text: "سلام abc x",
            counts: { bidiControls: 6 },
        });
    });

    it("unicodeSpaces: changes special spaces and separators", () => {
        expect(cleanText("a\u00A0b\u2009c\u3000d\u2028e", only({ unicodeSpaces: true }))).toEqual({
            text: "a b c d\ne",
            counts: { unicodeSpaces: 4 },
        });
    });

    it("collapseSpaces: one space for each run of spaces and tabs", () => {
        expect(cleanText("a   b\t\tc\td e", only({ collapseSpaces: true }))).toEqual({
            text: "a b c d e",
            counts: { collapseSpaces: 3 },
        });
    });

    it("trimLines: removes spaces at the start and end of each line", () => {
        expect(cleanText("  a  \n\tb\nc ", only({ trimLines: true }))).toEqual({
            text: "a\nb\nc",
            counts: { trimLines: 4 },
        });
    });

    it("emptyLines collapse: one empty line at most, none at the edges", () => {
        expect(cleanText("\n\na\n\n\n\nb\n \nc\n\n", only({ emptyLines: "collapse" }))).toEqual({
            text: "a\n\nb\n \nc",
            counts: { emptyLines: 6 },
        });
    });

    it("emptyLines remove: no empty lines", () => {
        expect(cleanText("a\n\n \nb\r\n\r\nc", only({ emptyLines: "remove" })).text).toBe(
            "a\r\nb\r\nc",
        );
    });
});

describe("Persian text", () => {
    it("never removes ZWNJ or ZWJ", () => {
        const text = "می‌روم 👨‍👩‍👧";
        expect(cleanText(text, PERSIAN_OPTIONS)).toEqual({ text, counts: {} });
    });

    it("the Persian preset removes RLM and keeps the words", () => {
        expect(cleanText("\u200Fکتاب‌ها\u200F  را  ببین\u00A0", PERSIAN_OPTIONS)).toEqual({
            text: "کتاب‌ها را ببین",
            counts: { bidiControls: 2, unicodeSpaces: 1, collapseSpaces: 2, trimLines: 1 },
        });
    });

    it("the default keeps direction marks", () => {
        expect(cleanText("\u200Fسلام", DEFAULT_OPTIONS).text).toBe("\u200Fسلام");
    });
});

describe("defaults", () => {
    it("returns an empty text for an empty input", () => {
        expect(cleanText("")).toEqual({ text: "", counts: {} });
    });

    it("cleans a pasted web text", () => {
        expect(cleanText("  Hello\u00A0\u00A0world\u200B  \n\n\n\nSecond   line  \n")).toEqual({
            text: "Hello world\n\nSecond line",
            counts: {
                zeroWidth: 1,
                unicodeSpaces: 2,
                collapseSpaces: 2,
                trimLines: 3,
                emptyLines: 3,
            },
        });
    });
});
