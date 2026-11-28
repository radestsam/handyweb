import { describe, expect, it } from "vitest";
import { isLossless, matrix, normalizeAngle, rotatedSize } from "./logic";

/** Where the matrix puts the image point (x, y) of a width x height image. */
function apply(m: number[], width: number, height: number, x: number, y: number): [number, number] {
    const px = x - width / 2;
    const py = y - height / 2;
    const [a, b, c, d, e, f] = m as [number, number, number, number, number, number];
    return [Math.round(a * px + c * py + e), Math.round(b * px + d * py + f)];
}

describe("transform", () => {
    it("normalizes angles", () => {
        expect(normalizeAngle(-90)).toBe(270);
        expect(normalizeAngle(450)).toBe(90);
    });

    it("swaps the sides for a quarter turn and grows the box for other angles", () => {
        expect(rotatedSize(400, 300, 90)).toEqual({ width: 300, height: 400 });
        expect(rotatedSize(400, 300, 180)).toEqual({ width: 400, height: 300 });
        expect(rotatedSize(100, 100, 45)).toEqual({ width: 141, height: 141 });
        expect(isLossless(270)).toBe(true);
        expect(isLossless(15)).toBe(false);
    });

    it("turns clockwise", () => {
        // The top-left corner of a 4 x 2 image goes to the top-right of the 2 x 4 result.
        expect(apply(matrix({ angle: 90, flipX: false, flipY: false }, 2, 4), 4, 2, 0, 0)).toEqual([
            2, 0,
        ]);
    });

    it("flips", () => {
        expect(apply(matrix({ angle: 0, flipX: true, flipY: false }, 4, 2), 4, 2, 0, 0)).toEqual([
            4, 0,
        ]);
        expect(apply(matrix({ angle: 0, flipX: false, flipY: true }, 4, 2), 4, 2, 0, 0)).toEqual([
            0, 2,
        ]);
    });
});
