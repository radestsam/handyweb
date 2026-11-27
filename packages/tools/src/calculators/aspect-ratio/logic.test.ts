import { describe, expect, it } from "vitest";
import { nearest, otherSide, simplify } from "./logic";

describe("aspect ratio", () => {
    it("simplifies sizes", () => {
        expect(simplify(1920, 1080)).toEqual([16, 9]);
        expect(simplify(1080, 1350)).toEqual([4, 5]);
        expect(simplify(1366, 768)).toEqual([683, 384]);
    });

    it("finds a near common ratio", () => {
        expect(nearest(1366, 768)?.id).toBe("16:9");
        expect(nearest(2560, 1600)?.id).toBe("16:10");
        expect(nearest(1000, 300)).toBeNull();
    });

    it("finds the other side", () => {
        expect(otherSide(16, 9, "width", 1280)).toBe(720);
        expect(otherSide(4, 5, "height", 1350)).toBe(1080);
    });
});
