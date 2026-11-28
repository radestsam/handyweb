/*
 * Blur and pixelate on raw RGBA pixels. They run in plain JavaScript, so the
 * result is the same in every browser (Safari has no canvas filter).
 */

export interface Region {
    x: number;
    y: number;
    width: number;
    height: number;
}

/** One pass of a box blur along rows (horizontal) or columns. */
function boxPass(
    src: Uint8ClampedArray,
    dst: Uint8ClampedArray,
    width: number,
    height: number,
    radius: number,
    horizontal: boolean,
): void {
    const lines = horizontal ? height : width;
    const length = horizontal ? width : height;
    const step = horizontal ? 4 : width * 4;
    const window = radius * 2 + 1;
    for (let line = 0; line < lines; line++) {
        const base = horizontal ? line * width * 4 : line * 4;
        for (let c = 0; c < 4; c++) {
            // The edge pixel repeats past the border.
            const at = (i: number) =>
                src[base + Math.min(length - 1, Math.max(0, i)) * step + c] as number;
            let sum = 0;
            for (let i = -radius; i <= radius; i++) sum += at(i);
            for (let i = 0; i < length; i++) {
                dst[base + i * step + c] = Math.round(sum / window);
                sum += at(i + radius + 1) - at(i - radius);
            }
        }
    }
}

/**
 * Blurs the pixels in place. Three box blurs in each direction are close to a
 * Gaussian blur. The radius is in pixels.
 */
export function boxBlur(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    radius: number,
): void {
    const r = Math.max(0, Math.round(radius));
    if (r === 0 || width === 0 || height === 0) return;
    const temp = new Uint8ClampedArray(data.length);
    for (let pass = 0; pass < 3; pass++) {
        boxPass(data, temp, width, height, r, true);
        boxPass(temp, data, width, height, r, false);
    }
}

/** Replaces each block of size x size pixels with its average color, in place. */
export function pixelate(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    size: number,
): void {
    const block = Math.max(1, Math.round(size));
    if (block === 1) return;
    for (let by = 0; by < height; by += block) {
        for (let bx = 0; bx < width; bx += block) {
            const w = Math.min(block, width - bx);
            const h = Math.min(block, height - by);
            const sum = [0, 0, 0, 0];
            for (let y = by; y < by + h; y++) {
                for (let x = bx; x < bx + w; x++) {
                    const i = (y * width + x) * 4;
                    for (let c = 0; c < 4; c++)
                        sum[c] = (sum[c] as number) + (data[i + c] as number);
                }
            }
            const count = w * h;
            const average = sum.map((value) => Math.round(value / count));
            for (let y = by; y < by + h; y++) {
                for (let x = bx; x < bx + w; x++) data.set(average, (y * width + x) * 4);
            }
        }
    }
}

/** A rectangle from two corner points, kept inside the image and at least 1 x 1. */
export function regionFrom(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    width: number,
    height: number,
): Region {
    const left = Math.max(0, Math.min(width - 1, Math.round(Math.min(x1, x2))));
    const top = Math.max(0, Math.min(height - 1, Math.round(Math.min(y1, y2))));
    const right = Math.max(left + 1, Math.min(width, Math.round(Math.max(x1, x2))));
    const bottom = Math.max(top + 1, Math.min(height, Math.round(Math.max(y1, y2))));
    return { x: left, y: top, width: right - left, height: bottom - top };
}
