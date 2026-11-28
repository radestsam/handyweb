/*
 * Persian punctuation fixes. A rule changes a mark only next to Persian
 * text, so English text, numbers, and code stay as they are.
 */

/** A Persian or Arabic letter. */
const FA = "[\\u0600-\\u06ff\\u200c]";
const FA_LETTER = "[\\u0621-\\u064a\\u067e\\u0686\\u0698\\u06a9\\u06af\\u06cc]";

export type PunctuationRule = "marks" | "quotes" | "spacing" | "brackets" | "ellipsis";
export const PUNCTUATION_RULES: readonly PunctuationRule[] = [
    "marks",
    "quotes",
    "spacing",
    "brackets",
    "ellipsis",
];

export type PunctuationOptions = Record<PunctuationRule, boolean>;
export const DEFAULT_OPTIONS: PunctuationOptions = {
    marks: true,
    quotes: true,
    spacing: true,
    brackets: true,
    ellipsis: false,
};

export interface PunctuationResult {
    text: string;
    counts: Partial<Record<PunctuationRule, number>>;
}

type Step = [RegExp, string | ((...args: string[]) => string)];

const STEPS: Record<PunctuationRule, Step[]> = {
    // Latin , ; ? after a Persian word become ، ؛ ؟
    marks: [
        [new RegExp(`(${FA_LETTER}) ?,(?!\\d)`, "gu"), "$1،"],
        [new RegExp(`(${FA_LETTER}) ?;`, "gu"), "$1؛"],
        [new RegExp(`(${FA_LETTER}) ?\\?`, "gu"), "$1؟"],
    ],
    // "متن" becomes «متن» when the quoted text has a Persian letter.
    quotes: [[new RegExp(`"([^"\\n]*${FA_LETTER}[^"\\n]*)"`, "gu"), "«$1»"]],
    // No space before ، ؛ ؟ ! . : and one space after them, when Persian text follows.
    spacing: [
        [new RegExp(`(${FA}) +([،؛؟!.:])`, "gu"), "$1$2"],
        [new RegExp(`([،؛؟!:])(?=${FA_LETTER})`, "gu"), "$1 "],
        [new RegExp(`(${FA_LETTER}\\.)(?=${FA_LETTER})`, "gu"), "$1 "],
        [new RegExp(`([،؛؟]) {2,}`, "gu"), "$1 "],
    ],
    // No space just inside ( ) « » [ ].
    brackets: [
        [new RegExp(`([(«\\[]) +(?=${FA})`, "gu"), "$1"],
        [new RegExp(`(${FA}) +([)»\\]])`, "gu"), "$1$2"],
    ],
    // ... after Persian text becomes …
    ellipsis: [[new RegExp(`(${FA}) ?\\.{3}`, "gu"), "$1…"]],
};

export function fixPunctuation(
    text: string,
    options: PunctuationOptions = DEFAULT_OPTIONS,
): PunctuationResult {
    const counts: PunctuationResult["counts"] = {};
    let out = text;
    for (const rule of PUNCTUATION_RULES) {
        if (!options[rule]) continue;
        for (const [pattern, replacement] of STEPS[rule]) {
            out = out.replace(pattern, (...args: unknown[]) => {
                const match = args[0] as string;
                const groups = args.slice(1, -2) as string[];
                const next =
                    typeof replacement === "string"
                        ? replacement.replace(
                              /\$(\d)/g,
                              (_, n: string) => groups[Number(n) - 1] ?? "",
                          )
                        : replacement(match, ...groups);
                if (next !== match) counts[rule] = (counts[rule] ?? 0) + 1;
                return next;
            });
        }
    }
    return { text: out, counts };
}
