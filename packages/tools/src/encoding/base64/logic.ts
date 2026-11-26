import { ToolFailure } from "@handyweb/core/runtime";

export interface Base64Options {
    /** Use the URL-safe alphabet: `-` and `_` instead of `+` and `/` (RFC 4648 section 5). */
    urlSafe: boolean;
    /** Add `=` padding when encoding. */
    padding: boolean;
}

export const DEFAULT_OPTIONS: Base64Options = { urlSafe: false, padding: true };

/** Encodes text as UTF-8 bytes, then as Base64. */
export function encodeBase64(text: string, options: Base64Options = DEFAULT_OPTIONS): string {
    return bytesToBase64(new TextEncoder().encode(text), options);
}

export function bytesToBase64(bytes: Uint8Array, options: Base64Options = DEFAULT_OPTIONS): string {
    // btoa takes a "binary string". Build it in chunks, so a large input does
    // not exceed the argument limit of String.fromCharCode.
    let binary = "";
    const CHUNK = 0x8000;
    for (let i = 0; i < bytes.length; i += CHUNK) {
        binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
    }
    let encoded = btoa(binary);
    if (options.urlSafe) encoded = encoded.replace(/\+/g, "-").replace(/\//g, "_");
    if (!options.padding) encoded = encoded.replace(/=+$/, "");
    return encoded;
}

const STANDARD = /^[A-Za-z0-9+/]*$/;
const URL_SAFE = /^[A-Za-z0-9\-_]*$/;

/**
 * Decodes Base64 into bytes. Accepts both alphabets, line breaks and spaces
 * (as in PEM and e-mail), and missing padding. Rejects anything else and
 * names the position of the first invalid character.
 */
export function base64ToBytes(input: string): Uint8Array {
    const compact = input.replace(/[\s]+/g, "");
    const body = compact.replace(/=+$/, "");
    const padding = compact.length - body.length;

    if (padding > 2) throw invalid("too-much-padding");
    const usesStandard = STANDARD.test(body);
    const usesUrlSafe = URL_SAFE.test(body);
    if (!usesStandard && !usesUrlSafe) {
        const position = firstInvalid(input);
        throw new ToolFailure(
            "invalid-input",
            {
                fa: `نویسه نادرست در جایگاه ${position + 1}. Base64 تنها از A تا Z، a تا z، 0 تا 9 و + / یا - _ ساخته می‌شود.`,
                en: `Invalid character at position ${position + 1}. Base64 holds only A to Z, a to z, 0 to 9, and + / or - _.`,
            },
            `position ${position + 1}`,
        );
    }
    if (body.length % 4 === 1) throw invalid("length");
    if (padding > 0 && (body.length + padding) % 4 !== 0) throw invalid("padding");

    const standard = body.replace(/-/g, "+").replace(/_/g, "/");
    const padded = standard + "=".repeat((4 - (standard.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
}

/** Decodes Base64, then reads the bytes as UTF-8 text. */
export function decodeBase64(input: string): string {
    const bytes = base64ToBytes(input);
    try {
        return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
        throw new ToolFailure(
            "invalid-input",
            {
                fa: "این Base64 درست است، اما نوشته UTF-8 نیست. شاید یک فایل یا داده دودویی باشد.",
                en: "This is valid Base64, but it is not UTF-8 text. It may be a file or binary data.",
            },
            `${bytes.length} bytes`,
        );
    }
}

function firstInvalid(input: string): number {
    for (let i = 0; i < input.length; i++) {
        if (!/[A-Za-z0-9+/\-_=\s]/.test(input[i] as string)) return i;
    }
    // Both alphabets are mixed, for example "+" and "-". Point at the first "-" or "_".
    return Math.max(0, input.search(/[-_]/));
}

function invalid(reason: "too-much-padding" | "length" | "padding"): ToolFailure {
    const messages = {
        "too-much-padding": {
            fa: "شمار نویسه‌های = در پایان بیش از دو است.",
            en: "There are more than two = characters at the end.",
        },
        length: {
            fa: "درازای Base64 نادرست است. شاید بخشی از آن کپی نشده باشد.",
            en: "The Base64 length is not valid. Part of it may be missing.",
        },
        padding: {
            fa: "نویسه‌های = پایانی با درازای داده جور نیستند.",
            en: "The = padding does not match the length of the data.",
        },
    };
    return new ToolFailure("invalid-input", messages[reason], reason);
}
