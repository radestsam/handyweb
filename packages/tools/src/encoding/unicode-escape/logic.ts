import { ToolFailure } from "@handyweb/core/runtime";

/**
 * `js`: \uXXXX with UTF-16 surrogate pairs. JSON, Java, and C# read it too.
 * `es6`: \u{XXXX}, one escape per code point (JavaScript since ES2015).
 * `python`: \uXXXX, and \UXXXXXXXX above U+FFFF.
 * `codepoint`: U+XXXX, separated by spaces.
 */
export type EscapeFormat = "js" | "es6" | "python" | "codepoint";

export const ESCAPE_FORMATS: readonly EscapeFormat[] = ["js", "es6", "python", "codepoint"];

export interface EscapeOptions {
    format: EscapeFormat;
    /** Escape ASCII letters, digits, and symbols too, not only the other characters. */
    all: boolean;
}

export const DEFAULT_OPTIONS: EscapeOptions = { format: "js", all: false };

const hex = (n: number, width: number) => n.toString(16).toUpperCase().padStart(width, "0");

function escapeOne(code: number, format: EscapeFormat): string {
    switch (format) {
        case "js":
            if (code > 0xffff) {
                const v = code - 0x10000;
                return `\\u${hex(0xd800 + (v >> 10), 4)}\\u${hex(0xdc00 + (v & 0x3ff), 4)}`;
            }
            return `\\u${hex(code, 4)}`;
        case "es6":
            return `\\u{${hex(code, 1)}}`;
        case "python":
            return code > 0xffff ? `\\U${hex(code, 8)}` : `\\u${hex(code, 4)}`;
        case "codepoint":
            return `U+${hex(code, 4)}`;
    }
}

/**
 * Escapes each code point outside printable ASCII (or every code point, with
 * the `all` option). Line breaks and tabs are escaped too, because an escaped
 * string is often pasted into code as one line. In the `codepoint` format,
 * every code point is written as U+XXXX and the values are separated by spaces.
 */
export function escapeText(text: string, options: EscapeOptions = DEFAULT_OPTIONS): string {
    const parts: string[] = [];
    for (const char of text) {
        const code = char.codePointAt(0) as number;
        const printable = code >= 0x20 && code <= 0x7e && char !== "\\";
        if (options.format === "codepoint") {
            parts.push(escapeOne(code, "codepoint"));
        } else if (printable && !options.all) {
            parts.push(char);
        } else if (char === "\\" && !options.all) {
            parts.push("\\\\");
        } else {
            parts.push(escapeOne(code, options.format));
        }
    }
    return parts.join(options.format === "codepoint" ? " " : "");
}

/**
 * One escape, in any of the supported forms. `\\` is a backslash. `\xXX` is
 * the Python and C form for U+0000 to U+00FF.
 */
const ESCAPE =
    /\\u\{([0-9A-Fa-f]{1,8})\}|\\u([0-9A-Fa-f]{4})|\\U([0-9A-Fa-f]{8})|\\x([0-9A-Fa-f]{2})|U\+([0-9A-Fa-f]{4,6})|\\\\/g;

function invalid(position: number, source: string, reason: "range" | "surrogate"): ToolFailure {
    return new ToolFailure(
        "invalid-input",
        reason === "range"
            ? {
                  fa: `${source} در جایگاه ${position} بیرون از بازه یونیکد است (بیشینه U+10FFFF).`,
                  en: `${source} at position ${position} is outside the Unicode range (the maximum is U+10FFFF).`,
              }
            : {
                  fa: `${source} در جایگاه ${position} نیمی از یک جفت surrogate است و جفت آن نیامده است.`,
                  en: `${source} at position ${position} is half of a surrogate pair, and the other half is missing.`,
              },
        `position ${position}`,
    );
}

/**
 * Decodes every escape form that escapeText writes, mixed in one text. Two
 * \uXXXX escapes of a surrogate pair become one character. Text that is not an
 * escape stays as it is. In a U+XXXX list, the single spaces between the
 * values are removed.
 */
export function unescapeText(text: string): string {
    const units: Array<{ code: number; position: number; source: string } | string> = [];
    let last = 0;
    for (const match of text.matchAll(ESCAPE)) {
        const [source, braced, four, eight, byte, plus] = match;
        if (match.index > last) units.push(text.slice(last, match.index));
        last = match.index + source.length;
        if (source === "\\\\") {
            units.push("\\");
            continue;
        }
        const code = parseInt((braced ?? four ?? eight ?? byte ?? plus) as string, 16);
        if (code > 0x10ffff) throw invalid(match.index + 1, source, "range");
        units.push({ code, position: match.index + 1, source });
    }
    if (last < text.length) units.push(text.slice(last));

    // A list of U+XXXX values reads as one text: drop the single spaces between them.
    const isPlus = (u: (typeof units)[number] | undefined) =>
        typeof u === "object" && u.source.startsWith("U+");
    let out = "";
    for (let i = 0; i < units.length; i++) {
        const unit = units[i] as (typeof units)[number];
        if (typeof unit === "string") {
            out += unit === " " && isPlus(units[i - 1]) && isPlus(units[i + 1]) ? "" : unit;
            continue;
        }
        const { code } = unit;
        if (code >= 0xd800 && code <= 0xdbff) {
            const next = units[i + 1];
            const low =
                typeof next === "object" && next.code >= 0xdc00 && next.code <= 0xdfff
                    ? next
                    : null;
            if (!low) throw invalid(unit.position, unit.source, "surrogate");
            out += String.fromCodePoint(0x10000 + ((code - 0xd800) << 10) + (low.code - 0xdc00));
            i++;
        } else if (code >= 0xdc00 && code <= 0xdfff) {
            throw invalid(unit.position, unit.source, "surrogate");
        } else {
            out += String.fromCodePoint(code);
        }
    }
    return out;
}
