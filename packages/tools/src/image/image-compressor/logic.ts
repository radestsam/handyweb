import { EXTENSIONS, type OutputType } from "@handyweb/core/image";
import { safeFileName } from "@handyweb/core/files";

/** The size that fits inside a square of maxSide, or the same size when it already fits. */
export function fitInside(
    width: number,
    height: number,
    maxSide: number | null,
): { width: number; height: number } {
    if (maxSide === null || maxSide <= 0 || Math.max(width, height) <= maxSide)
        return { width, height };
    const scale = maxSide / Math.max(width, height);
    return {
        width: Math.max(1, Math.round(width * scale)),
        height: Math.max(1, Math.round(height * scale)),
    };
}

export function compressedName(source: string, type: OutputType): string {
    return safeFileName(
        `${source.replace(/\.[^.]+$/, "") || "image"}-compressed.${EXTENSIONS[type]}`,
    );
}

/** The saving in percent, rounded. A negative value means the file got larger. */
export function saving(before: number, after: number): number {
    return before > 0 ? Math.round((1 - after / before) * 100) : 0;
}
