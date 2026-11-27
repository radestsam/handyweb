import { sniffBytes, type SniffedType } from "@handyweb/core/files";
import { ToolFailure } from "@handyweb/core/runtime";
import { base64ToBytes, bytesToBase64 } from "../base64/logic";

export const MAX_FILE_BYTES = 10_000_000;

const MIME: Record<Exclude<SniffedType, "unknown">, string> = {
    png: "image/png",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    bmp: "image/bmp",
    ico: "image/x-icon",
    pdf: "application/pdf",
    zip: "application/zip",
    gzip: "application/gzip",
    wasm: "application/wasm",
};
const EXTENSIONS: Record<Exclude<SniffedType, "unknown">, string> = {
    png: "png",
    jpeg: "jpg",
    gif: "gif",
    webp: "webp",
    bmp: "bmp",
    ico: "ico",
    pdf: "pdf",
    zip: "zip",
    gzip: "gz",
    wasm: "wasm",
};

export interface EncodedFile {
    base64: string;
    dataUri: string;
    mime: string;
}

/**
 * Encodes file bytes as Base64. The MIME type comes from the first bytes of
 * the file when they are known, else from the browser, else
 * application/octet-stream.
 */
export function encodeFile(bytes: Uint8Array, reportedType: string): EncodedFile {
    const sniffed = sniffBytes(bytes);
    const mime = sniffed !== "unknown" ? MIME[sniffed] : reportedType || "application/octet-stream";
    const base64 = bytesToBase64(bytes, { urlSafe: false, padding: true });
    return { base64, dataUri: `data:${mime};base64,${base64}`, mime };
}

export interface DecodedFile {
    bytes: Uint8Array;
    /** The MIME type of the Data URI, or the detected type, or application/octet-stream. */
    mime: string;
    /** A file name with an extension from the detected type. */
    fileName: string;
}

/** Reads Base64 or a Data URI (data:…;base64,…) into file bytes. */
export function decodeFile(input: string): DecodedFile {
    const text = input.trim();
    let declared: string | null = null;
    let body = text;
    const uri = /^data:([^;,]*)((?:;[^;,]*)*),(.*)$/s.exec(text);
    if (uri) {
        declared = uri[1] || null;
        if (!/;base64/i.test(uri[2] ?? "")) {
            throw new ToolFailure(
                "invalid-input",
                {
                    fa: "این Data URI به شکل Base64 نیست.",
                    en: "This Data URI is not Base64-encoded.",
                },
                "not base64",
            );
        }
        body = uri[3] ?? "";
    }
    const bytes = base64ToBytes(body);
    if (bytes.length > MAX_FILE_BYTES) {
        throw new ToolFailure(
            "too-large",
            { fa: "فایل بیش از ۱۰ مگابایت است.", en: "The file is larger than 10 MB." },
            "size",
        );
    }
    const sniffed = sniffBytes(bytes);
    const mime = declared ?? (sniffed !== "unknown" ? MIME[sniffed] : "application/octet-stream");
    const extension = sniffed !== "unknown" ? EXTENSIONS[sniffed] : "bin";
    return { bytes, mime, fileName: `file.${extension}` };
}
