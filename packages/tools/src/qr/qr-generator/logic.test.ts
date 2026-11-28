import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { colorWarning, contrast, makeQr, QUIET_ZONE, toSvg } from "./logic";

function failure(fn: () => unknown): ToolFailure {
    try {
        fn();
    } catch (error) {
        if (error instanceof ToolFailure) return error;
        throw error;
    }
    throw new Error("expected a ToolFailure");
}

describe("makeQr", () => {
    it("makes a version 1 code with the quiet zone for short text", () => {
        const qr = makeQr("HELLO", "L");
        expect(qr.version).toBe(1);
        expect(qr.size).toBe(21 + 2 * QUIET_ZONE);
        expect(qr.modules).toHaveLength(qr.size);
        // The quiet zone is light, and the finder pattern starts dark.
        expect(qr.modules[0]?.every((on) => !on)).toBe(true);
        expect(qr.modules[QUIET_ZONE]?.[QUIET_ZONE]).toBe(true);
    });

    it("grows with the text and the error correction level", () => {
        const url = "https://handyweb.ir/fa/tools/qr-generator/";
        expect(makeQr(url, "H").version).toBeGreaterThan(makeQr(url, "L").version);
        expect(makeQr("سلام دنیا، این یک آزمون است", "M").version).toBeGreaterThan(1);
    });

    it("rejects empty text and text that does not fit", () => {
        expect(failure(() => makeQr("", "L")).detail).toBe("empty");
        expect(failure(() => makeQr("x".repeat(3000), "H")).detail).toBe("data too long");
    });
});

describe("toSvg", () => {
    it("draws one square per dark module on a background", () => {
        const qr = makeQr("A", "L");
        const svg = toSvg(qr, "#000000", "#ffffff");
        const dark = qr.modules.flat().filter(Boolean).length;
        expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29"')).toBe(
            true,
        );
        expect(svg.match(/h1v1h-1z/g)).toHaveLength(dark);
        expect(svg).toContain('fill="#ffffff"');
        expect(svg).not.toMatch(/script|href/i);
    });

    it("accepts only #rrggbb colors", () => {
        expect(() => toSvg(makeQr("A", "L"), 'red" onload="x', "#ffffff")).toThrow(RangeError);
    });
});

describe("colors", () => {
    it("computes the contrast ratio", () => {
        expect(contrast("#000000", "#ffffff")).toBeCloseTo(21);
        expect(contrast("#ffffff", "#ffffff")).toBeCloseTo(1);
    });

    it("warns about inverted and weak colors", () => {
        expect(colorWarning("#000000", "#ffffff")).toBeNull();
        expect(colorWarning("#bc4a3c", "#ffffff")).toBeNull();
        expect(colorWarning("#ffffff", "#000000")).toBe("inverted");
        expect(colorWarning("#999999", "#ffffff")).toBe("low-contrast");
    });
});
