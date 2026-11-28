/*
 * Builds the files of a favicon set: an ICO file that holds PNG images (a
 * format that every current browser and Windows Vista and later read), the
 * PNG icons, a web app manifest, and the HTML to paste into <head>.
 */

export interface IconImage {
    size: number;
    png: Uint8Array;
}

/** An ICO file with PNG images inside. */
export function makeIco(images: IconImage[]): Uint8Array {
    const header = 6 + images.length * 16;
    const total = header + images.reduce((sum, image) => sum + image.png.length, 0);
    const out = new Uint8Array(total);
    const view = new DataView(out.buffer);
    view.setUint16(2, 1, true);
    view.setUint16(4, images.length, true);
    let offset = header;
    images.forEach((image, index) => {
        const entry = 6 + index * 16;
        // 0 means 256.
        out[entry] = image.size >= 256 ? 0 : image.size;
        out[entry + 1] = image.size >= 256 ? 0 : image.size;
        view.setUint16(entry + 4, 1, true);
        view.setUint16(entry + 6, 32, true);
        view.setUint32(entry + 8, image.png.length, true);
        view.setUint32(entry + 12, offset, true);
        out.set(image.png, offset);
        offset += image.png.length;
    });
    return out;
}

export interface ManifestOptions {
    name: string;
    themeColor: string;
    backgroundColor: string;
}

export function manifest(options: ManifestOptions): string {
    return `${JSON.stringify(
        {
            name: options.name,
            short_name: options.name,
            icons: [
                { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
                { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
            ],
            theme_color: options.themeColor,
            background_color: options.backgroundColor,
            display: "standalone",
        },
        null,
        2,
    )}\n`;
}

export const HTML_SNIPPET = [
    '<link rel="icon" href="/favicon.ico" sizes="48x48">',
    '<link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192">',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
    '<link rel="manifest" href="/site.webmanifest">',
].join("\n");

/** The square that the picture fits in, inside an icon of the given size with padding in percent. */
export function fitBox(
    size: number,
    width: number,
    height: number,
    padding: number,
): { x: number; y: number; width: number; height: number } {
    const inner = size * (1 - (2 * padding) / 100);
    const scale = inner / Math.max(width, height);
    const w = width * scale;
    const h = height * scale;
    return { x: (size - w) / 2, y: (size - h) / 2, width: w, height: h };
}
