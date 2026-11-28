import { describe, expect, it } from "vitest";
import { boxBlur, pixelate, regionFrom } from "./logic";

function row(values: number[]): Uint8ClampedArray {
    return Uint8ClampedArray.from(values.flatMap((v) => [v, v, v, 255]));
}

describe("boxBlur", () => {
    it("spreads a bright pixel and keeps the total about the same", () => {
        const data = row([0, 0, 0, 0, 255, 0, 0, 0, 0]);
        boxBlur(data, 9, 1, 1);
        const reds = [...data].filter((_, i) => i % 4 === 0);
        expect(reds[4]).toBeLessThan(255);
        expect(reds[3]).toBeGreaterThan(0);
        expect(reds[4]).toBeGreaterThanOrEqual(reds[2] as number);
        expect(Math.abs(reds.reduce((a, b) => a + b, 0) - 255)).toBeLessThan(10);
    });

    it("does nothing with a radius of 0 and keeps a flat color", () => {
        const data = row([7, 7, 7]);
        boxBlur(data, 3, 1, 0);
        expect([...data]).toEqual([...row([7, 7, 7])]);
        boxBlur(data, 3, 1, 5);
        expect([...data]).toEqual([...row([7, 7, 7])]);
    });
});

describe("pixelate", () => {
    it("averages each block, with smaller blocks at the edge", () => {
        const data = row([0, 10, 20, 30, 100]);
        pixelate(data, 5, 1, 2);
        expect([...data].filter((_, i) => i % 4 === 0)).toEqual([5, 5, 25, 25, 100]);
    });
});

describe("regionFrom", () => {
    it("orders and clamps the corners", () => {
        expect(regionFrom(50, 40, 10, -5, 40, 30)).toEqual({ x: 10, y: 0, width: 30, height: 30 });
        expect(regionFrom(5, 5, 5, 5, 40, 30)).toEqual({ x: 5, y: 5, width: 1, height: 1 });
    });
});
