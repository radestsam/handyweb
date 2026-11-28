import { ToolFailure } from "@handyweb/core/runtime";

/** Colors of the watermark text. */
export const COLORS = {
    gray: "#6b7280",
    red: "#dc2626",
    blue: "#2563eb",
} as const;
export type ColorName = keyof typeof COLORS;

const FONT_PX = 160;
const MAX_WIDTH = 4096;

/** True when the first letter with a direction is right-to-left (Persian, Arabic, Hebrew). */
function isRtl(text: string): boolean {
    const match = /[\p{Script=Arabic}\p{Script=Hebrew}]|[A-Za-z\p{Script=Latin}]/u.exec(text);
    return match !== null && /[\p{Script=Arabic}\p{Script=Hebrew}]/u.test(match[0]);
}

/**
 * Draws the text in bold with the site font and returns a PNG with a clear
 * background. The browser shapes the text, so Persian letters join correctly.
 */
export async function renderTextImage(
    text: string,
    color: ColorName,
): Promise<{ png: Uint8Array; width: number; height: number }> {
    const family = getComputedStyle(document.body).fontFamily || "sans-serif";
    let size = FONT_PX;
    let font = `700 ${size}px ${family}`;
    // The site fonts load on demand. Wait for the letters of this text.
    await document.fonts.load(font, text).catch(() => []);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context)
        throw new ToolFailure("unsupported", {
            fa: "مرورگر Canvas ندارد.",
            en: "The browser has no canvas.",
        });
    const measure = () => {
        context.font = font;
        context.direction = isRtl(text) ? "rtl" : "ltr";
        return context.measureText(text);
    };
    let metrics = measure();
    if (metrics.width > MAX_WIDTH - size) {
        size = Math.floor((size * (MAX_WIDTH - size)) / metrics.width);
        font = `700 ${size}px ${family}`;
        metrics = measure();
    }
    const pad = Math.ceil(size * 0.15);
    const ascent = Math.ceil(metrics.actualBoundingBoxAscent || size * 0.8);
    const descent = Math.ceil(metrics.actualBoundingBoxDescent || size * 0.3);
    canvas.width = Math.max(1, Math.ceil(metrics.width) + 2 * pad);
    canvas.height = Math.max(1, ascent + descent + 2 * pad);
    // Changing the canvas size resets the context, so set the text style again.
    measure();
    context.fillStyle = COLORS[color];
    context.textAlign = "center";
    context.textBaseline = "alphabetic";
    context.fillText(text, canvas.width / 2, pad + ascent);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    const size2d = { width: canvas.width, height: canvas.height };
    canvas.width = 0;
    canvas.height = 0;
    if (!blob)
        throw new ToolFailure("unsupported", {
            fa: "ساخت تصویر واترمارک نشد.",
            en: "The watermark image could not be made.",
        });
    return { png: new Uint8Array(await blob.arrayBuffer()), ...size2d };
}
