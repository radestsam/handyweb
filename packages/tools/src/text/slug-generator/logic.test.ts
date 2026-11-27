import { describe, expect, it } from "vitest";
import { DEFAULT_OPTIONS, slugify } from "./logic";

describe("slugify latin", () => {
    it("makes a lowercase slug", () => {
        expect(slugify("Hello, World! 2025")).toBe("hello-world-2025");
        expect(slugify("  Crème brûlée -- recipe  ")).toBe("creme-brulee-recipe");
        expect(slugify("")).toBe("");
    });

    it("writes Persian in Latin letters", () => {
        expect(slugify("کتاب‌های خوب ۱۴۰۴")).toBe("ktab-hai-khvb-1404");
        expect(slugify("شیراز")).toBe("shiraz");
    });

    it("uses the separator, case option, and length limit", () => {
        expect(
            slugify("Hello World", { ...DEFAULT_OPTIONS, separator: "_", lowercase: false }),
        ).toBe("Hello_World");
        expect(slugify("one two three four", { ...DEFAULT_OPTIONS, maxLength: 10 })).toBe(
            "one-two",
        );
        expect(slugify("supercalifragilistic", { ...DEFAULT_OPTIONS, maxLength: 5 })).toBe("super");
    });
});

describe("slugify persian", () => {
    const persian = { ...DEFAULT_OPTIONS, script: "persian" as const };

    it("keeps Persian letters and fixes Arabic yeh and kaf", () => {
        expect(slugify("راهنمای خرید کتاب‌ها!", persian)).toBe("راهنمای-خرید-کتاب-ها");
        expect(slugify("علي و كتاب", persian)).toBe("علی-و-کتاب");
    });

    it("removes diacritics and tatweel", () => {
        expect(slugify("کِتـــاب", persian)).toBe("کتاب");
    });
});
