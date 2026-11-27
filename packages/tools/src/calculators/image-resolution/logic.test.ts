import { describe, expect, it } from "vitest";
import { dpiFor, megapixels, pixelsFor, printSize } from "./logic";

describe("image resolution", () => {
    it("works out the print size", () => {
        expect(printSize(3000, 300, "in")).toBe(10);
        expect(printSize(3000, 300, "cm")).toBeCloseTo(25.4, 10);
    });

    it("works out the pixels for A4 at 300 DPI", () => {
        expect(pixelsFor(21, "cm", 300)).toBe(2480);
        expect(pixelsFor(29.7, "cm", 300)).toBe(3508);
    });

    it("works out the resolution and megapixels", () => {
        expect(dpiFor(2480, 21, "cm")).toBeCloseTo(299.96, 2);
        expect(megapixels(6000, 4000)).toBe(24);
    });
});
