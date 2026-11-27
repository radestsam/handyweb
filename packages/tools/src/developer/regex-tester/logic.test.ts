import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { backtrackingRisk, runRegex, type RegexInput } from "./logic";

const run = (input: Partial<RegexInput>) =>
    runRegex({ pattern: "", flags: "g", text: "", limit: 1000, ...input });

describe("runRegex", () => {
    it("finds every match with the g flag", () => {
        const { matches } = run({ pattern: "\\d+", text: "a1 b22 c333" });
        expect(matches.map((m) => [m.index, m.end, m.text])).toEqual([
            [1, 2, "1"],
            [4, 6, "22"],
            [8, 11, "333"],
        ]);
    });

    it("finds only the first match without g", () => {
        expect(run({ pattern: "\\d+", flags: "", text: "a1 b22" }).matches).toHaveLength(1);
    });

    it("returns numbered and named groups", () => {
        const [match] = run({
            pattern: "(?<year>\\d{4})-(\\d{2})(x)?",
            text: "1404-09",
        }).matches;
        expect(match).toMatchObject({
            groups: ["1404", "09", null],
            named: { year: "1404" },
        });
    });

    it("works with Persian text and the u flag", () => {
        const { matches } = run({
            pattern: "[\\p{L}\\u200C]+",
            flags: "gu",
            text: "می‌روم به خانه",
        });
        expect(matches.map((m) => m.text)).toEqual(["می‌روم", "به", "خانه"]);
        // \d does not match Persian digits; \p{Nd} does.
        expect(run({ pattern: "\\d", text: "۱۲" }).matches).toEqual([]);
        expect(run({ pattern: "\\p{Nd}+", flags: "gu", text: "۱۲" }).matches[0]?.text).toBe("۱۲");
    });

    it("ends on patterns that match empty text", () => {
        expect(run({ pattern: "a*", text: "baa" }).matches.map((m) => m.text)).toEqual([
            "",
            "aa",
            "",
        ]);
    });

    it("stops at the limit", () => {
        const result = run({ pattern: ".", text: "abcdef", limit: 4 });
        expect(result.matches).toHaveLength(4);
        expect(result.truncated).toBe(true);
    });

    it("returns nothing for an empty pattern", () => {
        expect(run({ text: "abc" })).toEqual({ matches: [], truncated: false });
    });

    it("reports an invalid pattern with the message of the engine", () => {
        try {
            run({ pattern: "(abc", text: "abc" });
            throw new Error("expected a ToolFailure");
        } catch (error) {
            expect(error).toBeInstanceOf(ToolFailure);
            expect((error as ToolFailure).detail).toMatch(/Invalid regular expression/);
        }
    });
});

describe("backtrackingRisk", () => {
    it.each(["(a+)+", "(\\w*)*b", "(x+y?){2,}", "((ab)*)+", "(.*a){3,}"])(
        "warns about %s",
        (pattern) => {
            expect(backtrackingRisk(pattern)).toBe(true);
        },
    );

    it.each(["\\d+", "(abc)+", "[a+]+", "\\(a+\\)+", "(a|b)", "(\\d{4})-(\\d{2})", "(a+){2}"])(
        "does not warn about %s",
        (pattern) => {
            expect(backtrackingRisk(pattern)).toBe(false);
        },
    );
});
