import { ToolFailure } from "@handyweb/core/runtime";

/*
 * Barcode encoders. Each returns the module widths from left to right,
 * starting with a bar: [bar, space, bar, space, ...]. Sources: ISO/IEC 15417
 * (Code 128) and ISO/IEC 15420 (EAN/UPC).
 */

export type Format = "code128" | "ean13" | "ean8" | "upca";

function fail(fa: string, en: string, detail: string): ToolFailure {
    return new ToolFailure("invalid-input", { fa, en }, detail);
}

// Code 128 bar and space widths for values 0 to 106. 106 is the stop code.
export const CODE128 = [
    "212222",
    "222122",
    "222221",
    "121223",
    "121322",
    "131222",
    "122213",
    "122312",
    "132212",
    "221213",
    "221312",
    "231212",
    "112232",
    "122132",
    "122231",
    "113222",
    "123122",
    "123221",
    "223211",
    "221132",
    "221231",
    "213212",
    "223112",
    "312131",
    "311222",
    "321122",
    "321221",
    "312212",
    "322112",
    "322211",
    "212123",
    "212321",
    "232121",
    "111323",
    "131123",
    "131321",
    "112313",
    "132113",
    "132311",
    "211313",
    "231113",
    "231311",
    "112133",
    "112331",
    "132131",
    "113123",
    "113321",
    "133121",
    "313121",
    "211331",
    "231131",
    "213113",
    "213311",
    "213131",
    "311123",
    "311321",
    "331121",
    "312113",
    "312311",
    "332111",
    "314111",
    "221411",
    "431111",
    "111224",
    "111422",
    "121124",
    "121421",
    "141122",
    "141221",
    "112214",
    "112412",
    "122114",
    "122411",
    "142112",
    "142211",
    "241211",
    "221114",
    "413111",
    "241112",
    "134111",
    "111242",
    "121142",
    "121241",
    "114212",
    "124112",
    "124211",
    "411212",
    "421112",
    "421211",
    "212141",
    "214121",
    "412121",
    "111143",
    "111341",
    "131141",
    "114113",
    "114311",
    "411113",
    "411311",
    "113141",
    "114131",
    "311141",
    "411131",
    "211412",
    "211214",
    "211232",
    "2331112",
];

const START_B = 104;
const START_C = 105;
const CODE_C = 99;
const CODE_B = 100;

/** The Code 128 values for the text, with start code and checksum, without the stop code. */
export function code128Values(text: string): number[] {
    if (text.length === 0) throw fail("متن خالی است.", "The text is empty.", "empty");
    if (text.length > 80)
        throw fail(
            "متن برای یک بارکد بلند است (بیشینه ۸۰ نویسه).",
            "The text is too long for one barcode (80 characters at most).",
            "length",
        );
    for (const char of text) {
        const code = char.charCodeAt(0);
        if (code < 32 || code > 126) {
            throw fail(
                "Code 128 تنها حروف و نشانه‌های انگلیسی (ASCII) را می‌پذیرد، نه حروف فارسی.",
                "Code 128 takes only English letters and symbols (ASCII), not Persian letters.",
                "ascii",
            );
        }
    }
    const values: number[] = [];
    // Pairs of digits use set C, which halves the length of long numbers.
    let set: "B" | "C" = /^\d{4}/.test(text) && text.match(/^\d+/)![0].length % 2 === 0 ? "C" : "B";
    values.push(set === "C" ? START_C : START_B);
    let i = 0;
    while (i < text.length) {
        const run = /^\d+/.exec(text.slice(i))?.[0].length ?? 0;
        if (set === "B" && run >= 6) {
            // Switch to C for an even number of digits.
            values.push(CODE_C);
            set = "C";
        }
        if (set === "C") {
            const digits = /^\d+/.exec(text.slice(i))?.[0].length ?? 0;
            if (digits >= 2) {
                values.push(Number(text.slice(i, i + 2)));
                i += 2;
                continue;
            }
            values.push(CODE_B);
            set = "B";
        }
        values.push(text.charCodeAt(i) - 32);
        i += 1;
    }
    const checksum =
        values.reduce((sum, value, index) => sum + value * Math.max(1, index), 0) % 103;
    values.push(checksum);
    return values;
}

function code128(text: string): number[] {
    const values = [...code128Values(text), 106];
    return values.flatMap((value) => [...(CODE128[value] as string)].map(Number));
}

// EAN/UPC digit patterns, as 7 modules (1 is a bar).
const L = [
    "0001101",
    "0011001",
    "0010011",
    "0111101",
    "0100011",
    "0110001",
    "0101111",
    "0111011",
    "0110111",
    "0001011",
];
const R = L.map((pattern) => [...pattern].map((bit) => (bit === "1" ? "0" : "1")).join(""));
const G = R.map((pattern) => [...pattern].reverse().join(""));
const PARITY = [
    "LLLLLL",
    "LLGLGG",
    "LLGGLG",
    "LLGGGL",
    "LGLLGG",
    "LGGLLG",
    "LGGGLL",
    "LGLGLG",
    "LGLGGL",
    "LGGLGL",
];

/** The EAN/UPC check digit for the digits before it. */
export function checkDigit(digits: string): number {
    let sum = 0;
    [...digits].reverse().forEach((digit, index) => {
        sum += Number(digit) * (index % 2 === 0 ? 3 : 1);
    });
    return (10 - (sum % 10)) % 10;
}

/** Adds or checks the check digit. */
export function completeEan(text: string, length: 8 | 12 | 13): string {
    const digits = text.replace(/[\s-]/g, "");
    if (!/^\d+$/.test(digits)) throw fail("تنها رقم بنویسید.", "Use digits only.", "digits");
    if (digits.length === length - 1) return digits + checkDigit(digits);
    if (digits.length === length) {
        if (Number(digits.at(-1)) !== checkDigit(digits.slice(0, -1))) {
            throw fail(
                `رقم کنترل درست نیست؛ باید ${checkDigit(digits.slice(0, -1))} باشد.`,
                `The check digit is wrong; it should be ${checkDigit(digits.slice(0, -1))}.`,
                "check",
            );
        }
        return digits;
    }
    throw fail(
        `${length - 1} یا ${length} رقم بنویسید.`,
        `Enter ${length - 1} or ${length} digits.`,
        "length",
    );
}

/** Run lengths of a bit string, starting with a bar. */
function runs(bits: string): number[] {
    const out: number[] = [];
    let current = "1";
    let count = 0;
    for (const bit of bits) {
        if (bit === current) count++;
        else {
            out.push(count);
            current = bit;
            count = 1;
        }
    }
    out.push(count);
    return out;
}

function ean13(digits: string): number[] {
    const parity = PARITY[Number(digits[0])] as string;
    let bits = "101";
    for (let i = 1; i <= 6; i++) bits += (parity[i - 1] === "L" ? L : G)[Number(digits[i])];
    bits += "01010";
    for (let i = 7; i <= 12; i++) bits += R[Number(digits[i])];
    bits += "101";
    return runs(bits);
}

function ean8(digits: string): number[] {
    let bits = "101";
    for (let i = 0; i < 4; i++) bits += L[Number(digits[i])];
    bits += "01010";
    for (let i = 4; i < 8; i++) bits += R[Number(digits[i])];
    bits += "101";
    return runs(bits);
}

export interface Encoded {
    format: Format;
    /** The text shown under the bars (with the check digit for EAN/UPC). */
    text: string;
    widths: number[];
}

export function encode(input: string, format: Format): Encoded {
    const text = input.trim();
    if (format === "code128") return { format, text, widths: code128(text) };
    if (format === "ean13") {
        const digits = completeEan(text, 13);
        return { format, text: digits, widths: ean13(digits) };
    }
    if (format === "upca") {
        const digits = completeEan(text, 12);
        return { format, text: digits, widths: ean13(`0${digits}`) };
    }
    const digits = completeEan(text, 8);
    return { format, text: digits, widths: ean8(digits) };
}
