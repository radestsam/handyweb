import type { Rgba } from "../../developer/color-converter/logic";

export interface Pixels {
    data: Uint8ClampedArray;
    width: number;
    height: number;
}

/**
 * The average color of the square around (x, y). A radius of 0 is one pixel;
 * 1 is 3 x 3; 2 is 5 x 5. Pixels outside the image are left out. Colors are
 * weighted by alpha, so a transparent pixel does not darken the average.
 */
export function averageAt(pixels: Pixels, x: number, y: number, radius: number): Rgba {
    let r = 0;
    let g = 0;
    let b = 0;
    let a = 0;
    let count = 0;
    for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
            const px = x + dx;
            const py = y + dy;
            if (px < 0 || py < 0 || px >= pixels.width || py >= pixels.height) continue;
            const i = (py * pixels.width + px) * 4;
            const alpha = (pixels.data[i + 3] as number) / 255;
            r += (pixels.data[i] as number) * alpha;
            g += (pixels.data[i + 1] as number) * alpha;
            b += (pixels.data[i + 2] as number) * alpha;
            a += alpha;
            count++;
        }
    }
    if (count === 0 || a === 0) return { r: 0, g: 0, b: 0, a: 0 };
    return { r: r / a, g: g / a, b: b / a, a: a / count };
}

/** The image pixel under a point of the shown image, kept inside the image. */
export function pixelAt(
    offsetX: number,
    offsetY: number,
    shownWidth: number,
    shownHeight: number,
    width: number,
    height: number,
): { x: number; y: number } {
    const x = Math.floor((offsetX / shownWidth) * width);
    const y = Math.floor((offsetY / shownHeight) * height);
    return { x: Math.min(width - 1, Math.max(0, x)), y: Math.min(height - 1, Math.max(0, y)) };
}
