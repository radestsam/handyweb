import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { findReplace, type ReplaceInput } from "./logic";

const base: ReplaceInput = {
    text: "",
    find: "",
    replace: "",
    mode: "text",
    ignoreCase: false,
    wholeWord: false,
    all: true,
};
const run = (input: Partial<ReplaceInput>) => findReplace({ ...base, ...input });

describe("text mode", () => {
    it("replaces every match and counts", () => {
        expect(run({ text: "a.b.c", find: ".", replace: "-" })).toEqual({
            text: "a-b-c",
            count: 2,
        });
    });

    it("replaces only the first match", () => {
        expect(run({ text: "aaa", find: "a", replace: "b", all: false })).toEqual({
            text: "baa",
            count: 1,
        });
    });

    it("keeps $ in the replacement literal", () => {
        expect(run({ text: "cost", find: "cost", replace: "$1 $&" }).text).toBe("$1 $&");
    });

    it("ignores case", () => {
        expect(
            run({ text: "Hello hello", find: "HELLO", replace: "hi", ignoreCase: true }).count,
        ).toBe(2);
    });

    it("matches whole Persian and English words", () => {
        expect(
            run({ text: "کتاب کتابخانه کتاب", find: "کتاب", replace: "دفتر", wholeWord: true }),
        ).toEqual({
            text: "دفتر کتابخانه دفتر",
            count: 2,
        });
        expect(
            run({ text: "cat category cat.", find: "cat", replace: "dog", wholeWord: true }).text,
        ).toBe("dog category dog.");
    });

    it("does nothing for an empty find", () => {
        expect(run({ text: "abc", find: "" })).toEqual({ text: "abc", count: 0 });
    });
});

describe("regex mode", () => {
    it("uses numbered and named groups", () => {
        expect(
            run({
                text: "2025-11-27",
                find: "(\\d+)-(\\d+)-(\\d+)",
                replace: "$3/$2/$1",
                mode: "regex",
            }).text,
        ).toBe("27/11/2025");
        expect(
            run({
                text: "1404-09",
                find: "(?<y>\\d+)-(?<m>\\d+)",
                replace: "$<m>.$<y>",
                mode: "regex",
            }).text,
        ).toBe("09.1404");
    });

    it("supports $& and $$", () => {
        expect(run({ text: "5", find: "\\d", replace: "[$&]$$", mode: "regex" }).text).toBe("[5]$");
    });

    it("rejects an invalid pattern", () => {
        expect(() => run({ text: "a", find: "(", mode: "regex" })).toThrow(ToolFailure);
    });

    it("handles empty matches", () => {
        expect(run({ text: "ab", find: "", replace: "-", mode: "regex" }).count).toBe(0);
        expect(run({ text: "ab", find: "x*", replace: "-", mode: "regex" }).text).toBe("-a-b-");
    });
});
