import { ToolFailure } from "@handyweb/core/runtime";
import { checkCanvasSize, EXTENSIONS, type OutputType } from "@handyweb/core/image";
import { safeFileName } from "@handyweb/core/files";

export type ResizeRequest =
    | { mode: "pixels"; width: number | null; height: number | null; keepRatio: boolean }
    | { mode: "percent"; percent: number }
    | { mode: "longest"; side: number };

/**
 * The output size for a request. With "keep ratio", an empty side follows the
 * other one; with both sides set, the image fits inside the box. Sizes are
 * whole pixels and at least 1.
 */
export function targetSize(
    width: number,
    height: number,
    request: ResizeRequest,
): { width: number; height: number } {
    const ratio = width / height;
    let w: number;
    let h: number;
    if (request.mode === "percent") {
        if (!(request.percent > 0)) throw invalid();
        w = (width * request.percent) / 100;
        h = (height * request.percent) / 100;
    } else if (request.mode === "longest") {
        if (!(request.side > 0)) throw invalid();
        const scale = request.side / Math.max(width, height);
        w = width * scale;
        h = height * scale;
    } else {
        const rw = request.width && request.width > 0 ? request.width : null;
        const rh = request.height && request.height > 0 ? request.height : null;
        if (rw === null && rh === null) throw invalid();
        if (!request.keepRatio) {
            w = rw ?? width;
            h = rh ?? height;
        } else if (rw !== null && rh !== null) {
            const scale = Math.min(rw / width, rh / height);
            w = width * scale;
            h = height * scale;
        } else if (rw !== null) {
            w = rw;
            h = rw / ratio;
        } else {
            h = rh as number;
            w = (rh as number) * ratio;
        }
    }
    const size = { width: Math.max(1, Math.round(w)), height: Math.max(1, Math.round(h)) };
    checkCanvasSize(size.width, size.height);
    return size;
}

function invalid(): ToolFailure {
    return new ToolFailure(
        "invalid-input",
        { fa: "یک اندازه بزرگ‌تر از صفر بنویسید.", en: "Enter a size larger than zero." },
        "size",
    );
}

/** photo.jpg, 800 x 600, WebP: photo-800x600.webp */
export function outputName(
    source: string,
    width: number,
    height: number,
    type: OutputType,
): string {
    const base = source.replace(/\.[^.]+$/, "") || "image";
    return safeFileName(`${base}-${width}x${height}.${EXTENSIONS[type]}`);
}
