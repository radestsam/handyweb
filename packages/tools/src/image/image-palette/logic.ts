import type { Rgba } from "../../developer/color-converter/logic";
import type { Pixels } from "../image-color-picker/logic";

export interface Swatch {
    color: Rgba;
    /** The part of the picture with this color, 0 to 1. */
    share: number;
}

type Pixel = [number, number, number];

/**
 * Finds the main colors with median cut: put every pixel in one box, then
 * split the box with the most pixels times the widest color range at the
 * median, until there are enough boxes. Each box gives its average color.
 * The result is the same every time for the same picture. Pixels that are
 * mostly transparent are left out.
 */
export function extractPalette(pixels: Pixels, count: number): Swatch[] {
    const all: Pixel[] = [];
    for (let i = 0; i < pixels.data.length; i += 4) {
        if ((pixels.data[i + 3] as number) < 128) continue;
        all.push([
            pixels.data[i] as number,
            pixels.data[i + 1] as number,
            pixels.data[i + 2] as number,
        ]);
    }
    if (all.length === 0) return [];
    let boxes: Pixel[][] = [all];
    while (boxes.length < count) {
        let best = -1;
        let bestScore = 0;
        let bestChannel = 0;
        boxes.forEach((box, index) => {
            if (box.length < 2) return;
            for (let channel = 0; channel < 3; channel++) {
                let min = 255;
                let max = 0;
                for (const pixel of box) {
                    min = Math.min(min, pixel[channel] as number);
                    max = Math.max(max, pixel[channel] as number);
                }
                const score = (max - min) * box.length;
                if (score > bestScore) {
                    bestScore = score;
                    best = index;
                    bestChannel = channel;
                }
            }
        });
        if (best < 0) break;
        const box = (boxes[best] as Pixel[])
            .slice()
            .sort((a, b) => (a[bestChannel] as number) - (b[bestChannel] as number));
        // Split near the median, but between two different values, so that
        // pixels of one color never go into two boxes.
        const middle = Math.floor(box.length / 2);
        const value = (box[middle] as Pixel)[bestChannel] as number;
        let low = middle;
        while (low > 0 && (box[low - 1] as Pixel)[bestChannel] === value) low--;
        let high = middle;
        while (high < box.length && (box[high] as Pixel)[bestChannel] === value) high++;
        const split =
            low > 0 && (middle - low <= high - middle || high === box.length) ? low : high;
        boxes = [
            ...boxes.slice(0, best),
            box.slice(0, split),
            box.slice(split),
            ...boxes.slice(best + 1),
        ];
    }
    return boxes
        .map((box) => {
            const sum = box.reduce(
                (acc, pixel) => [acc[0] + pixel[0], acc[1] + pixel[1], acc[2] + pixel[2]],
                [0, 0, 0],
            );
            return {
                color: {
                    r: Math.round(sum[0] / box.length),
                    g: Math.round(sum[1] / box.length),
                    b: Math.round(sum[2] / box.length),
                    a: 1,
                },
                share: box.length / all.length,
            };
        })
        .sort((a, b) => b.share - a.share);
}

export type ExportFormat = "css" | "hex" | "json";

export function exportPalette(hexes: string[], format: ExportFormat): string {
    if (format === "css")
        return `:root {\n${hexes.map((hex, i) => `    --color-${i + 1}: ${hex};`).join("\n")}\n}`;
    if (format === "json") return JSON.stringify(hexes, null, 2);
    return hexes.join("\n");
}

/** The size of the small copy that the colors are read from. */
export function sampleSize(
    width: number,
    height: number,
    max = 128,
): { width: number; height: number } {
    const scale = Math.min(1, max / Math.max(width, height));
    return {
        width: Math.max(1, Math.round(width * scale)),
        height: Math.max(1, Math.round(height * scale)),
    };
}
