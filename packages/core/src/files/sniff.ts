/**
 * Detects a file type from its first bytes (magic numbers). Do not trust the
 * file name or the MIME type that the browser reports (plan section 10.1).
 */
export type SniffedType =
    "png" | "jpeg" | "gif" | "webp" | "bmp" | "ico" | "pdf" | "zip" | "gzip" | "wasm" | "unknown";

const ascii = (bytes: Uint8Array, offset: number, text: string) =>
    [...text].every((char, i) => bytes[offset + i] === char.charCodeAt(0));

const starts = (bytes: Uint8Array, signature: number[]) =>
    signature.every((byte, i) => bytes[i] === byte);

/** Needs at least the first 16 bytes of the file. */
export function sniffBytes(bytes: Uint8Array): SniffedType {
    if (starts(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
    if (starts(bytes, [0xff, 0xd8, 0xff])) return "jpeg";
    if (ascii(bytes, 0, "GIF87a") || ascii(bytes, 0, "GIF89a")) return "gif";
    if (ascii(bytes, 0, "RIFF") && ascii(bytes, 8, "WEBP")) return "webp";
    if (ascii(bytes, 0, "BM")) return "bmp";
    if (starts(bytes, [0x00, 0x00, 0x01, 0x00])) return "ico";
    if (ascii(bytes, 0, "%PDF-")) return "pdf";
    if (starts(bytes, [0x50, 0x4b, 0x03, 0x04])) return "zip";
    if (starts(bytes, [0x1f, 0x8b])) return "gzip";
    if (starts(bytes, [0x00, 0x61, 0x73, 0x6d])) return "wasm";
    return "unknown";
}

/** Reads the first bytes of a Blob and detects its type. */
export async function sniffFile(file: Blob): Promise<SniffedType> {
    const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
    return sniffBytes(head);
}
