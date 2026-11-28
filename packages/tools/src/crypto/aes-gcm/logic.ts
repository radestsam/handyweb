import { ToolFailure } from "@handyweb/core/runtime";
import { base64ToBytes, bytesToBase64 } from "../../encoding/base64/logic";

/*
 * Text encryption with a passphrase, using Web Crypto only.
 *
 * Key: PBKDF2 with HMAC-SHA-256, 600,000 iterations (the OWASP 2023 advice),
 * a random 16-byte salt, and a 256-bit result.
 * Cipher: AES-256-GCM with a random 12-byte IV and a 128-bit tag.
 *
 * Output format, Base64 (standard alphabet, with padding) of:
 *   byte 0      version, 1
 *   bytes 1-16  salt
 *   bytes 17-28 IV
 *   bytes 29-   ciphertext followed by the 16-byte GCM tag
 * The plaintext is UTF-8.
 */

export const VERSION = 1;
export const ITERATIONS = 600_000;
const SALT_BYTES = 16;
const IV_BYTES = 12;
const TAG_BYTES = 16;
const HEADER = 1 + SALT_BYTES + IV_BYTES;

/** Random bytes come from crypto.getRandomValues. Tests pass a fixed source. */
export type RandomBytes = (length: number) => Uint8Array<ArrayBuffer>;
const cryptoRandom: RandomBytes = (length) => crypto.getRandomValues(new Uint8Array(length));

async function deriveKey(
    passphrase: string,
    salt: Uint8Array<ArrayBuffer>,
    iterations: number,
    usage: KeyUsage,
): Promise<CryptoKey> {
    const material = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(passphrase),
        "PBKDF2",
        false,
        ["deriveKey"],
    );
    return crypto.subtle.deriveKey(
        { name: "PBKDF2", hash: "SHA-256", salt, iterations },
        material,
        { name: "AES-GCM", length: 256 },
        false,
        [usage],
    );
}

function checkPassphrase(passphrase: string): void {
    if (passphrase === "") {
        throw new ToolFailure(
            "invalid-input",
            { fa: "عبارت عبور را بنویسید.", en: "Enter a passphrase." },
            "empty passphrase",
        );
    }
}

export async function encryptText(
    text: string,
    passphrase: string,
    random: RandomBytes = cryptoRandom,
    iterations: number = ITERATIONS,
): Promise<string> {
    checkPassphrase(passphrase);
    const salt = random(SALT_BYTES);
    const iv = random(IV_BYTES);
    const key = await deriveKey(passphrase, salt, iterations, "encrypt");
    const sealed = new Uint8Array(
        await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(text)),
    );
    const out = new Uint8Array(HEADER + sealed.length);
    out[0] = VERSION;
    out.set(salt, 1);
    out.set(iv, 1 + SALT_BYTES);
    out.set(sealed, HEADER);
    return bytesToBase64(out, { urlSafe: false, padding: true });
}

export async function decryptText(
    encoded: string,
    passphrase: string,
    iterations: number = ITERATIONS,
): Promise<string> {
    checkPassphrase(passphrase);
    const bytes = base64ToBytes(encoded);
    if (bytes.length < HEADER + TAG_BYTES || bytes[0] !== VERSION) {
        throw new ToolFailure(
            "invalid-input",
            {
                fa: "این داده با این ابزار رمزنگاری نشده است، یا کامل نیست.",
                en: "This data was not encrypted with this tool, or it is not complete.",
            },
            "format",
        );
    }
    const salt = bytes.slice(1, 1 + SALT_BYTES);
    const iv = bytes.slice(1 + SALT_BYTES, HEADER);
    const key = await deriveKey(passphrase, salt, iterations, "decrypt");
    try {
        const plain = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            bytes.slice(HEADER),
        );
        return new TextDecoder().decode(plain);
    } catch {
        throw new ToolFailure(
            "invalid-input",
            {
                fa: "رمزگشایی نشد: عبارت عبور نادرست است، یا داده دگرگون شده است.",
                en: "Could not decrypt: the passphrase is wrong, or the data was changed.",
            },
            "auth",
        );
    }
}
