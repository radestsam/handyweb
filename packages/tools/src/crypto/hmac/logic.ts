import { ToolFailure } from "@handyweb/core/runtime";

export const ALGORITHMS = ["SHA-256", "SHA-384", "SHA-512"] as const;
export type Algorithm = (typeof ALGORITHMS)[number];

/** How the key is written: as text (UTF-8), as hex, or as Base64. */
export type KeyFormat = "text" | "hex" | "base64";
export type OutputEncoding = "hex" | "base64";

function fail(fa: string, en: string, detail?: string): ToolFailure {
    return new ToolFailure("invalid-input", { fa, en }, detail);
}

function hexToBytes(hex: string): Uint8Array {
    const clean = hex.replace(/\s+/g, "");
    if (!/^[0-9a-fA-F]*$/.test(clean)) {
        throw fail(
            "کلید هگز تنها 0 تا 9 و a تا f دارد.",
            "A hex key holds only 0 to 9 and a to f.",
            "hex",
        );
    }
    if (clean.length % 2 === 1) {
        throw fail(
            "شمار رقم‌های کلید هگز باید زوج باشد.",
            "A hex key must have an even number of digits.",
            "hex length",
        );
    }
    return Uint8Array.from(clean.match(/../g) ?? [], (pair) => parseInt(pair, 16));
}

function base64ToBytes(text: string): Uint8Array {
    const clean = text.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(clean) || clean.replace(/=+$/, "").length % 4 === 1) {
        throw fail("کلید Base64 درست نیست.", "The Base64 key is not valid.", "base64");
    }
    const binary = atob(
        clean.replace(/=+$/, "") + "=".repeat((4 - (clean.replace(/=+$/, "").length % 4)) % 4),
    );
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export function keyBytes(key: string, format: KeyFormat): Uint8Array {
    const bytes =
        format === "text"
            ? new TextEncoder().encode(key)
            : format === "hex"
              ? hexToBytes(key)
              : base64ToBytes(key);
    // Web Crypto does not accept an empty HMAC key.
    if (bytes.length === 0) throw fail("کلید را بنویسید.", "Enter a key.", "empty key");
    return bytes;
}

async function importKey(key: Uint8Array, algorithm: Algorithm, usage: "sign" | "verify") {
    return crypto.subtle.importKey(
        "raw",
        key as Uint8Array<ArrayBuffer>,
        { name: "HMAC", hash: algorithm },
        false,
        [usage],
    );
}

export interface HmacInput {
    message: string;
    key: string;
    keyFormat: KeyFormat;
    algorithm: Algorithm;
}

/** Computes the HMAC of the message, read as UTF-8, with Web Crypto. */
export async function computeHmac({
    message,
    key,
    keyFormat,
    algorithm,
}: HmacInput): Promise<Uint8Array> {
    const cryptoKey = await importKey(keyBytes(key, keyFormat), algorithm, "sign");
    const mac = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(message));
    return new Uint8Array(mac);
}

export function encodeMac(bytes: Uint8Array, encoding: OutputEncoding): string {
    if (encoding === "hex")
        return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
}

const MAC_BYTES: Record<Algorithm, number> = { "SHA-256": 32, "SHA-384": 48, "SHA-512": 64 };

/**
 * Reads an expected HMAC as hex or Base64 (also Base64url). A "sha256=" style
 * prefix, as GitHub and other webhooks send, is removed. Returns null when the
 * value is neither form or has the wrong length for the algorithm.
 */
export function parseExpected(expected: string, algorithm: Algorithm): Uint8Array | null {
    const cleaned = expected
        .trim()
        .replace(/^(?:hmac-?)?sha-?(?:256|384|512)[:=\s]*/i, "")
        .replace(/\s+/g, "");
    if (cleaned === "") return null;
    const length = MAC_BYTES[algorithm];
    if (/^[0-9a-fA-F]+$/.test(cleaned) && cleaned.length === length * 2) return hexToBytes(cleaned);
    try {
        const bytes = base64ToBytes(cleaned);
        return bytes.length === length ? bytes : null;
    } catch {
        return null;
    }
}

/**
 * Checks an expected HMAC with crypto.subtle.verify, which compares in
 * constant time. Returns null when the expected value cannot be read.
 */
export async function verifyHmac(input: HmacInput, expected: string): Promise<boolean | null> {
    const mac = parseExpected(expected, input.algorithm);
    if (!mac) return null;
    const cryptoKey = await importKey(
        keyBytes(input.key, input.keyFormat),
        input.algorithm,
        "verify",
    );
    return crypto.subtle.verify(
        "HMAC",
        cryptoKey,
        mac as Uint8Array<ArrayBuffer>,
        new TextEncoder().encode(input.message),
    );
}
