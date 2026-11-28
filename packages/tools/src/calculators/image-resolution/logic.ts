/*
 * Pixels, print size, and resolution (DPI or PPI). One inch is 2.54 cm.
 */

const CM_PER_INCH = 2.54;

export type Length = "cm" | "in";

/** The print size of an image with this many pixels at a resolution. */
export function printSize(pixels: number, dpi: number, unit: Length): number {
    const inches = pixels / dpi;
    return unit === "in" ? inches : inches * CM_PER_INCH;
}

/** The pixels needed to print a length at a resolution. */
export function pixelsFor(length: number, unit: Length, dpi: number): number {
    const inches = unit === "in" ? length : length / CM_PER_INCH;
    return Math.round(inches * dpi);
}

/** The resolution that fits a number of pixels into a print length. */
export function dpiFor(pixels: number, length: number, unit: Length): number {
    const inches = unit === "in" ? length : length / CM_PER_INCH;
    return pixels / inches;
}

export function megapixels(width: number, height: number): number {
    return (width * height) / 1_000_000;
}

export interface Paper {
    id: string;
    widthCm: number;
    heightCm: number;
}

export const PAPERS: Paper[] = [
    { id: "A4", widthCm: 21, heightCm: 29.7 },
    { id: "A5", widthCm: 14.8, heightCm: 21 },
    { id: "A3", widthCm: 29.7, heightCm: 42 },
    { id: "10×15", widthCm: 10, heightCm: 15 },
    { id: "13×18", widthCm: 13, heightCm: 18 },
];
