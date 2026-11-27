import { isBlank, joinLines, splitLines } from "../lines";

export interface DedupeOptions {
    /** Compare "Apple" and "apple" as the same line. */
    ignoreCase: boolean;
    /** Compare lines without the spaces at their start and end. */
    trim: boolean;
    /** Remove every empty line, not only the repeated ones. */
    removeEmpty: boolean;
}

export const DEFAULT_OPTIONS: DedupeOptions = {
    ignoreCase: false,
    trim: true,
    removeEmpty: false,
};

export interface DedupeResult {
    text: string;
    /** Lines in the input. */
    total: number;
    /** Lines removed because they repeat an earlier line. */
    duplicates: number;
    /** Empty lines removed by the removeEmpty option. */
    empty: number;
}

/**
 * Keeps the first copy of each line, in the original order. The kept line is
 * the original text, not the trimmed or lowercased key. Empty lines are
 * duplicates of each other, like any other line, unless removeEmpty is on.
 */
export function removeDuplicateLines(
    text: string,
    options: DedupeOptions = DEFAULT_OPTIONS,
): DedupeResult {
    const parsed = splitLines(text);
    const seen = new Set<string>();
    const kept: string[] = [];
    let duplicates = 0;
    let empty = 0;
    for (const line of parsed.lines) {
        if (options.removeEmpty && isBlank(line)) {
            empty++;
            continue;
        }
        let key = options.trim ? line.trim() : line;
        if (options.ignoreCase) key = key.toLowerCase();
        if (seen.has(key)) {
            duplicates++;
            continue;
        }
        seen.add(key);
        kept.push(line);
    }
    return {
        text: joinLines({ ...parsed, lines: kept }),
        total: parsed.lines.length,
        duplicates,
        empty,
    };
}
