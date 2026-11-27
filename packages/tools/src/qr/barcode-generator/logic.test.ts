import { describe, expect, it } from "vitest";
import { checkDigit, CODE128, code128Values, completeEan, encode, toSvg } from "./logic";

describe("Code 128", () => {
    it("has 107 patterns of 11 modules (the stop code has 13)", () => {
        expect(CODE128).toHaveLength(107);
        CODE128.forEach((pattern, value) => {
            const sum = [...pattern].reduce((total, width) => total + Number(width), 0);
            expect(sum, `value ${value}`).toBe(value === 106 ? 13 : 11);
        });
        expect(new Set(CODE128).size).toBe(107);
    });

    it("computes the checksum", () => {
        // Start B (104), "A" (33), "B" (34): (104 + 33 + 34 * 2) % 103 = 102.
        expect(code128Values("AB")).toEqual([104, 33, 34, 102]);
        // An even run of digits uses set C.
        expect(code128Values("123456")).toEqual([
            105,
            12,
            34,
            56,
            (105 + 12 + 34 * 2 + 56 * 3) % 103,
        ]);
    });

    it("refuses Persian letters", () => {
        expect(() => encode("سلام", "code128")).toThrow(/ASCII/);
    });
});

describe("EAN and UPC", () => {
    it("computes and checks the check digit", () => {
        expect(checkDigit("400638133393")).toBe(1);
        expect(completeEan("400638133393", 13)).toBe("4006381333931");
        expect(() => completeEan("4006381333932", 13)).toThrow(/should be 1/);
        expect(completeEan("9638507", 8)).toBe("96385074");
        expect(completeEan("03600029145", 12)).toBe("036000291452");
    });

    it("makes 95 modules for EAN-13 and 67 for EAN-8", () => {
        const sum = (widths: number[]) => widths.reduce((a, b) => a + b, 0);
        expect(sum(encode("4006381333931", "ean13").widths)).toBe(95);
        expect(sum(encode("96385074", "ean8").widths)).toBe(67);
        expect(sum(encode("036000291452", "upca").widths)).toBe(95);
    });
});

describe("toSvg", () => {
    it("draws bars and escapes the text", () => {
        const svg = toSvg(encode("<A&B>", "code128"), {
            module: 2,
            height: 60,
            showText: true,
            dark: "#000000",
            light: "#ffffff",
        });
        expect(svg.startsWith("<svg")).toBe(true);
        expect(svg).toContain("&#60;A&#38;B&#62;");
        expect(svg).not.toContain("<A&B>");
    });
});
