import { safeFileName } from "@handyweb/core/files";
import { ToolFailure } from "@handyweb/core/runtime";

/** The largest number of images in one PDF. */
export const MAX_IMAGES = 100;
/** The largest size of one image file, in bytes. */
export const MAX_FILE_BYTES = 50_000_000;
/** The largest size of all images together, in bytes. */
export const MAX_TOTAL_BYTES = 200_000_000;

/** PDF points per CSS pixel (72 points per inch, 96 pixels per inch). */
const POINTS_PER_PIXEL = 72 / 96;

export type PageSize = "fit" | "a4" | "letter";
export type Margin = "none" | "small" | "large";

/** Page sizes in points, portrait. */
const PAGES: Record<Exclude<PageSize, "fit">, [number, number]> = {
    a4: [595.28, 841.89],
    letter: [612, 792],
};

/** Margins in points: none, about 10 mm, about 20 mm. */
const MARGINS: Record<Margin, number> = { none: 0, small: 28.35, large: 56.69 };

/** An image that a PDF can hold as it is: JPEG or PNG bytes and the pixel size. */
export interface PdfImage {
    kind: "jpeg" | "png";
    bytes: Uint8Array;
    width: number;
    height: number;
}

export interface Placement {
    pageWidth: number;
    pageHeight: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Where an image goes on its page. With "fit", the page has the size of the
 * image (at 96 pixels per inch) plus the margins. With a paper size, the page
 * turns to landscape for a wide image, and the image is scaled to fit inside
 * the margins and centered. The image keeps its aspect ratio.
 */
export function placeImage(
    width: number,
    height: number,
    size: PageSize,
    margin: Margin,
): Placement {
    const edge = MARGINS[margin];
    if (size === "fit") {
        const w = width * POINTS_PER_PIXEL;
        const h = height * POINTS_PER_PIXEL;
        return {
            pageWidth: w + 2 * edge,
            pageHeight: h + 2 * edge,
            x: edge,
            y: edge,
            width: w,
            height: h,
        };
    }
    const [short, long] = PAGES[size];
    const landscape = width > height;
    const pageWidth = landscape ? long : short;
    const pageHeight = landscape ? short : long;
    const scale = Math.min((pageWidth - 2 * edge) / width, (pageHeight - 2 * edge) / height);
    const w = width * scale;
    const h = height * scale;
    return {
        pageWidth,
        pageHeight,
        x: (pageWidth - w) / 2,
        y: (pageHeight - h) / 2,
        width: w,
        height: h,
    };
}

/**
 * Makes a PDF with one image on each page, in the order of the list. JPEG and
 * PNG bytes go into the PDF as they are, so the quality does not change. The
 * PDF gets no metadata and no "producer" field.
 */
export async function imagesToPdf(
    images: readonly PdfImage[],
    size: PageSize,
    margin: Margin,
    onProgress?: (done: number) => void,
): Promise<{ bytes: Uint8Array; pages: number }> {
    if (images.length === 0)
        throw new ToolFailure("invalid-input", {
            fa: "دست‌کم یک تصویر برگزینید.",
            en: "Choose at least one image.",
        });
    if (images.length > MAX_IMAGES)
        throw new ToolFailure("too-large", {
            fa: `بیشینه ${MAX_IMAGES} تصویر را می‌توان در یک PDF گذاشت.`,
            en: `A PDF can hold up to ${MAX_IMAGES} images.`,
        });
    const { PDFDocument } = await import("@cantoo/pdf-lib");
    const pdf = await PDFDocument.create({ updateMetadata: false });
    for (const [index, image] of images.entries()) {
        let embedded;
        try {
            embedded =
                image.kind === "jpeg"
                    ? await pdf.embedJpg(image.bytes)
                    : await pdf.embedPng(image.bytes);
        } catch {
            throw new ToolFailure(
                "invalid-input",
                {
                    fa: `تصویر ${index + 1} خوانده نشد. شاید فایل آسیب دیده است.`,
                    en: `Image ${index + 1} could not be read. The file may be damaged.`,
                },
                "embed",
            );
        }
        const place = placeImage(image.width, image.height, size, margin);
        const page = pdf.addPage([place.pageWidth, place.pageHeight]);
        page.drawImage(embedded, {
            x: place.x,
            y: place.y,
            width: place.width,
            height: place.height,
        });
        onProgress?.(index + 1);
    }
    return { bytes: await pdf.save(), pages: pdf.getPageCount() };
}

/** The name of the PDF, made from the name of the first image. */
export function pdfName(first: string | undefined): string {
    const base = (first ?? "").replace(/\.[^.]+$/, "") || "images";
    return safeFileName(`${base}.pdf`);
}
