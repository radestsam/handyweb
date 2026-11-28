import { ToolFailure } from "@handyweb/core/runtime";
import { safeFileName, sniffBytes } from "@handyweb/core/files";
import { orientationOnlyExif, readExif, type ExifData } from "./exif";

/*
 * Reads and removes metadata in JPEG, PNG, and WebP files without decoding the
 * pixels, so the picture keeps its exact quality. The pixel data is copied
 * byte for byte; only metadata blocks are left out.
 */

export type MetaFormat = "jpeg" | "png" | "webp";

export type BlockKind = "exif" | "xmp" | "iptc" | "comment" | "icc" | "text" | "time" | "other";

export interface Block {
    kind: BlockKind;
    bytes: number;
    /** A text block: its keyword and a short value. */
    label?: string | undefined;
}

export interface Report {
    format: MetaFormat;
    blocks: Block[];
    exif: ExifData | null;
}

export interface StripOptions {
    /** Keep the ICC color profile, so colors look the same. */
    keepIcc: boolean;
}

const ascii = (bytes: Uint8Array, at: number, length: number) =>
    String.fromCharCode(...bytes.subarray(at, at + length));

function unsupported(): ToolFailure {
    return new ToolFailure(
        "unsupported",
        {
            fa: "این ابزار فراداده JPEG، PNG و WebP را می‌خواند. این فایل هیچ‌کدام نیست.",
            en: "This tool reads metadata in JPEG, PNG, and WebP files. This file is none of them.",
        },
        "format",
    );
}

function damaged(): ToolFailure {
    return new ToolFailure(
        "invalid-input",
        { fa: "ساختار این فایل آسیب دیده است.", en: "The structure of this file is damaged." },
        "structure",
    );
}

export function detectFormat(bytes: Uint8Array): MetaFormat {
    const type = sniffBytes(bytes);
    if (type === "jpeg" || type === "png" || type === "webp") return type;
    throw unsupported();
}

// JPEG ---------------------------------------------------------------------

interface Segment {
    marker: number;
    start: number;
    end: number;
}

/** The segments before the image data (SOS), and where the image data starts. */
function jpegSegments(bytes: Uint8Array): { segments: Segment[]; scan: number } {
    const segments: Segment[] = [];
    let at = 2;
    while (at + 4 <= bytes.length) {
        if (bytes[at] !== 0xff) throw damaged();
        const marker = bytes[at + 1] as number;
        if (marker === 0xff) {
            at++;
            continue;
        }
        if (marker === 0xda) return { segments, scan: at };
        const length = ((bytes[at + 2] as number) << 8) | (bytes[at + 3] as number);
        if (length < 2 || at + 2 + length > bytes.length) throw damaged();
        segments.push({ marker, start: at, end: at + 2 + length });
        at += 2 + length;
    }
    throw damaged();
}

function jpegKind(bytes: Uint8Array, segment: Segment): BlockKind | null {
    const data = segment.start + 4;
    if (segment.marker === 0xe1) {
        if (ascii(bytes, data, 6) === "Exif\0\0") return "exif";
        if (ascii(bytes, data, 28) === "http://ns.adobe.com/xap/1.0/") return "xmp";
        return "other";
    }
    if (segment.marker === 0xe2)
        return ascii(bytes, data, 12) === "ICC_PROFILE\0" ? "icc" : "other";
    if (segment.marker === 0xed) return "iptc";
    if (segment.marker === 0xfe) return "comment";
    // APP3 to APP12 and APP15 hold maker data. APP0 (JFIF) and APP14 (Adobe color) are needed.
    if (segment.marker >= 0xe3 && segment.marker <= 0xef && segment.marker !== 0xee) return "other";
    return null;
}

function readJpeg(bytes: Uint8Array): Report {
    const { segments } = jpegSegments(bytes);
    const blocks: Block[] = [];
    let exif: ExifData | null = null;
    for (const segment of segments) {
        const kind = jpegKind(bytes, segment);
        if (!kind) continue;
        const size = segment.end - segment.start;
        if (kind === "comment") {
            blocks.push({
                kind,
                bytes: size,
                label: new TextDecoder()
                    .decode(bytes.subarray(segment.start + 4, segment.end))
                    .slice(0, 200),
            });
        } else blocks.push({ kind, bytes: size });
        if (kind === "exif" && !exif)
            exif = readExif(bytes.subarray(segment.start + 10, segment.end));
    }
    return { format: "jpeg", blocks, exif };
}

function stripJpeg(bytes: Uint8Array, options: StripOptions, orientation: number): Uint8Array {
    const { segments, scan } = jpegSegments(bytes);
    const kept = segments.filter((segment) => {
        const kind = jpegKind(bytes, segment);
        return kind === null || (kind === "icc" && options.keepIcc);
    });
    const parts: Uint8Array[] = [bytes.subarray(0, 2)];
    // JFIF (APP0) stays first. A turned photo then gets one tag, the
    // orientation, so it still shows upright.
    let rest = kept;
    if (kept[0]?.marker === 0xe0) {
        parts.push(bytes.subarray(kept[0].start, kept[0].end));
        rest = kept.slice(1);
    }
    if (orientation !== 1) {
        const exif = orientationOnlyExif(orientation);
        parts.push(
            new Uint8Array([0xff, 0xe1, (exif.length + 2) >> 8, (exif.length + 2) & 0xff]),
            exif,
        );
    }
    for (const segment of rest) parts.push(bytes.subarray(segment.start, segment.end));
    parts.push(bytes.subarray(scan));
    return concat(parts);
}

// PNG ----------------------------------------------------------------------

interface Chunk {
    type: string;
    start: number;
    end: number;
    data: number;
    length: number;
}

function pngChunks(bytes: Uint8Array): Chunk[] {
    const chunks: Chunk[] = [];
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let at = 8;
    while (at + 12 <= bytes.length) {
        const length = view.getUint32(at);
        const end = at + 12 + length;
        if (end > bytes.length) throw damaged();
        const type = ascii(bytes, at + 4, 4);
        chunks.push({ type, start: at, end, data: at + 8, length });
        at = end;
        if (type === "IEND") break;
    }
    return chunks;
}

const PNG_KINDS: Record<string, BlockKind> = {
    eXIf: "exif",
    tEXt: "text",
    zTXt: "text",
    iTXt: "text",
    tIME: "time",
    iCCP: "icc",
};

function readPng(bytes: Uint8Array): Report {
    const blocks: Block[] = [];
    let exif: ExifData | null = null;
    for (const chunk of pngChunks(bytes)) {
        const kind = PNG_KINDS[chunk.type];
        if (!kind) continue;
        const data = bytes.subarray(chunk.data, chunk.data + chunk.length);
        if (kind === "text") {
            const zero = data.indexOf(0);
            const keyword = new TextDecoder("latin1").decode(
                data.subarray(0, zero < 0 ? data.length : zero),
            );
            const isXmp = keyword === "XML:com.adobe.xmp";
            let value = "";
            if (chunk.type === "tEXt" && zero >= 0)
                value = new TextDecoder("latin1").decode(data.subarray(zero + 1));
            if (chunk.type === "iTXt" && zero >= 0 && data[zero + 1] === 0) {
                // keyword \0 flag method language \0 translated \0 text
                let at = zero + 3;
                at = data.indexOf(0, at) + 1;
                at = data.indexOf(0, at) + 1;
                if (at > 0) value = new TextDecoder().decode(data.subarray(at));
            }
            blocks.push({
                kind: isXmp ? "xmp" : "text",
                bytes: chunk.end - chunk.start,
                label: isXmp ? undefined : `${keyword}${value ? `: ${value.slice(0, 200)}` : ""}`,
            });
        } else blocks.push({ kind, bytes: chunk.end - chunk.start });
        if (kind === "exif" && !exif) exif = readExif(data);
    }
    return { format: "png", blocks, exif };
}

function stripPng(bytes: Uint8Array, options: StripOptions): Uint8Array {
    const parts: Uint8Array[] = [bytes.subarray(0, 8)];
    for (const chunk of pngChunks(bytes)) {
        const kind = PNG_KINDS[chunk.type];
        if (!kind || (kind === "icc" && options.keepIcc))
            parts.push(bytes.subarray(chunk.start, chunk.end));
    }
    return concat(parts);
}

// WebP ---------------------------------------------------------------------

function webpChunks(bytes: Uint8Array): Chunk[] {
    const chunks: Chunk[] = [];
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let at = 12;
    while (at + 8 <= bytes.length) {
        const length = view.getUint32(at + 4, true);
        const end = at + 8 + length + (length % 2);
        if (at + 8 + length > bytes.length) throw damaged();
        chunks.push({
            type: ascii(bytes, at, 4),
            start: at,
            end: Math.min(end, bytes.length),
            data: at + 8,
            length,
        });
        at = end;
    }
    return chunks;
}

const WEBP_KINDS: Record<string, BlockKind> = { EXIF: "exif", "XMP ": "xmp", ICCP: "icc" };

function readWebp(bytes: Uint8Array): Report {
    const blocks: Block[] = [];
    let exif: ExifData | null = null;
    for (const chunk of webpChunks(bytes)) {
        const kind = WEBP_KINDS[chunk.type];
        if (!kind) continue;
        blocks.push({ kind, bytes: chunk.end - chunk.start });
        if (kind === "exif" && !exif) {
            let data = bytes.subarray(chunk.data, chunk.data + chunk.length);
            if (ascii(data, 0, 6) === "Exif\0\0") data = data.subarray(6);
            exif = readExif(data);
        }
    }
    return { format: "webp", blocks, exif };
}

function stripWebp(bytes: Uint8Array, options: StripOptions): Uint8Array {
    const parts: Uint8Array[] = [];
    for (const chunk of webpChunks(bytes)) {
        const kind = WEBP_KINDS[chunk.type];
        if (kind && !(kind === "icc" && options.keepIcc)) continue;
        const copy = bytes.slice(chunk.start, chunk.end);
        if (chunk.type === "VP8X") {
            // Clear the EXIF (0x08) and XMP (0x04) flags, and the ICC flag (0x20) when the profile goes.
            copy[8] = (copy[8] as number) & ~(0x08 | 0x04 | (options.keepIcc ? 0 : 0x20));
        }
        parts.push(copy);
    }
    const body = concat(parts);
    const out = new Uint8Array(12 + body.length);
    out.set(bytes.subarray(0, 12));
    new DataView(out.buffer).setUint32(4, 4 + body.length, true);
    out.set(body, 12);
    return out;
}

// Shared -------------------------------------------------------------------

function concat(parts: Uint8Array[]): Uint8Array {
    const out = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
    let at = 0;
    for (const part of parts) {
        out.set(part, at);
        at += part.length;
    }
    return out;
}

export function readMetadata(bytes: Uint8Array): Report {
    const format = detectFormat(bytes);
    try {
        if (format === "jpeg") return readJpeg(bytes);
        if (format === "png") return readPng(bytes);
        return readWebp(bytes);
    } catch (error) {
        if (error instanceof ToolFailure) throw error;
        throw damaged();
    }
}

export interface StripResult {
    bytes: Uint8Array;
    /** Blocks that are still in the output, read again from it. */
    remaining: Block[];
    /** Whether the orientation tag was kept, so the photo still shows upright. */
    keptOrientation: boolean;
}

/**
 * Removes the metadata, then reads the result again to prove that no
 * metadata is left (only the ICC profile when asked, and the orientation).
 */
export function stripMetadata(bytes: Uint8Array, options: StripOptions): StripResult {
    const report = readMetadata(bytes);
    const orientation = report.format === "jpeg" ? (report.exif?.orientation ?? 1) : 1;
    const out =
        report.format === "jpeg"
            ? stripJpeg(bytes, options, orientation)
            : report.format === "png"
              ? stripPng(bytes, options)
              : stripWebp(bytes, options);
    const check = readMetadata(out);
    const remaining = check.blocks.filter((block) => {
        if (block.kind === "icc" && options.keepIcc) return false;
        // The orientation-only block has one tag and nothing else.
        if (
            block.kind === "exif" &&
            orientation !== 1 &&
            check.exif &&
            check.exif.entries.length === 1 &&
            check.exif.otherCount === 0
        )
            return false;
        return true;
    });
    return { bytes: out, remaining, keptOrientation: orientation !== 1 };
}

export function cleanName(source: string): string {
    const match = /^(.*?)(\.[^.]+)?$/.exec(source);
    return safeFileName(`${match?.[1] || "image"}-clean${match?.[2] ?? ""}`);
}
