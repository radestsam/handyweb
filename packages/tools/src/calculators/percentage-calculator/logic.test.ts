import { describe, expect, it } from "vitest";
import { addPercent, percentChange, percentOf, whatPercent } from "./logic";

describe("percentage", () => {
    it("answers the four questions", () => {
        expect(percentOf(20, 150)).toBe(30);
        expect(whatPercent(30, 120)).toBe(25);
        expect(percentChange(80, 100)).toBe(25);
        expect(percentChange(100, 80)).toBe(-20);
        expect(percentChange(-50, -25)).toBe(50);
        expect(addPercent(200, 9)).toBeCloseTo(218, 10);
        expect(addPercent(200, -25)).toBe(150);
    });

    it("returns null for a division by zero", () => {
        expect(whatPercent(5, 0)).toBeNull();
        expect(percentChange(0, 5)).toBeNull();
    });
});
