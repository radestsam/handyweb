import { describe, expect, it } from "vitest";
import { averageAt, pixelAt } from "./logic";

// A 2 x 2 image: red, green / blue, transparent.
const pixels = {
    width: 2,
    height: 2,
    data: Uint8ClampedArray.from([255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 9, 9, 9, 0]),
};

describe("color picker", () => {
    it("reads one pixel", () => {
        expect(averageAt(pixels, 1, 0, 0)).toEqual({ r: 0, g: 255, b: 0, a: 1 });
    });

    it("averages around a pixel and ignores transparent pixels for the color", () => {
        const color = averageAt(pixels, 0, 0, 1);
        expect(color.r).toBeCloseTo(85);
        expect(color.g).toBeCloseTo(85);
        expect(color.b).toBeCloseTo(85);
        expect(color.a).toBeCloseTo(0.75);
    });

    it("maps a point of the shown image to a pixel", () => {
        expect(pixelAt(150, 10, 300, 200, 4000, 3000)).toEqual({ x: 2000, y: 150 });
        expect(pixelAt(300, 200, 300, 200, 4000, 3000)).toEqual({ x: 3999, y: 2999 });
        expect(pixelAt(-5, -5, 300, 200, 4000, 3000)).toEqual({ x: 0, y: 0 });
    });
});
