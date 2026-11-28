/*
 * Where a watermark goes. Sizes are in image pixels. A margin keeps the mark
 * away from the edges.
 */

export type Position =
    | "top-left"
    | "top"
    | "top-right"
    | "left"
    | "center"
    | "right"
    | "bottom-left"
    | "bottom"
    | "bottom-right";

export const POSITIONS: readonly Position[] = [
    "top-left",
    "top",
    "top-right",
    "left",
    "center",
    "right",
    "bottom-left",
    "bottom",
    "bottom-right",
];

/** The top-left corner of a mark of the given size at a grid position. */
export function place(
    width: number,
    height: number,
    markWidth: number,
    markHeight: number,
    position: Position,
    margin: number,
): { x: number; y: number } {
    const column = position.endsWith("left") ? 0 : position.endsWith("right") ? 2 : 1;
    const row = position.startsWith("top") ? 0 : position.startsWith("bottom") ? 2 : 1;
    const x =
        column === 0 ? margin : column === 2 ? width - markWidth - margin : (width - markWidth) / 2;
    const y =
        row === 0 ? margin : row === 2 ? height - markHeight - margin : (height - markHeight) / 2;
    return { x: Math.round(x), y: Math.round(y) };
}

/**
 * Centers of marks that repeat over the whole image in a grid with the given
 * gap, with every second row moved by half a step. The grid reaches past the
 * edges, so a turned pattern still covers the corners.
 */
export function tile(
    width: number,
    height: number,
    stepX: number,
    stepY: number,
): Array<{ x: number; y: number }> {
    const points: Array<{ x: number; y: number }> = [];
    if (stepX <= 0 || stepY <= 0) return points;
    const reach = Math.hypot(width, height);
    const cx = width / 2;
    const cy = height / 2;
    let row = 0;
    for (let y = cy - reach; y <= cy + reach; y += stepY, row++) {
        const shift = row % 2 === 0 ? 0 : stepX / 2;
        for (let x = cx - reach + shift; x <= cx + reach; x += stepX)
            points.push({ x: Math.round(x), y: Math.round(y) });
        if (points.length > 5000) break;
    }
    return points;
}

/** Text that has Persian or Arabic letters is drawn right to left. */
export function isRtl(text: string): boolean {
    return /[֐-ࣿיִ-﷿ﹰ-﻿]/.test(text);
}
