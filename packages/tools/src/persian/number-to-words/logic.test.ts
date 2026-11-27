import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { integerToWords, numberToWords, toOrdinal } from "./logic";

const plain = { ordinal: false, unit: "none" as const };

function detail(fn: () => unknown): string | undefined {
    try {
        fn();
    } catch (error) {
        if (error instanceof ToolFailure) return error.detail;
        throw error;
    }
    throw new Error("expected a ToolFailure");
}

describe("integerToWords", () => {
    it.each([
        [0n, "صفر"],
        [7n, "هفت"],
        [13n, "سیزده"],
        [20n, "بیست"],
        [21n, "بیست و یک"],
        [100n, "صد"],
        [105n, "صد و پنج"],
        [250n, "دویست و پنجاه"],
        [999n, "نهصد و نود و نه"],
        [1000n, "هزار"],
        [1001n, "هزار و یک"],
        [1234n, "هزار و دویست و سی و چهار"],
        [2000n, "دو هزار"],
        [10_000n, "ده هزار"],
        [1_000_000n, "یک میلیون"],
        [1_000_001n, "یک میلیون و یک"],
        [12_500_000n, "دوازده میلیون و پانصد هزار"],
        [1_000_000_000n, "یک میلیارد"],
        [-45n, "منفی چهل و پنج"],
    ])("%s", (value, words) => {
        expect(integerToWords(value)).toBe(words);
    });
});

describe("toOrdinal", () => {
    it("handles سه, words ending in ی, and the rest", () => {
        expect(toOrdinal("یک")).toBe("یکم");
        expect(toOrdinal("سه")).toBe("سوم");
        expect(toOrdinal("بیست و سه")).toBe("بیست و سوم");
        expect(toOrdinal("سی")).toBe("سی‌ام");
        expect(toOrdinal("صد")).toBe("صدم");
        expect(toOrdinal("هزار")).toBe("هزارم");
    });
});

describe("numberToWords", () => {
    it("reads Persian digits and separators", () => {
        expect(numberToWords("۱٬۲۳۴", plain)).toBe("هزار و دویست و سی و چهار");
        expect(numberToWords(" 1,000,000 ", plain)).toBe("یک میلیون");
    });

    it("writes decimals", () => {
        expect(numberToWords("3.25", plain)).toBe("سه و بیست و پنج صدم");
        expect(numberToWords("۰٫۵", plain)).toBe("پنج دهم");
        expect(numberToWords("2.50", plain)).toBe("دو و پنج دهم");
        expect(numberToWords("-0.125", plain)).toBe("منفی صد و بیست و پنج هزارم");
    });

    it("writes ordinals and units", () => {
        expect(numberToWords("21", { ordinal: true, unit: "none" })).toBe("بیست و یکم");
        expect(numberToWords("150000", { ordinal: false, unit: "toman" })).toBe(
            "صد و پنجاه هزار تومان",
        );
    });

    it("keeps 27-digit numbers exact", () => {
        expect(numberToWords("999999999999999999999999999", plain)).toMatch(
            /^نهصد و نود و نه سپتیلیون/,
        );
    });

    it("rejects bad input", () => {
        expect(detail(() => numberToWords("12a", plain))).toBe("format");
        expect(detail(() => numberToWords("1".repeat(28), plain))).toBe("too large");
        expect(detail(() => numberToWords("1.1234567", plain))).toBe("decimals");
        expect(detail(() => numberToWords("2.5", { ordinal: true, unit: "none" }))).toBe("ordinal");
    });
});
