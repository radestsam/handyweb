import { createTwoFilesPatch, diffChars, diffLines, diffWords, type Change } from "diff";
import { ToolFailure } from "@handyweb/core/runtime";

export type Granularity = "lines" | "words" | "chars";

export interface DiffInput {
    original: string;
    changed: string;
    granularity: Granularity;
    /** Lines: ignore spaces at the start and end of a line. */
    ignoreWhitespace: boolean;
    /** Words and characters: compare "A" and "a" as equal. */
    ignoreCase: boolean;
}

export interface DiffPart {
    value: string;
    added: boolean;
    removed: boolean;
}

export interface DiffOutput {
    parts: DiffPart[];
    /** Added and removed units: lines, words, or characters. */
    added: number;
    removed: number;
    identical: boolean;
    /** A unified diff of the lines, as `diff -u` writes it. */
    patch: string;
}

/** The diff gives up after this time, so a very different large input cannot hang. */
const TIMEOUT_MS = 10_000;
/** Character diffs grow fast with the input size. Above this, use words or lines. */
export const MAX_CHAR_INPUT = 200_000;

const wordSegmenter =
    typeof Intl !== "undefined" && "Segmenter" in Intl
        ? new Intl.Segmenter("fa", { granularity: "word" })
        : undefined;

function tooComplex(): ToolFailure {
    return new ToolFailure(
        "too-large",
        {
            fa: "دو نوشته بیش از اندازه با هم فرق دارند و سنجش آن‌ها زمان زیادی می‌برد. سنجش خط به خط را برگزینید یا نوشته کوتاه‌تری بدهید.",
            en: "The two texts are too different to compare in time. Compare by lines, or use a shorter text.",
        },
        "timeout",
    );
}

/** Counts the units of a part: lines, words (not whitespace), or characters. */
function units(part: Change, granularity: Granularity): number {
    if (granularity === "lines") return part.count;
    if (granularity === "chars") return [...part.value].length;
    return part.value.split(/\s+/).filter((word) => word !== "").length;
}

export function compareTexts(input: DiffInput): DiffOutput {
    const { original, changed, granularity } = input;
    if (granularity === "chars" && original.length + changed.length > MAX_CHAR_INPUT) {
        throw new ToolFailure(
            "too-large",
            {
                fa: "برای سنجش نویسه به نویسه، این نوشته‌ها بزرگ‌اند. سنجش واژه به واژه یا خط به خط را برگزینید.",
                en: "These texts are too large to compare by characters. Compare by words or by lines.",
            },
            "chars limit",
        );
    }
    let parts: Change[] | undefined;
    if (granularity === "lines") {
        parts = diffLines(original, changed, {
            ignoreWhitespace: input.ignoreWhitespace,
            timeout: TIMEOUT_MS,
        });
    } else if (granularity === "words") {
        parts = diffWords(original, changed, {
            ignoreCase: input.ignoreCase,
            intlSegmenter: wordSegmenter,
            timeout: TIMEOUT_MS,
        });
    } else {
        parts = diffChars(original, changed, { ignoreCase: input.ignoreCase, timeout: TIMEOUT_MS });
    }
    if (!parts) throw tooComplex();

    let added = 0;
    let removed = 0;
    for (const part of parts) {
        if (part.added) added += units(part, granularity);
        if (part.removed) removed += units(part, granularity);
    }
    const patch =
        createTwoFilesPatch("original", "changed", original, changed, undefined, undefined, {
            context: 3,
            timeout: TIMEOUT_MS,
        }) ?? "";
    return {
        parts: parts.map(({ value, added: a, removed: r }) => ({ value, added: a, removed: r })),
        added,
        removed,
        identical: added === 0 && removed === 0,
        patch,
    };
}
