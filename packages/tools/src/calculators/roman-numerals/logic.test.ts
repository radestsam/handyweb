import { describe, expect, it } from "vitest";
import { convertRoman, fromRoman, toRoman } from "./logic";

describe("Roman numerals", () => {
    it("writes numbers", () => {
        expect(toRoman(4)).toBe("IV");
        expect(toRoman(1994)).toBe("MCMXCIV");
        expect(toRoman(3999)).toBe("MMMCMXCIX");
        expect(() => toRoman(0)).toThrow();
        expect(() => toRoman(4000)).toThrow();
    });

    it("reads standard numerals only", () => {
        expect(fromRoman("mmxxv")).toBe(2025);
        expect(() => fromRoman("IIII")).toThrow();
        expect(() => fromRoman("VX")).toThrow();
        expect(() => fromRoman("ABC")).toThrow();
    });

    it("round-trips every number", () => {
        for (let n = 1; n <= 3999; n++) expect(fromRoman(toRoman(n))).toBe(n);
    });

    it("converts in both directions with Persian digits", () => {
        expect(convertRoman("۲۰۲۶")).toEqual({ roman: "MMXXVI", value: 2026 });
        expect(convertRoman("xiv")).toEqual({ roman: "XIV", value: 14 });
    });
});
