/*
 * Text statistics. The rules are simple and the same in every browser, so a
 * count can be checked by hand. The FAQ in meta.ts describes them for users.
 */

export interface TextStats {
    /** User-perceived characters (grapheme clusters). */
    characters: number;
    /** Characters that are not whitespace. */
    charactersNoSpaces: number;
    words: number;
    /** 0 for an empty text. A final line break does not start a new line. */
    lines: number;
    /** Blocks of text between empty lines. */
    paragraphs: number;
    /** An estimate. See countSentences. */
    sentences: number;
}

/** The default reading rate, in words per minute. */
export const DEFAULT_WORDS_PER_MINUTE = 200;
export const MIN_WORDS_PER_MINUTE = 50;
export const MAX_WORDS_PER_MINUTE = 1000;

/*
 * A word is a run of letters, marks, and digits. These characters join two
 * runs into one word:
 * - ZWNJ (U+200C) and ZWJ (U+200D), so "می‌روم" and "کتاب‌ها" are one word.
 * - An apostrophe (' or ’) and a hyphen, so "don't" and "well-known" are one word.
 * - A decimal or group separator (. , ٫ ٬ /) between two digits, so "3.14",
 *   "1,000", "۱٬۰۰۰", and "۱۴۰۴/۰۹/۰۵" are one word.
 * A space, any other punctuation, and a symbol separate words. Tatweel (ـ) is a
 * letter modifier, so it stays inside the word.
 */
const WORD =
    /[\p{L}\p{M}\p{N}]+(?:(?:[\u200C\u200D'’-]|(?<=\p{N})[.,٫٬/](?=\p{N}))[\p{L}\p{M}\p{N}]+)*/gu;

/** Marks that end a sentence: . ! ? ؟ … and the Arabic full stop ۔ */
const SENTENCE_END = /[.!?؟…۔]+["'”’»)\]]*(?=\s|$)/gu;
const HAS_WORD = /[\p{L}\p{N}]/u;
const LINE_BREAK = /\r\n|\r|\n/;
const PARAGRAPH_BREAK = /(?:\r\n|\r|\n)[^\S\r\n]*(?:(?:\r\n|\r|\n)[^\S\r\n]*)+/;

const graphemes =
    typeof Intl !== "undefined" && "Segmenter" in Intl
        ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
        : null;

/** Counts graphemes, or code points where Intl.Segmenter is not available. */
function countCharacters(text: string): { all: number; noSpaces: number } {
    let all = 0;
    let noSpaces = 0;
    const parts = graphemes ? Array.from(graphemes.segment(text), (s) => s.segment) : [...text];
    for (const part of parts) {
        all++;
        if (!/^\s+$/u.test(part)) noSpaces++;
    }
    return { all, noSpaces };
}

export function countWords(text: string): number {
    return text.match(WORD)?.length ?? 0;
}

export function countLines(text: string): number {
    if (text === "") return 0;
    const lines = text.split(LINE_BREAK);
    if (lines.length > 1 && lines[lines.length - 1] === "") lines.pop();
    return lines.length;
}

export function countParagraphs(text: string): number {
    return text.split(PARAGRAPH_BREAK).filter((block) => HAS_WORD.test(block)).length;
}

/**
 * An estimate. A sentence ends at . ! ? ؟ … or ۔ before a space or the end of
 * the text, or at an empty line. A part that holds no letter or digit is not a
 * sentence. A final part without an end mark still counts. Abbreviations such
 * as "e.g." count as a sentence end.
 */
export function countSentences(text: string): number {
    return text
        .split(SENTENCE_END)
        .flatMap((part) => part.split(PARAGRAPH_BREAK))
        .filter((part) => HAS_WORD.test(part)).length;
}

export function textStats(text: string): TextStats {
    const characters = countCharacters(text);
    return {
        characters: characters.all,
        charactersNoSpaces: characters.noSpaces,
        words: countWords(text),
        lines: countLines(text),
        paragraphs: countParagraphs(text),
        sentences: countSentences(text),
    };
}

/** Reading time in whole seconds, rounded up. */
export function readingSeconds(words: number, wordsPerMinute: number): number {
    const rate = Math.min(
        MAX_WORDS_PER_MINUTE,
        Math.max(MIN_WORDS_PER_MINUTE, Number.isFinite(wordsPerMinute) ? wordsPerMinute : 0),
    );
    return Math.ceil((words * 60) / rate);
}
