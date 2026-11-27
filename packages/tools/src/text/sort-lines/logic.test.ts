import { describe, expect, it } from "vitest";
import { DEFAULT_OPTIONS, sortLines, type SortOptions } from "./logic";

const run = (lines: string[], options: Partial<SortOptions> = {}) =>
    sortLines(lines.join("\n"), { ...DEFAULT_OPTIONS, ...options }).split("\n");

describe("sort lines", () => {
    it("returns nothing for an empty input", () => {
        expect(sortLines("")).toBe("");
    });

    it("sorts Persian words in Persian alphabet order", () => {
        expect(run(["گل", "زرد", "پدر", "ژاله", "چای", "ب"])).toEqual([
            "ب",
            "پدر",
            "چای",
            "زرد",
            "ژاله",
            "گل",
        ]);
    });

    it("puts Persian words before Latin words", () => {
        expect(run(["apple", "سیب", "Banana"])).toEqual(["سیب", "apple", "Banana"]);
    });

    it("sorts numbers naturally, also with Persian digits", () => {
        expect(run(["item 10", "item 2", "item 1"])).toEqual(["item 1", "item 2", "item 10"]);
        expect(run(["فصل ۱۰", "فصل ۲", "فصل 3"])).toEqual(["فصل ۲", "فصل 3", "فصل ۱۰"]);
    });

    it("can sort digit by digit", () => {
        expect(run(["item 10", "item 2", "item 1"], { natural: false })).toEqual([
            "item 1",
            "item 10",
            "item 2",
        ]);
    });

    it("ignores case by default and keeps the input order of equal lines", () => {
        expect(run(["b", "Apple", "apple", "APPLE"])).toEqual(["Apple", "apple", "APPLE", "b"]);
    });

    it("puts capitals first when case matters", () => {
        expect(run(["apple", "Apple", "b"], { ignoreCase: false })).toEqual([
            "Apple",
            "apple",
            "b",
        ]);
    });

    it("sorts in descending order", () => {
        expect(run(["b", "c", "a"], { order: "descending" })).toEqual(["c", "b", "a"]);
    });

    it("reverses the current order without sorting", () => {
        expect(run(["b", "c", "a"], { order: "reverse" })).toEqual(["a", "c", "b"]);
    });

    it("can remove empty lines", () => {
        expect(run(["b", "", " ", "a"], { removeEmpty: true })).toEqual(["a", "b"]);
    });

    it("keeps the line break style and the final line break", () => {
        expect(sortLines("b\r\na\r\n")).toBe("a\r\nb\r\n");
    });
});
