import { isBlank, joinLines, splitLines } from "../lines";

export type SortOrder = "ascending" | "descending" | "reverse";

export interface SortOptions {
    /** `reverse` keeps the current order and turns it upside down. */
    order: SortOrder;
    /** Compare the digits in a line as numbers, so "item 2" comes before "item 10". */
    natural: boolean;
    /** Compare "Apple" and "apple" as equal. Equal lines keep their input order. */
    ignoreCase: boolean;
    removeEmpty: boolean;
}

export const DEFAULT_OPTIONS: SortOptions = {
    order: "ascending",
    natural: true,
    ignoreCase: true,
    removeEmpty: false,
};

/**
 * Sorts with the Persian collation of the browser (Intl.Collator "fa"). It
 * puts Persian letters in Persian alphabet order (ب پ ت … چ … ژ … گ), and
 * Persian words before Latin words. Natural sort reads Persian, Arabic-Indic,
 * and Latin digits as numbers. The sort is stable.
 */
export function sortLines(text: string, options: SortOptions = DEFAULT_OPTIONS): string {
    const parsed = splitLines(text);
    let lines = options.removeEmpty
        ? parsed.lines.filter((line) => !isBlank(line))
        : [...parsed.lines];
    if (options.order === "reverse") {
        lines.reverse();
    } else {
        const collator = new Intl.Collator("fa", {
            numeric: options.natural,
            sensitivity: options.ignoreCase ? "accent" : "variant",
            caseFirst: options.ignoreCase ? "false" : "upper",
        });
        const sign = options.order === "descending" ? -1 : 1;
        lines = lines.sort((a, b) => sign * collator.compare(a, b));
    }
    return joinLines({ ...parsed, lines });
}
