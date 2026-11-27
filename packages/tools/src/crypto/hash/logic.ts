import { createSHA256, createSHA384, createSHA512 } from "hash-wasm";

/** The SHA-2 algorithms the tool offers. The names are the Web Crypto names. */
export const ALGORITHMS = ["SHA-256", "SHA-384", "SHA-512"] as const;
export type Algorithm = (typeof ALGORITHMS)[number];

export type OutputEncoding = "hex" | "base64";

/** Hashes text as UTF-8 with Web Crypto. */
export async function hashText(
    text: string,
    algorithm: Algorithm = "SHA-256",
): Promise<Uint8Array> {
    const digest = await crypto.subtle.digest(algorithm, new TextEncoder().encode(text));
    return new Uint8Array(digest);
}

export interface StreamProgress {
    completed: number;
    total: number;
}

/**
 * Hashes a Blob chunk by chunk, so a file of any size never has to fit in
 * memory at once. Web Crypto has no streaming digest, so this uses the
 * reviewed hash-wasm library (plan section 6.4).
 */
export async function hashBlob(
    blob: Blob,
    options: {
        algorithm?: Algorithm;
        signal?: AbortSignal;
        onProgress?: (progress: StreamProgress) => void;
    } = {},
): Promise<Uint8Array> {
    const create = { "SHA-256": createSHA256, "SHA-384": createSHA384, "SHA-512": createSHA512 };
    const hasher = await create[options.algorithm ?? "SHA-256"]();
    hasher.init();
    const reader = blob.stream().getReader();
    let completed = 0;
    let lastReport = 0;
    try {
        for (;;) {
            if (options.signal?.aborted) throw new DOMException("Canceled", "AbortError");
            const { done, value } = await reader.read();
            if (done) break;
            hasher.update(value);
            completed += value.byteLength;
            // Report at most about 100 times, so progress messages stay cheap.
            if (completed - lastReport >= blob.size / 100 || completed === blob.size) {
                lastReport = completed;
                options.onProgress?.({ completed, total: blob.size });
            }
        }
    } finally {
        reader.releaseLock();
    }
    return hasher.digest("binary");
}

export function encodeDigest(bytes: Uint8Array, encoding: OutputEncoding): string {
    if (encoding === "hex") return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
}

/**
 * Compares a computed digest with a pasted one. Accepts hex in any case and
 * Base64, and ignores spaces and a "sha256:", "sha384:", or "sha512:" style prefix.
 */
export function digestsMatch(bytes: Uint8Array, expected: string): boolean | null {
    const cleaned = expected
        .trim()
        .replace(/^sha-?(?:256|384|512)[:=\s]*/i, "")
        .replace(/\s+/g, "");
    if (cleaned === "") return null;
    if (/^[0-9a-fA-F]+$/.test(cleaned)) return cleaned.toLowerCase() === encodeDigest(bytes, "hex");
    return cleaned === encodeDigest(bytes, "base64");
}
