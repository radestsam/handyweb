import { ToolFailure } from "@handyweb/core/runtime";

/*
 * Numbers to Persian words. Whole numbers use BigInt, so they stay exact up
 * to 27 digits. The parts of a number are joined with " و ", as in
 * «هزار و دویست و سی و چهار».
 */

const ONES = [
    "",
    "یک",
    "دو",
    "سه",
    "چهار",
    "پنج",
    "شش",
    "هفت",
    "هشت",
    "نه",
    "ده",
    "یازده",
    "دوازده",
    "سیزده",
    "چهارده",
    "پانزده",
    "شانزده",
    "هفده",
    "هجده",
    "نوزده",
];
const TENS = ["", "", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
const HUNDREDS = ["", "صد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد"];
/** Short-scale names: 10^3, 10^6, 10^9, and so on. */
const SCALES = [
    "",
    "هزار",
    "میلیون",
    "میلیارد",
    "تریلیون",
    "کوادریلیون",
    "کوینتیلیون",
    "سکستیلیون",
    "سپتیلیون",
];
export const MAX_DIGITS = SCALES.length * 3;
const FRACTIONS = ["", "دهم", "صدم", "هزارم", "ده‌هزارم", "صدهزارم", "میلیونم"];
export const MAX_DECIMALS = FRACTIONS.length - 1;

function belowThousand(n: number): string {
    const parts: string[] = [];
    const hundreds = Math.floor(n / 100);
    const rest = n % 100;
    if (hundreds) parts.push(HUNDREDS[hundreds] as string);
    if (rest >= 20) {
        parts.push(TENS[Math.floor(rest / 10)] as string);
        if (rest % 10) parts.push(ONES[rest % 10] as string);
    } else if (rest) {
        parts.push(ONES[rest] as string);
    }
    return parts.join(" و ");
}

/** A whole number in words. 1000 is «هزار», not «یک هزار». */
export function integerToWords(value: bigint): string {
    if (value === 0n) return "صفر";
    if (value < 0n) return `منفی ${integerToWords(-value)}`;
    const groups: number[] = [];
    for (let n = value; n > 0n; n /= 1000n) groups.push(Number(n % 1000n));
    if (groups.length > SCALES.length) throw new RangeError("too large");
    const parts: string[] = [];
    for (let i = groups.length - 1; i >= 0; i--) {
        const group = groups[i] as number;
        if (group === 0) continue;
        const scale = SCALES[i] as string;
        if (i === 1 && group === 1) parts.push(scale);
        else parts.push(scale ? `${belowThousand(group)} ${scale}` : belowThousand(group));
    }
    return parts.join(" و ");
}

/** The ordinal form: «سوم»، «سی‌ام»، «بیست و یکم». */
export function toOrdinal(words: string): string {
    if (words.endsWith("سه")) return `${words.slice(0, -2)}سوم`;
    if (words.endsWith("ی")) return `${words}‌ام`;
    return `${words}م`;
}

export type Unit = "none" | "rial" | "toman";

export interface WordsOptions {
    ordinal: boolean;
    unit: Unit;
}

function latinDigits(text: string): string {
    return text
        .replace(/[۰-۹]/g, (d) => String((d.codePointAt(0) as number) - 0x06f0))
        .replace(/[٠-٩]/g, (d) => String((d.codePointAt(0) as number) - 0x0660));
}

function fail(fa: string, en: string, detail: string): ToolFailure {
    return new ToolFailure("invalid-input", { fa, en }, detail);
}

/**
 * Reads a number with Persian or Latin digits, thousands separators, a sign,
 * and an optional decimal part (with "." or "٫"), and writes it in words.
 */
export function numberToWords(input: string, options: WordsOptions): string {
    const text = latinDigits(input.trim())
        .replace(/[\s,٬_']/g, "")
        .replace("٫", ".");
    const match = /^([-+]?)(\d+)(?:\.(\d+))?$/.exec(text);
    if (!match) {
        throw fail(
            "یک عدد بنویسید، مانند ۱۲۳۴ یا ۳٫۲۵.",
            "Enter a number, such as 1234 or 3.25.",
            "format",
        );
    }
    const [, sign, whole, fraction] = match as unknown as [
        string,
        string,
        string,
        string | undefined,
    ];
    const digits = whole.replace(/^0+(?=\d)/, "");
    if (digits.length > MAX_DIGITS) {
        throw fail(
            `بخش درست عدد تا ${MAX_DIGITS} رقم پذیرفته می‌شود.`,
            `The whole part can have up to ${MAX_DIGITS} digits.`,
            "too large",
        );
    }
    if (fraction && fraction.length > MAX_DECIMALS) {
        throw fail(
            `تا ${MAX_DECIMALS} رقم اعشار پذیرفته می‌شود.`,
            `Up to ${MAX_DECIMALS} decimal places are accepted.`,
            "decimals",
        );
    }
    if (options.ordinal && (fraction || sign === "-")) {
        throw fail(
            "عدد ترتیبی تنها برای عدد درست و مثبت است.",
            "Ordinals are only for positive whole numbers.",
            "ordinal",
        );
    }
    let words = integerToWords(BigInt(digits));
    const decimals = fraction?.replace(/0+$/, "") ?? "";
    if (decimals) {
        const part = `${integerToWords(BigInt(decimals))} ${FRACTIONS[decimals.length] as string}`;
        words = digits === "0" ? part : `${words} و ${part}`;
    }
    if (sign === "-" && (digits !== "0" || decimals)) words = `منفی ${words}`;
    if (options.ordinal) words = toOrdinal(words);
    if (options.unit !== "none") words = `${words} ${options.unit === "rial" ? "ریال" : "تومان"}`;
    return words;
}
