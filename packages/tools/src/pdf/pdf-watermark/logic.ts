import { safeFileName } from "@handyweb/core/files";
import { ToolFailure } from "@handyweb/core/runtime";
import { openPdf, pdfLib } from "../shared/pdflib";

/** The largest PDF file, in bytes. */
export const MAX_FILE_BYTES = 100_000_000;
/** The longest watermark text, in characters. */
export const MAX_TEXT = 100;

export type Layout = "center" | "tiled";
export type Size = "small" | "medium" | "large";

export interface WatermarkOptions {
    layout: Layout;
    size: Size;
    /** Turn in degrees, counterclockwise. */
    angle: number;
    /** 0 to 1. */
    opacity: number;
}

/** One copy of the watermark image on a page, in PDF points. */
export interface Stamp {
    x: number;
    y: number;
    width: number;
    height: number;
    /** Degrees, counterclockwise, around the point (x, y). */
    rotate: number;
}

/** The width of one stamp as a part of the page size it runs along. */
const WIDTH: Record<Layout, Record<Size, number>> = {
    center: { small: 0.45, medium: 0.65, large: 0.85 },
    tiled: { small: 0.2, medium: 0.28, large: 0.36 },
};

/**
 * pdf-lib turns an image around its lower-left corner. This finds the corner
 * that puts the center of the turned image on (cx, cy).
 */
function centered(cx: number, cy: number, width: number, height: number, angle: number): Stamp {
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return {
        x: cx - ((width / 2) * cos - (height / 2) * sin),
        y: cy - ((width / 2) * sin + (height / 2) * cos),
        width,
        height,
        rotate: angle,
    };
}

/**
 * Where the watermark goes on one page. `pageRotation` is the /Rotate value of
 * the page: the watermark turns with it, so it looks the same on every page.
 * In the center layout, the length of the text follows the page diagonal for
 * a turned watermark and the page width for a straight one.
 */
export function placeStamps(
    pageWidth: number,
    pageHeight: number,
    pageRotation: number,
    imageWidth: number,
    imageHeight: number,
    options: Pick<WatermarkOptions, "layout" | "size" | "angle">,
): Stamp[] {
    const quarter = ((((pageRotation % 360) + 360) % 360) / 90) % 2 === 1;
    const shownWidth = quarter ? pageHeight : pageWidth;
    const shownHeight = quarter ? pageWidth : pageHeight;
    const angle = options.angle + pageRotation;
    const ratio = imageHeight / imageWidth;
    const along = options.angle % 180 === 0 ? shownWidth : Math.hypot(shownWidth, shownHeight);
    if (options.layout === "center") {
        let width = WIDTH.center[options.size] * along;
        // A long text on a straight watermark must not get taller than the page.
        width = Math.min(width, (shownHeight * 0.8) / ratio);
        return [centered(pageWidth / 2, pageHeight / 2, width, width * ratio, angle)];
    }
    const width = WIDTH.tiled[options.size] * shownWidth;
    const height = width * ratio;
    const stepX = width * 1.5;
    const stepY = Math.max(height * 3, width * 0.6);
    const stamps: Stamp[] = [];
    for (let row = 0, y = stepY / 2; y < pageHeight + stepY / 2; row++, y += stepY) {
        const offset = row % 2 === 0 ? 0 : stepX / 2;
        for (let x = stepX / 2 - offset; x < pageWidth + stepX / 2; x += stepX)
            stamps.push(centered(x, y, width, height, angle));
    }
    return stamps;
}

/**
 * Puts the watermark image on every page of the PDF. The image is a PNG of
 * the text, made by the browser, so every script (Persian too) is shaped
 * right. The image is stored once and used on every page.
 */
export async function addWatermark(
    bytes: Uint8Array,
    png: Uint8Array,
    options: WatermarkOptions,
    onProgress?: (done: number, total: number) => void,
): Promise<Uint8Array> {
    const lib = await pdfLib();
    const document = await openPdf(bytes);
    let image;
    try {
        image = await document.embedPng(png);
    } catch {
        throw new ToolFailure(
            "internal",
            { fa: "ساخت تصویر واترمارک نشد.", en: "The watermark image could not be made." },
            "embed",
        );
    }
    const pages = document.getPages();
    for (const [index, page] of pages.entries()) {
        const { width, height } = page.getSize();
        const stamps = placeStamps(
            width,
            height,
            page.getRotation().angle,
            image.width,
            image.height,
            options,
        );
        for (const stamp of stamps)
            page.drawImage(image, {
                x: stamp.x,
                y: stamp.y,
                width: stamp.width,
                height: stamp.height,
                rotate: lib.degrees(stamp.rotate),
                opacity: options.opacity,
            });
        onProgress?.(index + 1, pages.length);
    }
    return document.save();
}

/** The name of the output file. */
export function watermarkedName(source: string): string {
    const base = source.replace(/\.pdf$/i, "") || "document";
    return safeFileName(`${base}-watermarked.pdf`);
}
