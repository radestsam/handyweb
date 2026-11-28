import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { bitLength, formatNumber, parseNumber } from "./logic";

const plain = { uppercase: false, group: false };

function detail(fn: () => unknown): string | undefined {
    try {
        fn();
    } catch (error) {
        if (error instanceof ToolFailure) return error.detail;
        throw error;
    }
    throw new Error("expected a ToolFailure");
}

describe("parseNumber", () => {
    it("reads decimal by default and prefixes with auto", () => {
        expect(parseNumber("255", "auto")).toEqual({ value: 255n, base: 10 });
        expect(parseNumber("0xff", "auto")).toEqual({ value: 255n, base: 16 });
        expect(parseNumber("0o377", "auto")).toEqual({ value: 255n, base: 8 });
        expect(parseNumber("0B1111_1111", "auto")).toEqual({ value: 255n, base: 2 });
    });

    it("reads a chosen base, with or without its prefix", () => {
        expect(parseNumber("ff", 16).value).toBe(255n);
        expect(parseNumber("0xff", 16).value).toBe(255n);
        expect(parseNumber("zz", 36).value).toBe(1295n);
    });

    it("accepts Persian digits, signs, and separators", () => {
        expect(parseNumber("۱۲۳٬۴۵۶", "auto").value).toBe(123456n);
        expect(parseNumber("-1,000,000", "auto").value).toBe(-1000000n);
        expect(parseNumber("+ 1010 1010", 2).value).toBe(170n);
    });

    it("keeps very large numbers exact", () => {
        const big = "123456789012345678901234567890123456789";
        expect(parseNumber(big, "auto").value.toString()).toBe(big);
        expect(parseNumber("0x" + "f".repeat(64), "auto").value).toBe(2n ** 256n - 1n);
    });

    it("rejects bad digits, empty input, and bad bases", () => {
        expect(detail(() => parseNumber("12a", 10))).toBe("digit a");
        expect(detail(() => parseNumber("102", 2))).toBe("digit 2");
        expect(detail(() => parseNumber("1.5", 10))).toBe("digit .");
        expect(detail(() => parseNumber("  ", "auto"))).toBe("empty");
        expect(detail(() => parseNumber("0x", "auto"))).toBe("digits");
        expect(detail(() => parseNumber("1", 37))).toBe("base");
    });
});

describe("formatNumber", () => {
    it("writes each base", () => {
        expect(formatNumber(255n, 2, plain)).toBe("11111111");
        expect(formatNumber(255n, 8, plain)).toBe("377");
        expect(formatNumber(255n, 16, plain)).toBe("ff");
        expect(formatNumber(255n, 16, { uppercase: true, group: false })).toBe("FF");
        expect(formatNumber(0n, 2, plain)).toBe("0");
    });

    it("groups digits", () => {
        const group = { uppercase: false, group: true };
        expect(formatNumber(1234567n, 10, group)).toBe("1,234,567");
        expect(formatNumber(255n, 2, group)).toBe("1111 1111");
        expect(formatNumber(0x1abcden, 16, group)).toBe("1a bcde");
        expect(formatNumber(-4096n, 16, group)).toBe("-1000");
    });

    it("writes negative numbers with a sign", () => {
        expect(formatNumber(-10n, 2, plain)).toBe("-1010");
    });
});

describe("bitLength", () => {
    it("counts the bits of the absolute value", () => {
        expect(bitLength(0n)).toBe(0);
        expect(bitLength(255n)).toBe(8);
        expect(bitLength(-256n)).toBe(9);
        expect(bitLength(2n ** 256n - 1n)).toBe(256);
    });
});
