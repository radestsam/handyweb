import { describe, expect, it } from "vitest";
import { outputName, targetSize } from "./logic";

describe("targetSize", () => {
    it("follows the ratio when one side is set", () => {
        expect(
            targetSize(4000, 3000, { mode: "pixels", width: 800, height: null, keepRatio: true }),
        ).toEqual({ width: 800, height: 600 });
        expect(
            targetSize(4000, 3000, { mode: "pixels", width: null, height: 300, keepRatio: true }),
        ).toEqual({ width: 400, height: 300 });
    });

    it("fits inside the box when both sides are set", () => {
        expect(
            targetSize(4000, 3000, { mode: "pixels", width: 1000, height: 1000, keepRatio: true }),
        ).toEqual({ width: 1000, height: 750 });
    });

    it("stretches without the ratio", () => {
        expect(
            targetSize(4000, 3000, { mode: "pixels", width: 100, height: 100, keepRatio: false }),
        ).toEqual({ width: 100, height: 100 });
        expect(
            targetSize(4000, 3000, { mode: "pixels", width: 100, height: null, keepRatio: false }),
        ).toEqual({ width: 100, height: 3000 });
    });

    it("scales by percent and by the longest side", () => {
        expect(targetSize(1001, 501, { mode: "percent", percent: 50 })).toEqual({
            width: 501,
            height: 251,
        });
        expect(targetSize(3000, 4000, { mode: "longest", side: 1080 })).toEqual({
            width: 810,
            height: 1080,
        });
        expect(targetSize(10, 1, { mode: "percent", percent: 1 })).toEqual({ width: 1, height: 1 });
    });

    it("refuses an empty or too large size", () => {
        expect(() =>
            targetSize(100, 100, { mode: "pixels", width: null, height: null, keepRatio: true }),
        ).toThrow();
        expect(() => targetSize(100, 100, { mode: "percent", percent: 0 })).toThrow();
        expect(() => targetSize(100, 100, { mode: "percent", percent: 10_000 })).toThrow(
            /too large/,
        );
    });
});

describe("outputName", () => {
    it("adds the size and the new extension", () => {
        expect(outputName("photo.jpg", 800, 600, "image/webp")).toBe("photo-800x600.webp");
        expect(outputName(".png", 1, 1, "image/png")).toBe("image-1x1.png");
    });
});
