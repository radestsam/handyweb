/**
 * Persian text normalization. Every rule is a separate option, so the user
 * decides what changes. Nothing is applied silently (plan section 5.4).
 */

export type DigitMode = "keep" | "arabic-to-persian" | "to-persian" | "to-latin";

export interface NormalizeOptions {
    /** ي (U+064A) and ى (U+0649) to ی (U+06CC); ك (U+0643) to ک (U+06A9). */
    arabicLetters: boolean;
    /** ة (U+0629) to ه (U+0647). Changes meaning in Arabic words, so off by default. */
    tehMarbuta: boolean;
    /** Arabic presentation forms (U+FB50 to U+FDFF, U+FE70 to U+FEFF) to normal letters. */
    presentationForms: boolean;
    /** Removes the tatweel (ـ, U+0640) used to stretch words. */
    tatweel: boolean;
    /** Removes short vowels and other harakat (U+064B to U+065F, U+0670). */
    diacritics: boolean;
    /** Removes repeated ZWNJ and ZWNJ next to a space or at a word edge. */
    zwnj: boolean;
    digits: DigitMode;
    /** Removes the space before ، ؛ ؟ ! . : and adds one after ، ؛ ؟ when missing. */
    punctuationSpacing: boolean;
}

export const DEFAULT_OPTIONS: NormalizeOptions = {
    arabicLetters: true,
    tehMarbuta: false,
    presentationForms: true,
    tatweel: true,
    diacritics: false,
    zwnj: true,
    digits: "arabic-to-persian",
    punctuationSpacing: false,
};

export type RuleId = Exclude<keyof NormalizeOptions, "digits"> | "digits";

export interface NormalizeResult {
    text: string;
    /** How many changes each rule made. */
    counts: Partial<Record<RuleId, number>>;
}

const ZWNJ = "‌";
const PERSIAN_ZERO = 0x06f0;
const ARABIC_ZERO = 0x0660;

type Step = { id: RuleId; apply: (text: string) => [string, number] };

/** Replaces every match and counts the matches. */
function replaceCounting(
    text: string,
    pattern: RegExp,
    replacement: (match: string) => string,
): [string, number] {
    let count = 0;
    const out = text.replace(pattern, (match) => {
        const next = replacement(match);
        if (next !== match) count++;
        return next;
    });
    return [out, count];
}

function steps(options: NormalizeOptions): Step[] {
    const list: Step[] = [];
    if (options.presentationForms) {
        list.push({
            id: "presentationForms",
            apply: (text) =>
                replaceCounting(text, /[ﭐ-﷿ﹰ-﻿]/g, (c) =>
                    // U+FEFF is the byte order mark, not a letter. Keep it.
                    c === "﻿" ? c : c.normalize("NFKC"),
                ),
        });
    }
    if (options.arabicLetters) {
        list.push({
            id: "arabicLetters",
            apply: (text) => replaceCounting(text, /[يىك]/g, (c) => (c === "ك" ? "ک" : "ی")),
        });
    }
    if (options.tehMarbuta) {
        list.push({ id: "tehMarbuta", apply: (text) => replaceCounting(text, /ة/g, () => "ه") });
    }
    if (options.tatweel) {
        list.push({ id: "tatweel", apply: (text) => replaceCounting(text, /ـ/g, () => "") });
    }
    if (options.diacritics) {
        list.push({ id: "diacritics", apply: (text) => replaceCounting(text, /[ً-ٰٟ]/g, () => "") });
    }
    if (options.zwnj) {
        list.push({
            id: "zwnj",
            apply: (text) => {
                let count = 0;
                // Several ZWNJ in a row become one.
                let out = text.replace(/‌{2,}/g, () => {
                    count++;
                    return ZWNJ;
                });
                // A ZWNJ next to whitespace or at the start or end of the text has no effect.
                out = out.replace(/‌(?=\s|$)|(?<=\s|^)‌/g, () => {
                    count++;
                    return "";
                });
                return [out, count];
            },
        });
    }
    if (options.digits !== "keep") {
        list.push({ id: "digits", apply: (text) => convertDigits(text, options.digits) });
    }
    if (options.punctuationSpacing) {
        list.push({
            id: "punctuationSpacing",
            apply: (text) => {
                let count = 0;
                // No space before the mark. Only when Persian text is before it, so
                // "a : b" in code or English is not touched.
                let out = text.replace(/(?<=[؀-ۿ])[ \t]+(?=[،؛؟!.:](?:\s|$))/g, () => {
                    count++;
                    return "";
                });
                // A space after ، ؛ ؟ when a letter follows directly.
                out = out.replace(/([،؛؟])(?=[؀-ۿA-Za-z])/g, (mark: string) => {
                    count++;
                    return `${mark} `;
                });
                return [out, count];
            },
        });
    }
    return list;
}

export function convertDigits(text: string, mode: DigitMode): [string, number] {
    if (mode === "keep") return [text, 0];
    const pattern =
        mode === "arabic-to-persian" ? /[٠-٩]/g : mode === "to-persian" ? /[0-9٠-٩]/g : /[۰-۹٠-٩]/g;
    return replaceCounting(text, pattern, (d) => {
        const code = d.codePointAt(0) as number;
        const value =
            code <= 0x39
                ? code - 0x30
                : code >= PERSIAN_ZERO
                  ? code - PERSIAN_ZERO
                  : code - ARABIC_ZERO;
        return mode === "to-latin" ? String(value) : String.fromCodePoint(PERSIAN_ZERO + value);
    });
}

export function normalizePersian(
    text: string,
    options: NormalizeOptions = DEFAULT_OPTIONS,
): NormalizeResult {
    const counts: NormalizeResult["counts"] = {};
    let out = text;
    for (const step of steps(options)) {
        const [next, count] = step.apply(out);
        out = next;
        if (count > 0) counts[step.id] = (counts[step.id] ?? 0) + count;
    }
    return { text: out, counts };
}
