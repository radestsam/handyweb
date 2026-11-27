import { ToolFailure } from "@handyweb/core/runtime";

/*
 * Compression with the CompressionStream and DecompressionStream of the
 * browser. Decompression stops when the output passes a limit, so a small
 * "zip bomb" cannot fill the memory of the device.
 */

export type Format = "gzip" | "deflate" | "deflate-raw";
export const FORMATS: readonly Format[] = ["gzip", "deflate", "deflate-raw"];

/** The largest decompressed output. */
export const MAX_OUTPUT = 50_000_000;

async function collect(
    stream: ReadableStream<Uint8Array<ArrayBuffer>>,
    limit: number,
): Promise<Uint8Array> {
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    try {
        for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            total += value.byteLength;
            if (total > limit) {
                await reader.cancel();
                throw new ToolFailure(
                    "too-large",
                    {
                        fa: "داده بازشده بیش از ۵۰ مگابایت می‌شود، پس کار ایستانده شد.",
                        en: "The decompressed data is larger than 50 MB, so the work was stopped.",
                    },
                    "output limit",
                );
            }
            chunks.push(value);
        }
    } finally {
        reader.releaseLock();
    }
    const out = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
        out.set(chunk, offset);
        offset += chunk.byteLength;
    }
    return out;
}

function source(bytes: Uint8Array): ReadableStream<Uint8Array<ArrayBuffer>> {
    return new Blob([bytes as Uint8Array<ArrayBuffer>]).stream();
}

export async function compress(bytes: Uint8Array, format: Format): Promise<Uint8Array> {
    return collect(
        source(bytes).pipeThrough(new CompressionStream(format)),
        Number.POSITIVE_INFINITY,
    );
}

export async function decompress(
    bytes: Uint8Array,
    format: Format,
    limit: number = MAX_OUTPUT,
): Promise<Uint8Array> {
    try {
        return await collect(source(bytes).pipeThrough(new DecompressionStream(format)), limit);
    } catch (error) {
        if (error instanceof ToolFailure) throw error;
        throw new ToolFailure(
            "invalid-input",
            {
                fa: `این داده ${format} درستی نیست، یا گونه دیگری دارد.`,
                en: `This is not valid ${format} data, or it uses another format.`,
            },
            error instanceof Error ? error.message : undefined,
        );
    }
}

/** Guesses the format from the first bytes: 1f 8b is gzip, 78 xx is zlib (deflate). */
export function detectFormat(bytes: Uint8Array): Format | null {
    if (bytes[0] === 0x1f && bytes[1] === 0x8b) return "gzip";
    const cmf = bytes[0] ?? 0;
    const flg = bytes[1] ?? 0;
    if ((cmf & 0x0f) === 8 && ((cmf << 8) | flg) % 31 === 0) return "deflate";
    return null;
}
