/*
 * The four common percentage questions. Each returns null when the answer
 * does not exist (a division by zero).
 */

/** What is p% of x? */
export function percentOf(p: number, x: number): number {
    return (p / 100) * x;
}

/** x is what percent of y? */
export function whatPercent(x: number, y: number): number | null {
    return y === 0 ? null : (x / y) * 100;
}

/** The change from a to b, in percent. */
export function percentChange(a: number, b: number): number | null {
    return a === 0 ? null : ((b - a) / Math.abs(a)) * 100;
}

/** x increased (positive p) or decreased (negative p) by p percent. */
export function addPercent(x: number, p: number): number {
    return x * (1 + p / 100);
}
