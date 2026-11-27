import { ToolFailure } from "@handyweb/core/runtime";

/*
 * Text to and from byte notations (hex and binary). Text is UTF-8. Shared by
 * the hex and binary tools.
 */

export type Radix = 2 | 16;
export type Separator = "space" | "none" | "colon" | "comma";

export interface EncodeOptions {
    separator: Separator;
    /** Hex only: write 0x before each byte. */
    prefix: boolean;
    uppercase: boolean;
}

const SEPARATORS: Record<Separator, string> = { space: " ", none: "", colon: ":", comma: ", " };

export function encodeBytes(text: string, radix: Radix, options: EncodeOptions): string {
    const width = radix === 16 ? 2 : 8;
    return Array.from(new TextEncoder().encode(text), (byte) => {
        let digits = byte.toString(radix).padStart(width, "0");
        if (options.uppercase) digits = digits.toUpperCase();
        return radix === 16 && options.prefix ? `0x${digits}` : digits;
    }).join(SEPARATORS[options.separator]);
}

function fail(fa: string, en: string, detail: string): ToolFailure {
    return new ToolFailure("invalid-input", { fa, en }, detail);
}

/**
 * Reads bytes in hex or binary. Spaces, line breaks, commas, colons, and 0x
 * or \x prefixes are ignored. The bytes must form valid UTF-8 text.
 */
export function decodeBytes(input: string, radix: Radix): string {
    const width = radix === 16 ? 2 : 8;
    const clean = input.replace(/0x|\\x/gi, "").replace(/[\s,:;-]+/g, "");
    const bad = clean.search(radix === 16 ? /[^0-9a-f]/i : /[^01]/);
    if (bad !== -1) {
        throw fail(
            radix === 16
                ? `نویسه «${clean[bad]}» رقم هگز نیست.`
                : `نویسه «${clean[bad]}» رقم دودویی (۰ یا ۱) نیست.`,
            radix === 16
                ? `"${clean[bad]}" is not a hex digit.`
                : `"${clean[bad]}" is not a binary digit (0 or 1).`,
            "digit",
        );
    }
    if (clean.length % width !== 0) {
        throw fail(
            radix === 16
                ? "شمار رقم‌های هگز باید زوج باشد (دو رقم برای هر بایت)."
                : "شمار رقم‌های دودویی باید بخش‌پذیر بر ۸ باشد (هشت رقم برای هر بایت).",
            radix === 16
                ? "Hex needs an even number of digits (two per byte)."
                : "Binary needs a multiple of 8 digits (eight per byte).",
            "length",
        );
    }
    const bytes = new Uint8Array(clean.length / width);
    for (let i = 0; i < bytes.length; i++)
        bytes[i] = parseInt(clean.slice(i * width, (i + 1) * width), radix);
    try {
        return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
        throw fail(
            "این بایت‌ها نوشته UTF-8 نیستند. شاید داده دودویی یا فایل باشد.",
            "These bytes are not UTF-8 text. They may be binary data or a file.",
            "utf-8",
        );
    }
}
