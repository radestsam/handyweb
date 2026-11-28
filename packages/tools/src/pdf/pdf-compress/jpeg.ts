import { drawScaled, MAX_CANVAS_PIXELS } from "@handyweb/core/image";
import type { Recompress } from "./logic";

/**
 * Encodes a JPEG of the PDF again with the browser: it decodes the image,
 * scales it down to the longest side of the level, and writes a JPEG at the
 * quality of the level. EXIF data in the image is not applied, because PDF
 * readers do not apply it. Returns null when the browser cannot do this.
 */
export const recompressJpeg: Recompress = async (image, target) => {
    let bitmap: ImageBitmap;
    try {
        bitmap = await createImageBitmap(
            new Blob([image.bytes as Uint8Array<ArrayBuffer>], { type: "image/jpeg" }),
            { imageOrientation: "none" },
        );
    } catch {
        return null;
    }
    try {
        // A size that does not match the PDF means the decode went wrong.
        if (bitmap.width !== image.width || bitmap.height !== image.height) return null;
        let scale = Math.min(1, target.maxSide / Math.max(image.width, image.height));
        const area = image.width * image.height * scale * scale;
        if (area > MAX_CANVAS_PIXELS) scale *= Math.sqrt(MAX_CANVAS_PIXELS / area);
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if (!context) return null;
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
        context.imageSmoothingQuality = "high";
        drawScaled(context, bitmap, width, height);
        const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, "image/jpeg", target.quality),
        );
        canvas.width = 0;
        canvas.height = 0;
        if (!blob || blob.type !== "image/jpeg") return null;
        return { bytes: new Uint8Array(await blob.arrayBuffer()), width, height };
    } finally {
        bitmap.close();
    }
};
