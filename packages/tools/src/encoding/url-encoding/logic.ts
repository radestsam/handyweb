import { ToolFailure } from "@handyweb/core/runtime";

/**
 * `component`: one part of a URL, such as a query value or a path segment. Every
 * reserved character is encoded, like encodeURIComponent.
 * `full`: a complete URL. The characters that give a URL its structure
 * (: / ? # [ ] @ ! $ & ' ( ) * + , ; =) stay, like encodeURI.
 */
export type UrlScope = "component" | "full";

export interface UrlOptions {
    scope: UrlScope;
    /**
     * Form encoding (application/x-www-form-urlencoded): a space is "+" when
     * encoding, and "+" is a space when decoding. Component scope only.
     */
    plusForSpace: boolean;
}

export const DEFAULT_OPTIONS: UrlOptions = { scope: "component", plusForSpace: false };

/** Characters that encodeURIComponent keeps. */
const UNRESERVED = /[A-Za-z0-9\-_.!~*'()]/;
/** The URL structure characters that the full scope also keeps. */
const RESERVED = /[;,/?:@&=+$#[\]]/;
const HEX = "0123456789ABCDEF";
const encoder = new TextEncoder();

function percent(byte: number): string {
    return `%${HEX[byte >> 4]}${HEX[byte & 15]}`;
}

function isHex(char: string | undefined): boolean {
    return char !== undefined && /^[0-9A-Fa-f]$/.test(char);
}

/**
 * Encodes text as UTF-8 and percent-encodes each byte that the scope does not
 * keep. Hex digits are upper case (RFC 3986 section 2.1). In the full scope, a
 * valid escape such as %20 stays, so an encoded URL is not encoded twice.
 */
export function encodeUrl(text: string, options: UrlOptions = DEFAULT_OPTIONS): string {
    let out = "";
    let index = 0;
    for (const char of text) {
        const code = char.codePointAt(0) as number;
        if (code >= 0xd800 && code <= 0xdfff) {
            throw new ToolFailure(
                "invalid-input",
                {
                    fa: `نویسه نیمه‌کاره (surrogate تنها) در جایگاه ${index + 1}. این نویسه در UTF-8 جایی ندارد.`,
                    en: `Broken character (lone surrogate) at position ${index + 1}. It has no UTF-8 form.`,
                },
                `position ${index + 1}`,
            );
        }
        if (UNRESERVED.test(char)) {
            out += char;
        } else if (options.scope === "full" && RESERVED.test(char)) {
            out += char;
        } else if (
            options.scope === "full" &&
            char === "%" &&
            isHex(text[index + 1]) &&
            isHex(text[index + 2])
        ) {
            out += char;
        } else if (options.scope === "component" && options.plusForSpace && char === " ") {
            out += "+";
        } else {
            for (const byte of encoder.encode(char)) out += percent(byte);
        }
        index += char.length;
    }
    return out;
}

const decoder = new TextDecoder("utf-8", { fatal: true });

/**
 * Decodes percent escapes as UTF-8. In the full scope, an escape of a URL
 * structure character (such as %2F or %3F) stays encoded, like decodeURI,
 * because decoding it changes the meaning of the URL. A "%" that does not
 * start a valid escape, or bytes that are not valid UTF-8, are an error.
 */
export function decodeUrl(text: string, options: UrlOptions = DEFAULT_OPTIONS): string {
    const input =
        options.scope === "component" && options.plusForSpace ? text.replace(/\+/g, " ") : text;
    let out = "";
    let i = 0;
    while (i < input.length) {
        if (input[i] !== "%") {
            out += input[i];
            i++;
            continue;
        }
        // Collect a run of escapes, so a multi-byte character decodes as one.
        const start = i;
        const bytes: number[] = [];
        const sources: string[] = [];
        while (input[i] === "%") {
            if (!isHex(input[i + 1]) || !isHex(input[i + 2])) {
                throw new ToolFailure(
                    "invalid-input",
                    {
                        fa: `نشانه % در جایگاه ${i + 1} دنباله درستی ندارد. پس از % باید دو رقم هگز (مانند %20) بیاید.`,
                        en: `The % at position ${i + 1} does not start a valid escape. A % must have two hex digits after it, as in %20.`,
                    },
                    `position ${i + 1}`,
                );
            }
            bytes.push(parseInt(input.slice(i + 1, i + 3), 16));
            sources.push(input.slice(i, i + 3));
            i += 3;
        }
        out += decodeRun(bytes, sources, start, options.scope);
    }
    return out;
}

function decodeRun(bytes: number[], sources: string[], start: number, scope: UrlScope): string {
    let out = "";
    let k = 0;
    while (k < bytes.length) {
        const byte = bytes[k] as number;
        const length = byte < 0x80 ? 1 : byte >= 0xf0 ? 4 : byte >= 0xe0 ? 3 : byte >= 0xc0 ? 2 : 0;
        const chunk = bytes.slice(k, k + length);
        let char: string | null = null;
        if (length > 0 && chunk.length === length) {
            try {
                char = decoder.decode(new Uint8Array(chunk));
            } catch {
                char = null;
            }
        }
        if (char === null) {
            const position = start + k * 3 + 1;
            throw new ToolFailure(
                "invalid-input",
                {
                    fa: `بایت‌های ${sources.slice(k, k + Math.max(length, 1)).join("")} در جایگاه ${position} نوشته UTF-8 درستی نیستند.`,
                    en: `The bytes ${sources.slice(k, k + Math.max(length, 1)).join("")} at position ${position} are not valid UTF-8 text.`,
                },
                `position ${position}`,
            );
        }
        out += scope === "full" && RESERVED.test(char) ? sources[k] : char;
        k += length;
    }
    return out;
}
