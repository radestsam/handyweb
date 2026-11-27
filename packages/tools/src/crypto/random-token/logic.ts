import { ToolFailure } from "@handyweb/core/runtime";
import { cryptoSource, randomInt, type RandomSource } from "../password-generator/logic";

/*
 * Random tokens and random bytes. All randomness comes from
 * crypto.getRandomValues. A token picks each character with randomInt, which
 * uses rejection sampling, so every character is equally likely.
 */

export const ALPHABETS = {
    hex: "0123456789abcdef",
    base64url: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
    alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    numeric: "0123456789",
} as const;
export type AlphabetName = keyof typeof ALPHABETS;
export const ALPHABET_NAMES: readonly AlphabetName[] = [
    "hex",
    "base64url",
    "alphanumeric",
    "numeric",
];

export type ByteEncoding = "hex" | "base64" | "base64url";

export const MAX_LENGTH = 1024;
export const MAX_BYTES = 1024;
export const MAX_COUNT = 100;

function fail(fa: string, en: string, detail: string): ToolFailure {
    return new ToolFailure("invalid-input", { fa, en }, detail);
}

function checkRange(value: number, min: number, max: number, name: string): void {
    if (!Number.isInteger(value) || value < min || value > max) {
        const labels: Record<string, { fa: string; en: string }> = {
            length: { fa: "درازا", en: "The length" },
            bytes: { fa: "شمار بایت‌ها", en: "The number of bytes" },
            count: { fa: "شمار", en: "The count" },
        };
        const label = labels[name] ?? { fa: name, en: name };
        throw fail(
            `${label.fa} باید میان ${min} و ${max} باشد.`,
            `${label.en} must be from ${min} to ${max}.`,
            name,
        );
    }
}

export function generateToken(
    alphabet: AlphabetName,
    length: number,
    random: RandomSource = cryptoSource,
): string {
    checkRange(length, 1, MAX_LENGTH, "length");
    const chars = ALPHABETS[alphabet];
    let token = "";
    for (let i = 0; i < length; i++) token += chars[randomInt(chars.length, random)];
    return token;
}

export function tokenBits(alphabet: AlphabetName, length: number): number {
    return length * Math.log2(ALPHABETS[alphabet].length);
}

export function randomBytes(count: number, random: RandomSource = cryptoSource): Uint8Array {
    checkRange(count, 1, MAX_BYTES, "bytes");
    // getRandomValues fills whole 32-bit words, so draw enough words and cut.
    const words = random(new Uint32Array(Math.ceil(count / 4)));
    return new Uint8Array(words.buffer, 0, count).slice();
}

export function encodeBytes(bytes: Uint8Array, encoding: ByteEncoding): string {
    if (encoding === "hex")
        return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    const base64 = btoa(binary);
    return encoding === "base64"
        ? base64
        : base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Makes `count` values, one per line. */
export function generateMany(count: number, make: () => string): string {
    checkRange(count, 1, MAX_COUNT, "count");
    return Array.from({ length: count }, make).join("\n");
}
