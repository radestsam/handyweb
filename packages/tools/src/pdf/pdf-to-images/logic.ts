import { safeFileName } from "@handyweb/core/files";
import { ToolFailure } from "@handyweb/core/runtime";

/** The largest PDF file, in bytes. */
export const MAX_FILE_BYTES = 100_000_000;
/** The largest number of pages in one run. */
export const MAX_PAGES = 100;
/** The resolutions that the tool offers, in dots per inch. */
export const DPI_OPTIONS = [72, 150, 300] as const;
export type Dpi = (typeof DPI_OPTIONS)[number];

/** Limits of a canvas in every browser (Safari on iOS is the smallest). */
const MAX_CANVAS_PIXELS = 16_777_216;
const MAX_SIDE = 16_384;

const faDigits = (value: number) => new Intl.NumberFormat("fa-IR").format(value);

const badRange = () =>
    new ToolFailure("invalid-input", {
        fa: "فهرست برگه‌ها درست نیست. برای نمونه بنویسید: 1-3, 5, 8-",
        en: "The page list is not valid. For example, write: 1-3, 5, 8-",
    });

/**
 * Reads a page list such as "1-3, 5, 8-" (8 to the end) or "-4" (1 to 4).
 * An empty list means all pages. Persian and Arabic digits are accepted. The
 * result is sorted and has no duplicates.
 */
export function parsePages(text: string, count: number): number[] {
    const normalized = text
        .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
        .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
        .replace(/[،؛]/g, ",")
        .replace(/[–—]/g, "-")
        .trim();
    if (normalized === "") return Array.from({ length: count }, (_, i) => i + 1);
    const pages = new Set<number>();
    for (const part of normalized.split(",")) {
        const item = part.trim();
        if (item === "") continue;
        const match = /^(\d*)\s*(-?)\s*(\d*)$/.exec(item);
        if (!match || (match[1] === "" && match[3] === "")) throw badRange();
        const [, a = "", dash, b = ""] = match;
        const from = a === "" ? 1 : Number(a);
        const to = dash ? (b === "" ? count : Number(b)) : from;
        if (from < 1 || to > count || from > to)
            throw new ToolFailure("invalid-input", {
                fa: `این PDF ${faDigits(count)} برگه دارد. شماره برگه‌ها باید از ۱ تا ${faDigits(count)} باشد.`,
                en: `This PDF has ${count} pages. Page numbers must be from 1 to ${count}.`,
            });
        for (let page = from; page <= to; page++) pages.add(page);
    }
    if (pages.size === 0) throw badRange();
    return [...pages].sort((x, y) => x - y);
}

/**
 * The scale for pdf.js (1 = 72 dpi) at the chosen resolution. A page that
 * would be larger than a canvas can be is scaled down to the largest size
 * that fits.
 */
export function renderScale(widthPt: number, heightPt: number, dpi: number): number {
    let scale = dpi / 72;
    const side = Math.max(widthPt, heightPt) * scale;
    if (side > MAX_SIDE) scale *= MAX_SIDE / side;
    const area = widthPt * heightPt * scale * scale;
    if (area > MAX_CANVAS_PIXELS) scale *= Math.sqrt(MAX_CANVAS_PIXELS / area);
    return scale;
}

/** The name of one page image: "report-page-03.png". The number has as many digits as the last page. */
export function pageName(source: string, page: number, count: number, ext: "png" | "jpg"): string {
    const base = source.replace(/\.pdf$/i, "") || "document";
    const digits = String(count).length;
    return safeFileName(`${base}-page-${String(page).padStart(digits, "0")}.${ext}`);
}

/** The name of the ZIP file with all page images. */
export function zipName(source: string): string {
    const base = source.replace(/\.pdf$/i, "") || "document";
    return safeFileName(`${base}-pages.zip`);
}
