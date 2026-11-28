import { ToolFailure } from "@handyweb/core/runtime";
import { NAMED_COLORS } from "./names";

/** A color in sRGB. r, g, b are 0 to 255; alpha is 0 to 1. */
export interface Rgba {
    r: number;
    g: number;
    b: number;
    a: number;
}

function fail(): ToolFailure {
    return new ToolFailure(
        "invalid-input",
        {
            fa: "این رنگ شناخته نشد. نمونه‌ها: #bc4a3c، rgb(188 74 60)، hsl(6 52% 49%)، tomato",
            en: "This color is not known. Examples: #bc4a3c, rgb(188 74 60), hsl(6 52% 49%), tomato",
        },
        "format",
    );
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function channel(text: string, max: number): number {
    const value = text.endsWith("%") ? (parseFloat(text) / 100) * max : parseFloat(text);
    if (Number.isNaN(value)) throw fail();
    return clamp(value, 0, max);
}

function alpha(text: string | undefined): number {
    if (text === undefined) return 1;
    const value = text.endsWith("%") ? parseFloat(text) / 100 : parseFloat(text);
    if (Number.isNaN(value)) throw fail();
    return clamp(value, 0, 1);
}

function hue(text: string): number {
    const value = parseFloat(text);
    if (Number.isNaN(value)) throw fail();
    const degrees = text.endsWith("turn")
        ? value * 360
        : text.endsWith("rad")
          ? (value * 180) / Math.PI
          : value;
    return ((degrees % 360) + 360) % 360;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return [f(0) * 255, f(8) * 255, f(4) * 255];
}

/** The arguments of a CSS function, with commas or spaces and an optional "/ alpha". */
function args(body: string): { parts: string[]; alpha: string | undefined } {
    const [main = "", slash] = body.split("/");
    const parts = main
        .trim()
        .split(/[\s,]+/)
        .filter(Boolean);
    let a = slash?.trim();
    if (a === undefined && parts.length === 4) a = parts.pop();
    return { parts, alpha: a };
}

/** Reads hex (3, 4, 6, or 8 digits), rgb(), hsl(), hwb(), and CSS color names. */
export function parseColor(input: string): Rgba {
    const text = input.trim().toLowerCase();
    const named = NAMED_COLORS[text];
    if (named) return parseColor(named);
    if (text === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
    const hex = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(text)?.[1];
    if (hex) {
        const full = hex.length <= 4 ? [...hex].map((c) => c + c).join("") : hex;
        const n = (i: number) => parseInt(full.slice(i, i + 2), 16);
        return { r: n(0), g: n(2), b: n(4), a: full.length === 8 ? n(6) / 255 : 1 };
    }
    const fn = /^(rgba?|hsla?|hwb)\((.*)\)$/.exec(text);
    if (!fn) throw fail();
    const { parts, alpha: a } = args(fn[2] as string);
    if (parts.length !== 3) throw fail();
    const [p0, p1, p2] = parts as [string, string, string];
    if (fn[1]?.startsWith("rgb"))
        return { r: channel(p0, 255), g: channel(p1, 255), b: channel(p2, 255), a: alpha(a) };
    const h = hue(p0);
    const x = channel(p1.endsWith("%") ? p1 : `${p1}%`, 1);
    const y = channel(p2.endsWith("%") ? p2 : `${p2}%`, 1);
    if (fn[1] === "hwb") {
        const total = x + y;
        const [w, bl] = total > 1 ? [x / total, y / total] : [x, y];
        const [r, g, b] = hslToRgb(h, 1, 0.5).map((c) => (c / 255) * (1 - w - bl) + w) as [
            number,
            number,
            number,
        ];
        return { r: r * 255, g: g * 255, b: b * 255, a: alpha(a) };
    }
    const [r, g, b] = hslToRgb(h, x, y);
    return { r, g, b, a: alpha(a) };
}

const round = (value: number, digits = 0) => {
    const f = 10 ** digits;
    return Math.round(value * f) / f;
};

function toHsl({ r, g, b }: Rgba): [number, number, number] {
    const [rr, gg, bb] = [r / 255, g / 255, b / 255];
    const max = Math.max(rr, gg, bb);
    const min = Math.min(rr, gg, bb);
    const l = (max + min) / 2;
    const d = max - min;
    if (d === 0) return [0, 0, l];
    const s = d / (1 - Math.abs(2 * l - 1));
    const h = max === rr ? ((gg - bb) / d) % 6 : max === gg ? (bb - rr) / d + 2 : (rr - gg) / d + 4;
    return [(h * 60 + 360) % 360, s, l];
}

function linear(c: number): number {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

/** sRGB to OKLCH (Björn Ottosson's OKLab). */
function toOklch({ r, g, b }: Rgba): [number, number, number] {
    const [lr, lg, lb] = [linear(r), linear(g), linear(b)];
    const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
    const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
    const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
    const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
    const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
    const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
    const C = Math.sqrt(A * A + B * B);
    const H = C < 0.0001 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
    return [L, C, H];
}

export interface ColorFormats {
    hex: string;
    rgb: string;
    hsl: string;
    hwb: string;
    oklch: string;
    cmyk: string;
}

export function formatColor(color: Rgba): ColorFormats {
    const r = Math.round(color.r);
    const g = Math.round(color.g);
    const b = Math.round(color.b);
    const a = round(color.a, 2);
    const slash = a < 1 ? ` / ${a}` : "";
    const h2 = (n: number) => n.toString(16).padStart(2, "0");
    const hex = `#${h2(r)}${h2(g)}${h2(b)}${a < 1 ? h2(Math.round(color.a * 255)) : ""}`;
    const [h, s, l] = toHsl({ r, g, b, a });
    const white = Math.min(r, g, b) / 255;
    const black = 1 - Math.max(r, g, b) / 255;
    const [L, C, H] = toOklch({ r, g, b, a });
    const k = black;
    const cmy = (c: number) => (k === 1 ? 0 : round(((1 - c / 255 - k) / (1 - k)) * 100));
    return {
        hex,
        rgb: `rgb(${r} ${g} ${b}${slash})`,
        hsl: `hsl(${round(h)} ${round(s * 100)}% ${round(l * 100)}%${slash})`,
        hwb: `hwb(${round(h)} ${round(white * 100)}% ${round(black * 100)}%${slash})`,
        oklch: `oklch(${round(L * 100, 1)}% ${round(C, 3)} ${round(H, 1)}${slash})`,
        cmyk: `cmyk(${cmy(r)}% ${cmy(g)}% ${cmy(b)}% ${round(k * 100)}%)`,
    };
}

/** WCAG 2 relative luminance and contrast ratio. */
export function contrastRatio(a: Rgba, b: Rgba): number {
    const lum = (c: Rgba) => 0.2126 * linear(c.r) + 0.7152 * linear(c.g) + 0.0722 * linear(c.b);
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x) as [number, number];
    return (hi + 0.05) / (lo + 0.05);
}
