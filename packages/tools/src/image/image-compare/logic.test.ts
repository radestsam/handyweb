import { describe, expect, it } from "vitest";
import { compareSize, diffPixels } from "./logic";

const px = (values: number[]) => ({
    data: Uint8ClampedArray.from(values),
    width: values.length / 4,
    height: 1,
});

describe("diffPixels", () => {
    it("counts changed pixels and marks them red", () => {
        const a = px([10, 10, 10, 255, 50, 50, 50, 255, 0, 0, 0, 255]);
        const b = px([10, 10, 10, 255, 52, 50, 50, 255, 200, 0, 0, 255]);
        const strict = diffPixels(a, b, 0);
        expect(strict.changed).toBe(2);
        expect([...strict.mask.slice(8, 12)]).toEqual([255, 0, 64, 255]);
        expect(diffPixels(a, b, 5).changed).toBe(1);
        expect(strict.total).toBe(3);
    });

    it("refuses different sizes", () => {
        expect(() => diffPixels(px([0, 0, 0, 0]), px([0, 0, 0, 0, 0, 0, 0, 0]), 0)).toThrow();
    });

    it("limits the compare size", () => {
        expect(compareSize(800, 600)).toEqual({ width: 800, height: 600 });
        expect(compareSize(4000, 4000)).toEqual({ width: 2000, height: 2000 });
    });
});
