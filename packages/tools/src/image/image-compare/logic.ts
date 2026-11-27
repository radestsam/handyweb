import type { Pixels } from "../image-color-picker/logic";

export interface DiffResult {
    /** Pixels where any channel differs by more than the threshold. */
    changed: number;
    total: number;
    /** An RGBA image: changed pixels in red over a faded copy of the first image. */
    mask: Uint8ClampedArray;
}

/**
 * Compares two images of the same size pixel by pixel. A threshold of 0 finds
 * every change; a higher one ignores small changes such as JPEG noise.
 */
export function diffPixels(a: Pixels, b: Pixels, threshold: number): DiffResult {
    if (a.width !== b.width || a.height !== b.height) throw new RangeError("size");
    const total = a.width * a.height;
    const mask = new Uint8ClampedArray(total * 4);
    let changed = 0;
    for (let i = 0; i < total * 4; i += 4) {
        let delta = 0;
        for (let c = 0; c < 4; c++)
            delta = Math.max(
                delta,
                Math.abs((a.data[i + c] as number) - (b.data[i + c] as number)),
            );
        if (delta > threshold) {
            changed++;
            mask[i] = 255;
            mask[i + 1] = 0;
            mask[i + 2] = 64;
            mask[i + 3] = 255;
        } else {
            // A light gray copy, so the changes stand out.
            const gray =
                ((a.data[i] as number) * 0.3 +
                    (a.data[i + 1] as number) * 0.59 +
                    (a.data[i + 2] as number) * 0.11) /
                    4 +
                191;
            mask[i] = mask[i + 1] = mask[i + 2] = gray;
            mask[i + 3] = 255;
        }
    }
    return { changed, total, mask };
}

/** The common size to compare at: the size of the first image, at most maxPixels. */
export function compareSize(
    width: number,
    height: number,
    maxPixels = 4_000_000,
): { width: number; height: number } {
    const scale = Math.min(1, Math.sqrt(maxPixels / (width * height)));
    return {
        width: Math.max(1, Math.round(width * scale)),
        height: Math.max(1, Math.round(height * scale)),
    };
}
