import { describe, expect, it } from "vitest";
import { DEFAULT_OPTIONS, removeDuplicateLines, type DedupeOptions } from "./logic";

const run = (text: string, options: Partial<DedupeOptions> = {}) =>
    removeDuplicateLines(text, { ...DEFAULT_OPTIONS, ...options });

describe("remove duplicate lines", () => {
    it("returns nothing for an empty input", () => {
        expect(run("")).toEqual({ text: "", total: 0, duplicates: 0, empty: 0 });
    });

    it("keeps the first copy in the original order", () => {
        expect(run("b\na\nb\nc\na")).toEqual({
            text: "b\na\nc",
            total: 5,
            duplicates: 2,
            empty: 0,
        });
    });

    it("compares Persian lines exactly", () => {
        expect(run("سلام\nدنیا\nسلام").text).toBe("سلام\nدنیا");
        // Arabic yeh is a different character, so the lines are different.
        expect(run("علی\nعلي").text).toBe("علی\nعلي");
    });

    it("keeps lines that differ only in a ZWNJ", () => {
        expect(run("می‌روم\nمیروم").text).toBe("می‌روم\nمیروم");
    });

    it("trims by default, and keeps the original text of the first copy", () => {
        expect(run("  apple\napple  \napple").text).toBe("  apple");
        expect(run("  apple\napple", { trim: false }).text).toBe("  apple\napple");
    });

    it("can ignore case", () => {
        expect(run("Apple\napple\nAPPLE").text).toBe("Apple\napple\nAPPLE");
        expect(run("Apple\napple\nAPPLE", { ignoreCase: true }).text).toBe("Apple");
    });

    it("treats empty lines as duplicates of each other", () => {
        expect(run("a\n\nb\n\nc").text).toBe("a\n\nb\nc");
    });

    it("can remove every empty line", () => {
        expect(run("a\n\n \nb\n", { removeEmpty: true })).toEqual({
            text: "a\nb\n",
            total: 4,
            duplicates: 0,
            empty: 2,
        });
    });

    it("keeps the line break style and the final line break", () => {
        expect(run("a\r\nb\r\na\r\n").text).toBe("a\r\nb\r\n");
        expect(run("a\rb\ra").text).toBe("a\rb");
    });
});
