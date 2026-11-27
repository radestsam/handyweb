import { joinLines, splitLines } from "../lines";

export type ReverseMode = "characters" | "words" | "lines";
export const REVERSE_MODES: readonly ReverseMode[] = ["characters", "words", "lines"];

const graphemes =
    typeof Intl !== "undefined" && "Segmenter" in Intl
        ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
        : null;

/**
 * Reverses the visible characters of one line. A letter with its diacritics,
 * or an emoji made of several code points, stays one unit, so the result has
 * no broken characters.
 */
function reverseCharacters(line: string): string {
    const parts = graphemes ? Array.from(graphemes.segment(line), (s) => s.segment) : [...line];
    return parts.reverse().join("");
}

/** Reverses the order of the words of a line. The spaces between words keep their places. */
function reverseWords(line: string): string {
    const tokens = line.split(/(\s+)/);
    const words = tokens.filter((_, i) => i % 2 === 0).reverse();
    return tokens.map((token, i) => (i % 2 === 0 ? (words[i / 2] as string) : token)).join("");
}

/** Reverses each line on its own, or the order of the lines. Line breaks stay. */
export function reverseText(text: string, mode: ReverseMode): string {
    const parsed = splitLines(text);
    const lines =
        mode === "lines"
            ? [...parsed.lines].reverse()
            : parsed.lines.map(mode === "characters" ? reverseCharacters : reverseWords);
    return joinLines({ ...parsed, lines });
}
