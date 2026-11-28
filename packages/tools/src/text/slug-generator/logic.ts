/*
 * URL slugs. "latin" keeps only a-z and 0-9: Persian letters are written in
 * Latin letters, one letter at a time. "persian" keeps Persian letters, which
 * browsers show as they are and send percent-encoded.
 */

export type Script = "latin" | "persian";

export interface SlugOptions {
    script: Script;
    separator: "-" | "_";
    lowercase: boolean;
    /** The longest slug, in characters. 0 means no limit. The cut is at a word edge. */
    maxLength: number;
}

export const DEFAULT_OPTIONS: SlugOptions = {
    script: "latin",
    separator: "-",
    lowercase: true,
    maxLength: 0,
};

/**
 * A simple letter map. Persian does not write short vowels, so the result is
 * an approximation, such as "ktab" for «کتاب».
 */
const TRANSLITERATION: Record<string, string> = {
    ا: "a",
    آ: "a",
    أ: "a",
    إ: "e",
    ب: "b",
    پ: "p",
    ت: "t",
    ث: "s",
    ج: "j",
    چ: "ch",
    ح: "h",
    خ: "kh",
    د: "d",
    ذ: "z",
    ر: "r",
    ز: "z",
    ژ: "zh",
    س: "s",
    ش: "sh",
    ص: "s",
    ض: "z",
    ط: "t",
    ظ: "z",
    ع: "",
    غ: "gh",
    ف: "f",
    ق: "gh",
    ک: "k",
    ك: "k",
    گ: "g",
    ل: "l",
    م: "m",
    ن: "n",
    و: "v",
    ؤ: "v",
    ه: "h",
    ة: "h",
    ی: "i",
    ي: "i",
    ى: "i",
    ئ: "y",
    ء: "",
};

function persianDigitsToLatin(text: string): string {
    return text
        .replace(/[۰-۹]/g, (d) => String((d.codePointAt(0) as number) - 0x06f0))
        .replace(/[٠-٩]/g, (d) => String((d.codePointAt(0) as number) - 0x0660));
}

export function slugify(text: string, options: SlugOptions = DEFAULT_OPTIONS): string {
    let value = persianDigitsToLatin(text)
        // Arabic yeh and kaf become the Persian letters.
        .replace(/ي|ى/g, "ی")
        .replace(/ك/g, "ک")
        // Remove diacritics (é to e, harakat), tatweel, and ZWNJ joins words.
        .normalize("NFKD")
        .replace(/[\u0300-\u036f\u064b-\u065f\u0670\u0640]/g, "")
        .replace(/\u200c/g, " ");
    if (options.lowercase) value = value.toLowerCase();
    if (options.script === "latin") {
        value = value.replace(/[\u0600-\u06ff]/g, (char) => TRANSLITERATION[char] ?? "");
        value = value.replace(/[^A-Za-z0-9]+/g, " ");
    } else {
        value = value.replace(/[^\p{L}\p{N}]+/gu, " ");
    }
    let words = value.trim().split(/\s+/).filter(Boolean);
    if (options.maxLength > 0) {
        const kept: string[] = [];
        for (const word of words) {
            const length = [...kept, word].join(options.separator).length;
            if (length > options.maxLength) break;
            kept.push(word);
        }
        // A first word longer than the limit is cut.
        words = kept.length > 0 ? kept : [words[0]?.slice(0, options.maxLength) ?? ""];
    }
    return words.join(options.separator);
}
