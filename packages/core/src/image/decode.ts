import { ToolFailure } from "../runtime";
import { HEADER_BYTES, displaySize, readImageHeader, type ImageFormat } from "./size";

/*
 * Limits for images. A decoded image needs width x height x 4 bytes. Safari
 * on iOS refuses a canvas larger than 16,777,216 pixels (4096 x 4096), so a
 * result must stay below that. A source may be larger, up to 50 megapixels
 * (about 200 MB when decoded).
 */
export const MAX_SOURCE_PIXELS = 50_000_000;
export const MAX_CANVAS_PIXELS = 16_777_216;
export const MAX_SIDE = 16_384;

export interface DecodedImage {
    bitmap: ImageBitmap;
    format: ImageFormat;
    /** The size as shown, after the EXIF orientation. */
    width: number;
    height: number;
}

/** Fails when a result of this size cannot be drawn in every browser. */
export function checkCanvasSize(width: number, height: number): void {
    if (
        width < 1 ||
        height < 1 ||
        width > MAX_SIDE ||
        height > MAX_SIDE ||
        width * height > MAX_CANVAS_PIXELS
    ) {
        throw new ToolFailure(
            "too-large",
            {
                fa: `اندازه خروجی (${width}×${height}) بیش از اندازه است. بیشینه ۱۶.۷ مگاپیکسل و ${MAX_SIDE} پیکسل در هر سو است.`,
                en: `The output size (${width}×${height}) is too large. The maximum is 16.7 megapixels and ${MAX_SIDE} pixels per side.`,
            },
            "canvas",
        );
    }
}

/**
 * Reads the header, checks the size, and then decodes the image with the
 * browser. The type comes from the bytes, not from the file name.
 */
export async function decodeImage(file: Blob): Promise<DecodedImage> {
    const header = readImageHeader(new Uint8Array(await file.slice(0, HEADER_BYTES).arrayBuffer()));
    if (!header) {
        throw new ToolFailure(
            "unsupported",
            {
                fa: "این فایل تصویر PNG، JPEG، WebP، GIF یا BMP نیست.",
                en: "This file is not a PNG, JPEG, WebP, GIF, or BMP image.",
            },
            "not an image",
        );
    }
    if (header.width * header.height > MAX_SOURCE_PIXELS) {
        throw new ToolFailure(
            "too-large",
            {
                fa: `این تصویر (${header.width}×${header.height}) بیش از ۵۰ مگاپیکسل است و ممکن است مرورگر را از کار بیندازد.`,
                en: `This image (${header.width}×${header.height}) is larger than 50 megapixels and could crash the browser.`,
            },
            "source pixels",
        );
    }
    let bitmap: ImageBitmap;
    try {
        bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
        throw new ToolFailure(
            "unsupported",
            {
                fa: "مرورگر نتوانست این تصویر را باز کند. شاید فایل آسیب دیده است.",
                en: "The browser could not open this image. The file may be damaged.",
            },
            "decode",
        );
    }
    const shown = displaySize(header);
    // Use the bitmap size: it is the truth when a browser ignores the orientation.
    return {
        bitmap,
        format: header.format,
        width: bitmap.width || shown.width,
        height: bitmap.height || shown.height,
    };
}

export type OutputType = "image/png" | "image/jpeg" | "image/webp";

/** The output type that keeps the source format when the browser can write it. */
export function defaultOutputType(format: ImageFormat): OutputType {
    if (format === "jpeg") return "image/jpeg";
    if (format === "webp") return "image/webp";
    return "image/png";
}

export const EXTENSIONS: Record<OutputType, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
};

/**
 * Draws with a function on a new canvas and encodes the result. A JPEG has no
 * transparency, so it gets a white background. The browser writes no EXIF or
 * other metadata into the result.
 */
export async function renderToBlob(
    width: number,
    height: number,
    draw: (context: CanvasRenderingContext2D) => void,
    type: OutputType,
    quality = 0.92,
): Promise<Blob> {
    checkCanvasSize(width, height);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context)
        throw new ToolFailure(
            "unsupported",
            { fa: "مرورگر Canvas ندارد.", en: "The browser has no canvas." },
            "canvas",
        );
    if (type === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
    }
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    draw(context);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
    canvas.width = 0;
    canvas.height = 0;
    if (!blob)
        throw new ToolFailure(
            "unsupported",
            { fa: "ساخت تصویر نشد.", en: "The image could not be made." },
            "encode",
        );
    // A browser that cannot write WebP writes PNG instead.
    return blob;
}

/**
 * Scales a bitmap in steps of one half until it is near the target size. One
 * large step skips pixels and gives a rough result; halving keeps detail.
 */
export function drawScaled(
    context: CanvasRenderingContext2D,
    source: CanvasImageSource & { width: number; height: number },
    width: number,
    height: number,
): void {
    let current: CanvasImageSource = source;
    let w = source.width;
    let h = source.height;
    const steps: HTMLCanvasElement[] = [];
    while (w / 2 >= width && h / 2 >= height) {
        w = Math.round(w / 2);
        h = Math.round(h / 2);
        const step = document.createElement("canvas");
        step.width = w;
        step.height = h;
        const stepContext = step.getContext("2d");
        if (!stepContext) break;
        stepContext.imageSmoothingQuality = "high";
        stepContext.drawImage(current, 0, 0, w, h);
        steps.push(step);
        current = step;
    }
    context.drawImage(current, 0, 0, width, height);
    for (const step of steps) step.width = step.height = 0;
}
