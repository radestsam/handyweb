import { ToolFailure } from "@handyweb/core/runtime";

/*
 * Integer base conversion with BigInt, so numbers of any size stay exact.
 * Fractions are not supported.
 */

export const MIN_BASE = 2;
export const MAX_BASE = 36;
const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";

export type BaseChoice = number | "auto";

export interface ParsedNumber {
    value: bigint;
    /** The base the input was read in. */
    base: number;
}

function fail(fa: string, en: string, detail: string): ToolFailure {
    return new ToolFailure("invalid-input", { fa, en }, detail);
}

function latinDigits(text: string): string {
    return text
        .replace(/[۰-۹]/g, (d) => String((d.codePointAt(0) as number) - 0x06f0))
        .replace(/[٠-٩]/g, (d) => String((d.codePointAt(0) as number) - 0x0660));
}

const PREFIXES: Record<string, number> = { "0x": 16, "0o": 8, "0b": 2 };

/**
 * Reads an integer. Spaces, underscores, commas, and Persian thousands
 * separators (٬) between digits are ignored. With base "auto", a 0x, 0o, or 0b
 * prefix picks the base, and a number without one is decimal. Persian and
 * Arabic-Indic digits are accepted.
 */
export function parseNumber(input: string, base: BaseChoice): ParsedNumber {
    let text = latinDigits(input.trim())
        .replace(/[\s_,٬']/g, "")
        .toLowerCase();
    if (text === "") throw fail("ورودی خالی است.", "The input is empty.", "empty");
    let negative = false;
    if (text.startsWith("-") || text.startsWith("+")) {
        negative = text.startsWith("-");
        text = text.slice(1);
    }
    let used = base === "auto" ? 10 : base;
    const prefix = PREFIXES[text.slice(0, 2)];
    if (prefix !== undefined && (base === "auto" || base === prefix)) {
        used = prefix;
        text = text.slice(2);
    }
    if (!Number.isInteger(used) || used < MIN_BASE || used > MAX_BASE) {
        throw fail(
            `پایه باید میان ${MIN_BASE} و ${MAX_BASE} باشد.`,
            `The base must be from ${MIN_BASE} to ${MAX_BASE}.`,
            "base",
        );
    }
    if (text === "")
        throw fail(
            "پس از پیشوند رقمی نیامده است.",
            "There are no digits after the prefix.",
            "digits",
        );
    let value = 0n;
    const big = BigInt(used);
    for (let i = 0; i < text.length; i++) {
        const digit = DIGITS.indexOf(text[i] as string);
        if (digit === -1 || digit >= used) {
            throw fail(
                `«${text[i]}» در پایه ${used} رقم نیست.`,
                `"${text[i]}" is not a digit in base ${used}.`,
                `digit ${text[i]}`,
            );
        }
        value = value * big + BigInt(digit);
    }
    return { value: negative ? -value : value, base: used };
}

export interface FormatOptions {
    uppercase: boolean;
    /** Split digits into groups: 4 for binary and hex, 3 for octal and decimal. */
    group: boolean;
}

const GROUP_SIZE: Record<number, number> = { 2: 4, 8: 3, 10: 3, 16: 4 };

export function formatNumber(value: bigint, base: number, options: FormatOptions): string {
    const negative = value < 0n;
    let digits = (negative ? -value : value).toString(base);
    if (options.uppercase) digits = digits.toUpperCase();
    if (options.group) {
        const size = GROUP_SIZE[base] ?? 4;
        const parts: string[] = [];
        for (let end = digits.length; end > 0; end -= size) {
            parts.unshift(digits.slice(Math.max(0, end - size), end));
        }
        digits = parts.join(base === 10 ? "," : " ");
    }
    return (negative ? "-" : "") + digits;
}

/** The number of bits of the absolute value (0 for zero). */
export function bitLength(value: bigint): number {
    return (value < 0n ? -value : value).toString(2).replace(/^0$/, "").length;
}
