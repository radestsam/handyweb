import { ToolFailure } from "@handyweb/core/runtime";

/*
 * Roman numerals from 1 to 3999 in the standard form, where 4 is IV and 9 is
 * IX. A numeral is accepted only in this form, so IIII and VX are refused.
 */

const PAIRS: Array<[number, string]> = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
];

export function toRoman(value: number): string {
    if (!Number.isInteger(value) || value < 1 || value > 3999) {
        throw new ToolFailure(
            "invalid-input",
            {
                fa: "عدد باید صحیح و از ۱ تا ۳۹۹۹ باشد.",
                en: "The number must be a whole number from 1 to 3999.",
            },
            "range",
        );
    }
    let rest = value;
    let out = "";
    for (const [amount, symbol] of PAIRS) {
        while (rest >= amount) {
            out += symbol;
            rest -= amount;
        }
    }
    return out;
}

const STANDARD = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;

export function fromRoman(text: string): number {
    const roman = text.trim().toUpperCase();
    if (roman === "" || !STANDARD.test(roman)) {
        throw new ToolFailure(
            "invalid-input",
            {
                fa: "این عدد رومی به شکل استاندارد نیست، برای نمونه MMXXV.",
                en: "This is not a standard Roman numeral, for example MMXXV.",
            },
            "roman",
        );
    }
    let total = 0;
    let at = 0;
    for (const [amount, symbol] of PAIRS) {
        while (roman.startsWith(symbol, at)) {
            total += amount;
            at += symbol.length;
        }
    }
    return total;
}

/** A Roman numeral or a number, in either direction. */
export function convertRoman(text: string): { roman: string; value: number } {
    const latin = text
        .trim()
        .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
        .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
    if (/^\d+$/.test(latin)) {
        const value = Number(latin);
        return { roman: toRoman(value), value };
    }
    const value = fromRoman(latin);
    return { roman: latin.toUpperCase(), value };
}
