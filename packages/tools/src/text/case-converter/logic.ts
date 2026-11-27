/*
 * Letter case conversion. Only scripts with letter case change: Persian and
 * Arabic text, digits, and symbols stay as they are. The conversion does not
 * depend on the browser language, so "i" never becomes the Turkish "İ".
 */

export type CaseMode = "upper" | "lower" | "title" | "sentence";

export const CASE_MODES: readonly CaseMode[] = ["upper", "lower", "title", "sentence"];

/*
 * Words that Chicago style writes in lowercase inside a title: articles,
 * coordinating conjunctions, "to" and "as", and prepositions. "up", "down",
 * "out", "off", and "over" are not in the list, because in titles they are
 * usually part of a phrasal verb ("Set Up", "Log Out"), which Chicago
 * capitalizes.
 */
const MINOR_WORDS = new Set([
    "a",
    "an",
    "the",
    "and",
    "but",
    "or",
    "nor",
    "for",
    "so",
    "yet",
    "as",
    "to",
    "about",
    "above",
    "across",
    "after",
    "against",
    "along",
    "amid",
    "among",
    "around",
    "at",
    "before",
    "behind",
    "below",
    "beneath",
    "beside",
    "besides",
    "between",
    "beyond",
    "by",
    "despite",
    "during",
    "except",
    "from",
    "in",
    "inside",
    "into",
    "like",
    "near",
    "of",
    "on",
    "onto",
    "opposite",
    "outside",
    "past",
    "per",
    "since",
    "than",
    "through",
    "throughout",
    "till",
    "toward",
    "towards",
    "under",
    "underneath",
    "unlike",
    "until",
    "upon",
    "versus",
    "via",
    "with",
    "within",
    "without",
]);

/** A word: letters, marks, and digits, with apostrophes inside. */
const WORD = /[\p{L}\p{M}\p{N}]+(?:['’][\p{L}\p{M}\p{N}]+)*/gu;
/** Punctuation that starts a new part of a title (a subtitle) or a new sentence. */
const TITLE_BREAK = /[:.!?؟…—–]|\s-\s/u;
const SENTENCE_END = /[.!?؟…]["'”’»)\]]*\s/u;
const CASED = /\p{Lu}|\p{Ll}/u;

/** Upper-cases the first letter of a word and keeps the rest. */
function capitalize(word: string): string {
    return word.replace(/\p{L}/u, (letter) => letter.toUpperCase());
}

/**
 * True for a word that the author wrote with a capital after the first letter,
 * such as "iPhone", "NASA", or "McDonald". Such words keep their case.
 */
function hasInnerCapital(word: string): boolean {
    return /\p{Lu}/u.test(word.slice(1));
}

/**
 * True when every cased letter of the text is upper case. Such a text gives no
 * information about acronyms, so title and sentence case lowercase it first.
 */
function isAllUpper(text: string): boolean {
    return CASED.test(text) && text === text.toUpperCase();
}

interface Match {
    word: string;
    start: number;
    end: number;
}

/**
 * The words that hold a cased letter. Persian words and numbers stay as they
 * are, and they do not count as the first or the last word.
 */
function words(line: string): Match[] {
    return Array.from(line.matchAll(WORD), (m) => ({
        word: m[0],
        start: m.index,
        end: m.index + m[0].length,
    })).filter((match) => CASED.test(match.word));
}

/**
 * Chicago title case, one line at a time. Capitalize the first and the last
 * word of each part (the parts split at : . ! ? … and dashes) and every word
 * that is not a minor word. Each part of a hyphenated compound follows the
 * same rule, so "step-by-step" becomes "Step-by-Step".
 */
function titleLine(line: string, keepInner: boolean): string {
    const found = words(line);
    let out = "";
    let last = 0;
    found.forEach((match, index) => {
        const previous = found[index - 1];
        const next = found[index + 1];
        const first = !previous || TITLE_BREAK.test(line.slice(previous.end, match.start));
        const final = !next || TITLE_BREAK.test(line.slice(match.end, next.start));
        let word = match.word;
        if (!(keepInner && hasInnerCapital(word))) {
            const lower = word.toLowerCase();
            word = first || final || !MINOR_WORDS.has(lower) ? capitalize(lower) : lower;
        }
        out += line.slice(last, match.start) + word;
        last = match.end;
    });
    return out + line.slice(last);
}

/**
 * Sentence case: lowercase each word, then capitalize the first word of each
 * sentence and of each line, and the pronoun "I".
 */
function sentenceText(text: string, keepInner: boolean): string {
    const found = words(text);
    let out = "";
    let last = 0;
    found.forEach((match, index) => {
        const previous = found[index - 1];
        const gap = text.slice(previous ? previous.end : 0, match.start);
        const first = !previous || SENTENCE_END.test(gap) || /[\r\n]/.test(gap);
        let word = match.word;
        if (!(keepInner && hasInnerCapital(word))) {
            const lower = word.toLowerCase();
            word = first || /^i(?:['’]\p{L}+)?$/u.test(lower) ? capitalize(lower) : lower;
        }
        out += text.slice(last, match.start) + word;
        last = match.end;
    });
    return out + text.slice(last);
}

export function convertCase(text: string, mode: CaseMode): string {
    switch (mode) {
        case "upper":
            return text.toUpperCase();
        case "lower":
            return text.toLowerCase();
        case "title": {
            const keepInner = !isAllUpper(text);
            return text
                .split(/(\r\n|\r|\n)/)
                .map((part, index) => (index % 2 === 1 ? part : titleLine(part, keepInner)))
                .join("");
        }
        case "sentence":
            return sentenceText(text, !isAllUpper(text));
    }
}
