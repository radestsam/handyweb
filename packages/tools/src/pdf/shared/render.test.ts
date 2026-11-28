import { describe, expect, it } from "vitest";
import { renderScale } from "./render";

describe("renderScale", () => {
    it("scales to the resolution and stays inside canvas limits", () => {
        expect(renderScale(612, 792, 72)).toBe(1);
        expect(renderScale(612, 792, 300)).toBeCloseTo(300 / 72);
        // A poster of 2 x 2 m at 300 dpi: about 23,600 px per side.
        const big = renderScale(5669, 5669, 300);
        expect(5669 * big).toBeLessThanOrEqual(16_384);
        expect(5669 * 5669 * big * big).toBeLessThanOrEqual(16_777_216 + 1);
    });
});
