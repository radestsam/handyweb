import { describe, expect, it } from "vitest";
import { exportPalette, extractPalette, sampleSize } from "./logic";

function image(colors: Array<[number, number, number, number, number]>) {
    // Each entry: r, g, b, alpha, number of pixels.
    const data: number[] = [];
    for (const [r, g, b, a, n] of colors) for (let i = 0; i < n; i++) data.push(r, g, b, a);
    return { data: Uint8ClampedArray.from(data), width: data.length / 4, height: 1 };
}

describe("extractPalette", () => {
    it("finds the main colors and their shares", () => {
        const palette = extractPalette(
            image([
                [200, 30, 30, 255, 60],
                [20, 40, 200, 255, 30],
                [250, 250, 250, 255, 10],
            ]),
            3,
        );
        expect(palette.map((s) => [s.color.r, s.color.g, s.color.b])).toEqual([
            [200, 30, 30],
            [20, 40, 200],
            [250, 250, 250],
        ]);
        expect(palette.map((s) => Math.round(s.share * 100))).toEqual([60, 30, 10]);
    });

    it("leaves out transparent pixels and stops when there are fewer colors", () => {
        const palette = extractPalette(
            image([
                [10, 10, 10, 255, 5],
                [99, 99, 99, 0, 50],
            ]),
            4,
        );
        expect(palette).toHaveLength(1);
        expect(palette[0]?.color).toEqual({ r: 10, g: 10, b: 10, a: 1 });
        expect(extractPalette(image([[0, 0, 0, 0, 3]]), 4)).toEqual([]);
    });
});

describe("exportPalette", () => {
    it("writes CSS, a list, and JSON", () => {
        expect(exportPalette(["#ff0000", "#00ff00"], "css")).toBe(
            ":root {\n    --color-1: #ff0000;\n    --color-2: #00ff00;\n}",
        );
        expect(exportPalette(["#ff0000"], "json")).toBe('[\n  "#ff0000"\n]');
        expect(sampleSize(4000, 3000)).toEqual({ width: 128, height: 96 });
        expect(sampleSize(50, 20)).toEqual({ width: 50, height: 20 });
    });
});
