import { sniffBytes, type SniffedType } from "../files/sniff";

/*
 * Reads the pixel size of an image from its header, before the browser
 * decodes it. A decode needs about width x height x 4 bytes of memory, so the
 * size must be checked first (plan section 6.6).
 */

export type ImageFormat = "png" | "jpeg" | "gif" | "webp" | "bmp";

export interface ImageHeader {
    format: ImageFormat;
    width: number;
    height: number;
    /** EXIF orientation of a JPEG, 1 to 8. 1 is upright. */
    orientation: number;
}

/** The number of bytes that readImageHeader needs at most. */
export const HEADER_BYTES = 256 * 1024;

const u16be = (b: Uint8Array, i: number) => ((b[i] as number) << 8) | (b[i + 1] as number);
const u16le = (b: Uint8Array, i: number) => (b[i] as number) | ((b[i + 1] as number) << 8);
const u24le = (b: Uint8Array, i: number) => u16le(b, i) | ((b[i + 2] as number) << 16);
const u32be = (b: Uint8Array, i: number) => u16be(b, i) * 0x10000 + u16be(b, i + 2);
const i32le = (b: Uint8Array, i: number) => u16le(b, i) | (u16le(b, i + 2) << 16);

/** Reads the EXIF orientation from an APP1 segment, or returns 1. */
function exifOrientation(b: Uint8Array, start: number, end: number): number {
    // "Exif\0\0", then a TIFF header.
    if (start + 14 > end || String.fromCharCode(...b.subarray(start, start + 4)) !== "Exif")
        return 1;
    const tiff = start + 6;
    const little = b[tiff] === 0x49;
    const u16 = (i: number) => (little ? u16le(b, i) : u16be(b, i));
    const u32 = (i: number) => (little ? u16le(b, i) + u16le(b, i + 2) * 0x10000 : u32be(b, i));
    const ifd = tiff + u32(tiff + 4);
    if (ifd + 2 > end) return 1;
    const count = u16(ifd);
    for (let n = 0; n < count; n++) {
        const entry = ifd + 2 + n * 12;
        if (entry + 12 > end) break;
        if (u16(entry) === 0x0112) {
            const value = u16(entry + 8);
            return value >= 1 && value <= 8 ? value : 1;
        }
    }
    return 1;
}

function jpeg(b: Uint8Array): Omit<ImageHeader, "format"> | null {
    let orientation = 1;
    let seenExif = false;
    let i = 2;
    while (i + 9 < b.length) {
        if (b[i] !== 0xff) return null;
        const marker = b[i + 1] as number;
        if (marker === 0xff) {
            i++;
            continue;
        }
        const length = u16be(b, i + 2);
        // Only the first EXIF segment counts. A later APP1 can be XMP or a second EXIF block.
        if (marker === 0xe1 && !seenExif && b[i + 4] === 0x45) {
            seenExif = true;
            orientation = exifOrientation(b, i + 4, Math.min(b.length, i + 2 + length));
        }
        // SOF0 to SOF15, except DHT (C4), JPG (C8), and DAC (CC).
        if (
            marker >= 0xc0 &&
            marker <= 0xcf &&
            marker !== 0xc4 &&
            marker !== 0xc8 &&
            marker !== 0xcc
        ) {
            return { height: u16be(b, i + 5), width: u16be(b, i + 7), orientation };
        }
        i += 2 + length;
    }
    return null;
}

function webp(b: Uint8Array): Omit<ImageHeader, "format"> | null {
    const chunk = String.fromCharCode(...b.subarray(12, 16));
    if (chunk === "VP8X")
        return { width: u24le(b, 24) + 1, height: u24le(b, 27) + 1, orientation: 1 };
    if (chunk === "VP8L") {
        const bits = u16le(b, 21) | (u16le(b, 23) << 16);
        return { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1, orientation: 1 };
    }
    if (chunk === "VP8 ")
        return { width: u16le(b, 26) & 0x3fff, height: u16le(b, 28) & 0x3fff, orientation: 1 };
    return null;
}

/** Reads the format, size, and orientation, or returns null for other data. */
export function readImageHeader(bytes: Uint8Array): ImageHeader | null {
    const type: SniffedType = sniffBytes(bytes);
    let size: Omit<ImageHeader, "format"> | null = null;
    if (type === "png" && bytes.length >= 24)
        size = { width: u32be(bytes, 16), height: u32be(bytes, 20), orientation: 1 };
    else if (type === "gif" && bytes.length >= 10)
        size = { width: u16le(bytes, 6), height: u16le(bytes, 8), orientation: 1 };
    else if (type === "bmp" && bytes.length >= 26)
        size = {
            width: Math.abs(i32le(bytes, 18)),
            height: Math.abs(i32le(bytes, 22)),
            orientation: 1,
        };
    else if (type === "webp" && bytes.length >= 30) size = webp(bytes);
    else if (type === "jpeg") size = jpeg(bytes);
    if (!size || size.width <= 0 || size.height <= 0) return null;
    return { format: type as ImageFormat, ...size };
}

/** Width and height as shown, after the EXIF orientation (5 to 8 turn the image). */
export function displaySize(header: ImageHeader): { width: number; height: number } {
    return header.orientation >= 5
        ? { width: header.height, height: header.width }
        : { width: header.width, height: header.height };
}
