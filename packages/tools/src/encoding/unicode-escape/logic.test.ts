import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { escapeText, unescapeText, type EscapeFormat } from "./logic";

const esc = (text: string, format: EscapeFormat, all = false) => escapeText(text, { format, all });

function detail(run: () => unknown): string | undefined {
    try {
        run();
    } catch (error) {
        if (error instanceof ToolFailure) return error.detail;
        throw error;
    }
    throw new Error("expected a ToolFailure");
}

describe("escape", () => {
    it("returns an empty text for an empty input", () => {
        expect(esc("", "js")).toBe("");
        expect(unescapeText("")).toBe("");
    });

    it("js: escapes non-ASCII and uses surrogate pairs", () => {
        expect(esc("سلام a", "js")).toBe("\\u0633\\u0644\\u0627\\u0645 a");
        expect(esc("😀", "js")).toBe("\\uD83D\\uDE00");
    });

    it("js: matches JSON.stringify for non-ASCII text", () => {
        const text = "کتاب‌ها 😀";
        expect(JSON.parse(`"${esc(text, "js")}"`)).toBe(text);
    });

    it("es6 and python: one escape for each code point", () => {
        expect(esc("ا😀", "es6")).toBe("\\u{627}\\u{1F600}");
        expect(esc("ا😀", "python")).toBe("\\u0627\\U0001F600");
    });

    it("codepoint: lists every code point", () => {
        expect(esc("a ی‌", "codepoint")).toBe("U+0061 U+0020 U+06CC U+200C");
    });

    it("escapes line breaks, tabs, and backslashes", () => {
        expect(esc("a\nb\t\\", "js")).toBe("a\\u000Ab\\u0009\\\\");
    });

    it("can escape ASCII too", () => {
        expect(esc("Ab", "js", true)).toBe("\\u0041\\u0062");
    });
});

describe("unescape", () => {
    it("decodes every form, mixed", () => {
        expect(unescapeText("\\u0633\\u{644}\\x41 \\U0001F600 U+06CC")).toBe("سلA 😀 ی");
    });

    it("joins a surrogate pair", () => {
        expect(unescapeText("\\uD83D\\uDE00!")).toBe("😀!");
    });

    it("drops the spaces between U+ values, and keeps U+0020", () => {
        expect(unescapeText("U+0633 U+0644 U+0020 U+0627")).toBe("سل ا");
    });

    it("keeps text that is not an escape", () => {
        expect(unescapeText("price: \\$5, \\u12 and menu+1234")).toBe(
            "price: \\$5, \\u12 and menu+1234",
        );
    });

    it("reads \\\\ as one backslash", () => {
        expect(unescapeText("a\\\\u0041")).toBe("a\\u0041");
    });

    it("round-trips every format", () => {
        const text = 'کتاب‌ها "x" \\ 😀\n\tend';
        for (const format of ["js", "es6", "python", "codepoint"] as const) {
            expect(unescapeText(esc(text, format))).toBe(text);
            expect(unescapeText(esc(text, format, true))).toBe(text);
        }
    });

    it("rejects a value above U+10FFFF with its position", () => {
        expect(detail(() => unescapeText("ab\\u{110000}"))).toBe("position 3");
    });

    it("rejects half of a surrogate pair", () => {
        expect(detail(() => unescapeText("\\uD83D"))).toBe("position 1");
        expect(detail(() => unescapeText("x\\uDE00"))).toBe("position 2");
        expect(detail(() => unescapeText("\\uD83Dx\\uDE00"))).toBe("position 1");
    });
});
