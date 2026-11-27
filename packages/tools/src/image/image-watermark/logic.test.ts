import { describe, expect, it } from "vitest";
import { isRtl, place, tile } from "./logic";

describe("watermark placement", () => {
    it("places a mark on the 3 x 3 grid with a margin", () => {
        expect(place(1000, 500, 200, 50, "top-left", 20)).toEqual({ x: 20, y: 20 });
        expect(place(1000, 500, 200, 50, "center", 20)).toEqual({ x: 400, y: 225 });
        expect(place(1000, 500, 200, 50, "bottom-right", 20)).toEqual({ x: 780, y: 430 });
        expect(place(1000, 500, 200, 50, "top", 20)).toEqual({ x: 400, y: 20 });
        expect(place(1000, 500, 200, 50, "left", 20)).toEqual({ x: 20, y: 225 });
    });

    it("tiles past the edges with a shift on every second row", () => {
        const points = tile(100, 100, 50, 50);
        expect(points.length).toBeGreaterThan(9);
        expect(points.some((p) => p.x <= 0 && p.y <= 0)).toBe(true);
        expect(points.some((p) => p.x >= 100 && p.y >= 100)).toBe(true);
        expect(tile(100, 100, 0, 50)).toEqual([]);
    });

    it("detects right-to-left text", () => {
        expect(isRtl("© هندی‌وب")).toBe(true);
        expect(isRtl("© HandyWeb 2026")).toBe(false);
    });
});
