import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { contrastRatio, formatColor, parseColor } from "./logic";

const rgb = (text: string) => {
    const c = parseColor(text);
    return [Math.round(c.r), Math.round(c.g), Math.round(c.b), Math.round(c.a * 100) / 100];
};

describe("parseColor", () => {
    it("reads hex in every length", () => {
        expect(rgb("#bc4a3c")).toEqual([188, 74, 60, 1]);
        expect(rgb("bc4a3c")).toEqual([188, 74, 60, 1]);
        expect(rgb("#f00")).toEqual([255, 0, 0, 1]);
        expect(rgb("#f008")).toEqual([255, 0, 0, 0.53]);
        expect(rgb("#ff000080")).toEqual([255, 0, 0, 0.5]);
    });

    it("reads rgb(), hsl(), and hwb() in old and new syntax", () => {
        expect(rgb("rgb(188, 74, 60)")).toEqual([188, 74, 60, 1]);
        expect(rgb("rgba(188 74 60 / 50%)")).toEqual([188, 74, 60, 0.5]);
        expect(rgb("rgb(100% 0% 0%)")).toEqual([255, 0, 0, 1]);
        expect(rgb("hsl(120, 100%, 50%)")).toEqual([0, 255, 0, 1]);
        expect(rgb("hsl(0.5turn 100% 50%)")).toEqual([0, 255, 255, 1]);
        expect(rgb("hwb(0 0% 0%)")).toEqual([255, 0, 0, 1]);
        expect(rgb("hwb(0 50% 50%)")).toEqual([128, 128, 128, 1]);
    });

    it("reads color names", () => {
        expect(rgb("Tomato")).toEqual([255, 99, 71, 1]);
        expect(rgb("rebeccapurple")).toEqual([102, 51, 153, 1]);
        expect(rgb("transparent")).toEqual([0, 0, 0, 0]);
    });

    it("rejects unknown text", () => {
        expect(() => parseColor("notacolor")).toThrow(ToolFailure);
        expect(() => parseColor("rgb(1,2)")).toThrow(ToolFailure);
        expect(() => parseColor("#12345")).toThrow(ToolFailure);
    });
});

describe("formatColor", () => {
    it("writes every format", () => {
        expect(formatColor(parseColor("#bc4a3c"))).toEqual({
            hex: "#bc4a3c",
            rgb: "rgb(188 74 60)",
            hsl: "hsl(7 52% 49%)",
            hwb: "hwb(7 24% 26%)",
            oklch: "oklch(55.9% 0.15 29.6)",
            cmyk: "cmyk(0% 61% 68% 26%)",
        });
    });

    it("keeps alpha", () => {
        expect(formatColor(parseColor("rgb(0 0 0 / 0.5)"))).toMatchObject({
            hex: "#00000080",
            rgb: "rgb(0 0 0 / 0.5)",
        });
    });

    it("writes black, white, and gray without hue", () => {
        expect(formatColor(parseColor("white")).oklch).toBe("oklch(100% 0 0)");
        expect(formatColor(parseColor("black")).cmyk).toBe("cmyk(0% 0% 0% 100%)");
    });
});

describe("contrastRatio", () => {
    it("matches WCAG", () => {
        expect(contrastRatio(parseColor("black"), parseColor("white"))).toBeCloseTo(21);
        expect(contrastRatio(parseColor("#bc4a3c"), parseColor("white"))).toBeCloseTo(5.06, 1);
    });
});
