import {
    decodeImage,
    HEADER_BYTES,
    MAX_SOURCE_PIXELS,
    readImageHeader,
    renderToBlob,
} from "@handyweb/core/image";
import { ToolFailure } from "@handyweb/core/runtime";
import type { PdfImage } from "./logic";

/**
 * Turns an image file into bytes that a PDF can hold. An upright JPEG and a
 * PNG are kept as they are. A JPEG with an EXIF turn is drawn upright and
 * saved as JPEG again. WebP, GIF (first frame), and BMP are saved as PNG, so
 * they lose no detail. The type comes from the bytes, not from the file name.
 */
export async function prepareImage(file: File): Promise<PdfImage> {
    const head = new Uint8Array(await file.slice(0, HEADER_BYTES).arrayBuffer());
    const header = readImageHeader(head);
    if (!header)
        throw new ToolFailure("unsupported", {
            fa: "این فایل تصویر PNG، JPEG، WebP، GIF یا BMP نیست.",
            en: "This file is not a PNG, JPEG, WebP, GIF, or BMP image.",
        });
    if (header.width * header.height > MAX_SOURCE_PIXELS)
        throw new ToolFailure("too-large", {
            fa: `این تصویر (${header.width}×${header.height}) بیش از ۵۰ مگاپیکسل است.`,
            en: `This image (${header.width}×${header.height}) is larger than 50 megapixels.`,
        });
    if (header.format === "png" || (header.format === "jpeg" && header.orientation === 1)) {
        return {
            kind: header.format,
            bytes: new Uint8Array(await file.arrayBuffer()),
            width: header.width,
            height: header.height,
        };
    }
    const image = await decodeImage(file);
    try {
        const type = header.format === "jpeg" ? "image/jpeg" : "image/png";
        const blob = await renderToBlob(
            image.width,
            image.height,
            (context) => context.drawImage(image.bitmap, 0, 0),
            type,
            0.95,
        );
        return {
            kind: type === "image/jpeg" ? "jpeg" : "png",
            bytes: new Uint8Array(await blob.arrayBuffer()),
            width: image.width,
            height: image.height,
        };
    } finally {
        image.bitmap.close();
    }
}
