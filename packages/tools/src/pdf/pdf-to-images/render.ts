import { ToolFailure } from "@handyweb/core/runtime";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { renderScale } from "./logic";

/**
 * Draws one page on a canvas at the chosen resolution and encodes it. The page
 * gets a white background, so a JPEG has no black areas. The browser writes no
 * metadata into the image.
 */
export async function renderPage(
    pdf: PDFDocumentProxy,
    pageNumber: number,
    dpi: number,
    type: "image/png" | "image/jpeg",
): Promise<{ blob: Blob; width: number; height: number; scaled: boolean }> {
    const page = await pdf.getPage(pageNumber);
    try {
        const base = page.getViewport({ scale: 1 });
        const scale = renderScale(base.width, base.height, dpi);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.floor(viewport.width));
        canvas.height = Math.max(1, Math.floor(viewport.height));
        const context = canvas.getContext("2d");
        if (!context)
            throw new ToolFailure("unsupported", {
                fa: "مرورگر Canvas ندارد.",
                en: "The browser has no canvas.",
            });
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvas, viewport }).promise;
        const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, type, 0.92),
        );
        const size = { width: canvas.width, height: canvas.height };
        canvas.width = 0;
        canvas.height = 0;
        if (!blob)
            throw new ToolFailure("unsupported", {
                fa: "ساخت تصویر نشد. شاید برگه برای این مرورگر بیش از اندازه بزرگ است.",
                en: "The image could not be made. The page may be too large for this browser.",
            });
        return { blob, ...size, scaled: scale < dpi / 72 - 1e-9 };
    } finally {
        page.cleanup();
    }
}
