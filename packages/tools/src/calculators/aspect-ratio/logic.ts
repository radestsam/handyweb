export function gcd(a: number, b: number): number {
    let x = Math.abs(Math.round(a));
    let y = Math.abs(Math.round(b));
    while (y) [x, y] = [y, x % y];
    return x || 1;
}

/** 1920 x 1080 is 16:9. Whole numbers only. */
export function simplify(width: number, height: number): [number, number] {
    const divisor = gcd(width, height);
    return [Math.round(width) / divisor, Math.round(height) / divisor];
}

export interface Ratio {
    id: string;
    w: number;
    h: number;
}

export const COMMON: Ratio[] = [
    { id: "1:1", w: 1, h: 1 },
    { id: "4:3", w: 4, h: 3 },
    { id: "3:2", w: 3, h: 2 },
    { id: "16:9", w: 16, h: 9 },
    { id: "16:10", w: 16, h: 10 },
    { id: "21:9", w: 21, h: 9 },
    { id: "4:5", w: 4, h: 5 },
    { id: "9:16", w: 9, h: 16 },
];

/** The nearest common ratio, when it is within 1% of the given one. */
export function nearest(width: number, height: number): Ratio | null {
    const value = width / height;
    let best: Ratio | null = null;
    let bestError = Infinity;
    for (const ratio of COMMON) {
        const error = Math.abs(value / (ratio.w / ratio.h) - 1);
        if (error < bestError) {
            bestError = error;
            best = ratio;
        }
    }
    return bestError <= 0.01 ? best : null;
}

/** The other side for a ratio: the height for a width, or the width for a height. */
export function otherSide(
    ratioW: number,
    ratioH: number,
    side: "width" | "height",
    value: number,
): number {
    return side === "width" ? (value * ratioH) / ratioW : (value * ratioW) / ratioH;
}
