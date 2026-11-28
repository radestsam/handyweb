import { encode } from "uqr";
import { ToolFailure } from "@handyweb/core/runtime";

/*
 * QR code generation with uqr, a port of the QR Code generator library by
 * Project Nayuki. Text is encoded as UTF-8, so Persian works. The image is
 * drawn here as SVG from the module grid.
 */

export type Ecc = "L" | "M" | "Q" | "H";
export const ECC_LEVELS: readonly Ecc[] = ["L", "M", "Q", "H"];

/** The quiet zone that the QR standard asks for, in modules. */
export const QUIET_ZONE = 4;

export interface QrMatrix {
    /** Width and height in modules, with the quiet zone. */
    size: number;
    /** QR version, 1 to 40. */
    version: number;
    /** `true` is a dark module. */
    modules: boolean[][];
}

export function makeQr(text: string, ecc: Ecc): QrMatrix {
    if (text === "")
        throw new ToolFailure(
            "invalid-input",
            { fa: "ورودی خالی است.", en: "The input is empty." },
            "empty",
        );
    try {
        const result = encode(text, { ecc, border: QUIET_ZONE });
        return { size: result.size, version: result.version, modules: result.data };
    } catch {
        throw new ToolFailure(
            "too-large",
            {
                fa: "این نوشته برای یک کد QR بلند است. آن را کوتاه کنید یا سطح بازیابی پایین‌تری برگزینید.",
                en: "This text is too long for one QR code. Make it shorter, or choose a lower error correction level.",
            },
            "data too long",
        );
    }
}

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

/**
 * Draws the grid as one SVG path, one square per dark module. The SVG has no
 * script and no external reference.
 */
export function toSvg(matrix: QrMatrix, dark: string, light: string): string {
    if (!HEX_COLOR.test(dark) || !HEX_COLOR.test(light)) throw new RangeError("color");
    let path = "";
    matrix.modules.forEach((row, y) => {
        row.forEach((on, x) => {
            if (on) path += `M${x} ${y}h1v1h-1z`;
        });
    });
    const { size } = matrix;
    return (
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">` +
        `<rect width="${size}" height="${size}" fill="${light}"/>` +
        `<path d="${path}" fill="${dark}"/></svg>`
    );
}

function luminance(hex: string): number {
    const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    const [r, g, b] = channels.map((c) =>
        c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
    ) as [number, number, number];
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two #rrggbb colors, 1 to 21. */
export function contrast(a: string, b: string): number {
    const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
    return (high + 0.05) / (low + 0.05);
}

export type ColorWarning = "low-contrast" | "inverted";

/**
 * Many QR readers need dark modules on a light background and a strong
 * contrast. This returns a warning for colors that may not scan.
 */
export function colorWarning(dark: string, light: string): ColorWarning | null {
    if (luminance(dark) > luminance(light)) return "inverted";
    if (contrast(dark, light) < 4) return "low-contrast";
    return null;
}
