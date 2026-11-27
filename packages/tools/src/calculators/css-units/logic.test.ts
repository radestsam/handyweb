import { describe, expect, it } from "vitest";
import { convertCss, cssValue, DEFAULT_CONTEXT } from "./logic";

const c = DEFAULT_CONTEXT;

describe("CSS units", () => {
    it("converts px and rem", () => {
        expect(convertCss(24, "px", "rem", c)).toBe(1.5);
        expect(convertCss(2, "rem", "px", { ...c, rootFontSize: 10 })).toBe(20);
    });

    it("converts absolute units", () => {
        expect(convertCss(1, "in", "px", c)).toBe(96);
        expect(convertCss(12, "pt", "px", c)).toBe(16);
        expect(convertCss(1, "pc", "pt", c)).toBeCloseTo(12, 10);
        expect(convertCss(10, "mm", "cm", c)).toBeCloseTo(1, 10);
    });

    it("converts viewport and percent units", () => {
        expect(convertCss(144, "px", "vw", c)).toBe(10);
        expect(convertCss(50, "%", "px", c)).toBe(600);
    });

    it("writes CSS values", () => {
        expect(cssValue(1.5, "rem")).toBe("1.5rem");
        expect(cssValue(1 / 3, "em")).toBe("0.3333em");
    });
});
