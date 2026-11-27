import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { escapeJsonString, unescapeJsonString } from "./logic";

const plain = { asciiOnly: false, quotes: false };

function detail(fn: () => unknown): string | undefined {
    try {
        fn();
    } catch (error) {
        if (error instanceof ToolFailure) return error.detail;
        throw error;
    }
    throw new Error("expected a ToolFailure");
}

describe("escapeJsonString", () => {
    it("escapes quotes, backslashes, and control characters", () => {
        expect(escapeJsonString('say "hi"\n\\\t', plain)).toBe('say \\"hi\\"\\n\\\\\\t');
    });

    it("keeps Persian text unless ASCII only is on", () => {
        expect(escapeJsonString("سلام", plain)).toBe("سلام");
        expect(escapeJsonString("سلام 😀", { asciiOnly: true, quotes: true })).toBe(
            '"\\u0633\\u0644\\u0627\\u0645 \\ud83d\\ude00"',
        );
    });
});

describe("unescapeJsonString", () => {
    it("reads with or without quotes", () => {
        expect(unescapeJsonString('"a\\nb"')).toBe("a\nb");
        expect(unescapeJsonString("a\\nb")).toBe("a\nb");
        expect(unescapeJsonString("\\u0633\\u0644\\u0627\\u0645")).toBe("سلام");
    });

    it("round-trips", () => {
        const text = 'کتاب‌ها "x" \\ 😀\n\tend';
        expect(unescapeJsonString(escapeJsonString(text, plain))).toBe(text);
        expect(unescapeJsonString(escapeJsonString(text, { asciiOnly: true, quotes: true }))).toBe(
            text,
        );
    });

    it("names the bad escape", () => {
        expect(detail(() => unescapeJsonString("ab\\x"))).toBe("position 3");
        expect(detail(() => unescapeJsonString("\\u12"))).toBe("position 1");
        expect(detail(() => unescapeJsonString('a"b'))).toBe("position 2");
        expect(detail(() => unescapeJsonString("a\nb"))).toBe("position 2");
    });
});
