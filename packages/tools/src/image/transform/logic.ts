/*
 * Rotate and flip. A turn of 90, 180, or 270 degrees loses no pixel. Another
 * angle makes a larger image that holds the whole turned picture; the corners
 * are transparent, or a chosen color.
 */

export interface Transform {
    /** Degrees, clockwise. */
    angle: number;
    flipX: boolean;
    flipY: boolean;
}

/** The angle in [0, 360). */
export function normalizeAngle(angle: number): number {
    return ((angle % 360) + 360) % 360;
}

/** The size of the box that holds the image turned by the angle. */
export function rotatedSize(
    width: number,
    height: number,
    angle: number,
): { width: number; height: number } {
    const a = normalizeAngle(angle);
    if (a === 0 || a === 180) return { width, height };
    if (a === 90 || a === 270) return { width: height, height: width };
    const r = (a * Math.PI) / 180;
    const cos = Math.abs(Math.cos(r));
    const sin = Math.abs(Math.sin(r));
    return {
        width: Math.round(width * cos + height * sin),
        height: Math.round(width * sin + height * cos),
    };
}

/** Whether the turn keeps every pixel exactly (a multiple of 90 degrees). */
export function isLossless(angle: number): boolean {
    return normalizeAngle(angle) % 90 === 0;
}

/**
 * The canvas matrix for the transform, for an output of the given size. The
 * image is drawn at (-width / 2, -height / 2) after this matrix.
 */
export function matrix(
    transform: Transform,
    outWidth: number,
    outHeight: number,
): [number, number, number, number, number, number] {
    const r = (normalizeAngle(transform.angle) * Math.PI) / 180;
    // Exact values for the right angles, so there is no blur from rounding.
    const cos = isLossless(transform.angle) ? Math.round(Math.cos(r)) : Math.cos(r);
    const sin = isLossless(transform.angle) ? Math.round(Math.sin(r)) : Math.sin(r);
    const sx = transform.flipX ? -1 : 1;
    const sy = transform.flipY ? -1 : 1;
    // translate(center) . rotate(r) . scale(sx, sy)
    return [cos * sx, sin * sx, -sin * sy, cos * sy, outWidth / 2, outHeight / 2];
}
