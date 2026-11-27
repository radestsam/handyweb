import { EXTENSIONS, type OutputType } from "@handyweb/core/image";
import { safeFileName } from "@handyweb/core/files";

/** A crop rectangle in source pixels. */
export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

/** Aspect ratios as width / height. null is free. */
export const RATIOS: ReadonlyArray<{ id: string; label: string; value: number | null }> = [
    { id: "free", label: "", value: null },
    { id: "1:1", label: "1:1", value: 1 },
    { id: "4:3", label: "4:3", value: 4 / 3 },
    { id: "3:2", label: "3:2", value: 3 / 2 },
    { id: "16:9", label: "16:9", value: 16 / 9 },
    { id: "4:5", label: "4:5", value: 4 / 5 },
    { id: "9:16", label: "9:16", value: 9 / 16 },
];

/** The largest centered rectangle with the ratio. Without a ratio, the whole image. */
export function centeredCrop(width: number, height: number, ratio: number | null): Rect {
    if (ratio === null) return { x: 0, y: 0, width, height };
    let w = width;
    let h = Math.round(width / ratio);
    if (h > height) {
        h = height;
        w = Math.round(height * ratio);
    }
    return { x: Math.round((width - w) / 2), y: Math.round((height - h) / 2), width: w, height: h };
}

/**
 * Makes a rectangle whole, at least 1 x 1, and inside the image. A move keeps
 * the size and stops at the edges.
 */
export function clampRect(rect: Rect, width: number, height: number): Rect {
    const w = Math.min(width, Math.max(1, Math.round(rect.width)));
    const h = Math.min(height, Math.max(1, Math.round(rect.height)));
    const x = Math.min(width - w, Math.max(0, Math.round(rect.x)));
    const y = Math.min(height - h, Math.max(0, Math.round(rect.y)));
    return { x, y, width: w, height: h };
}

/**
 * Resizes from the top-left corner (x, y) to a new end corner, and keeps the
 * ratio when there is one. The corner stays inside the image.
 */
export function resizeTo(
    rect: Rect,
    endX: number,
    endY: number,
    ratio: number | null,
    width: number,
    height: number,
): Rect {
    let w = Math.max(1, Math.min(endX, width) - rect.x);
    let h = Math.max(1, Math.min(endY, height) - rect.y);
    if (ratio !== null) {
        // Follow the side that moved more, then fit inside the image.
        if (w / h > ratio) h = w / ratio;
        else w = h * ratio;
        const scale = Math.min(1, (width - rect.x) / w, (height - rect.y) / h);
        w *= scale;
        h *= scale;
    }
    return clampRect({ x: rect.x, y: rect.y, width: w, height: h }, width, height);
}

export function cropName(source: string, rect: Rect, type: OutputType): string {
    const base = source.replace(/\.[^.]+$/, "") || "image";
    return safeFileName(`${base}-crop-${rect.width}x${rect.height}.${EXTENSIONS[type]}`);
}
