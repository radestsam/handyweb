import { describe, expect, it } from "vitest";
import { centeredCrop, clampRect, cropName, resizeTo } from "./logic";

describe("crop", () => {
    it("centers the largest rectangle with the ratio", () => {
        expect(centeredCrop(4000, 3000, 1)).toEqual({ x: 500, y: 0, width: 3000, height: 3000 });
        expect(centeredCrop(4000, 3000, 16 / 9)).toEqual({
            x: 0,
            y: 375,
            width: 4000,
            height: 2250,
        });
        expect(centeredCrop(400, 300, null)).toEqual({ x: 0, y: 0, width: 400, height: 300 });
    });

    it("keeps a rectangle inside the image", () => {
        expect(clampRect({ x: 350, y: -10, width: 100, height: 50.4 }, 400, 300)).toEqual({
            x: 300,
            y: 0,
            width: 100,
            height: 50,
        });
        expect(clampRect({ x: 0, y: 0, width: 0, height: 999 }, 400, 300)).toEqual({
            x: 0,
            y: 0,
            width: 1,
            height: 300,
        });
    });

    it("resizes from the corner with and without a ratio", () => {
        const start = { x: 100, y: 100, width: 10, height: 10 };
        expect(resizeTo(start, 300, 200, null, 400, 300)).toEqual({
            x: 100,
            y: 100,
            width: 200,
            height: 100,
        });
        expect(resizeTo(start, 300, 200, 1, 400, 300)).toEqual({
            x: 100,
            y: 100,
            width: 200,
            height: 200,
        });
        // A square that would pass the bottom edge shrinks to fit.
        expect(resizeTo(start, 400, 150, 1, 400, 300)).toEqual({
            x: 100,
            y: 100,
            width: 200,
            height: 200,
        });
    });

    it("names the output", () => {
        expect(cropName("photo.jpeg", { x: 0, y: 0, width: 80, height: 60 }, "image/jpeg")).toBe(
            "photo-crop-80x60.jpg",
        );
    });
});
