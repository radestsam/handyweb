import { describe, expect, it } from "vitest";
import { compressedName, fitInside, saving } from "./logic";

describe("image compressor", () => {
    it("fits the longest side", () => {
        expect(fitInside(4000, 3000, 1920)).toEqual({ width: 1920, height: 1440 });
        expect(fitInside(800, 600, 1920)).toEqual({ width: 800, height: 600 });
        expect(fitInside(800, 600, null)).toEqual({ width: 800, height: 600 });
    });

    it("names the output and computes the saving", () => {
        expect(compressedName("photo.png", "image/webp")).toBe("photo-compressed.webp");
        expect(saving(1000, 250)).toBe(75);
        expect(saving(1000, 1200)).toBe(-20);
    });
});
