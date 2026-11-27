import { splitLines } from "../lines";

export type Direction = "split" | "join";

export interface SplitJoinOptions {
    direction: Direction;
    /** Split: the text between items. Join: the text put between items. "\n" and "\t" are allowed. */
    delimiter: string;
    /** Remove spaces at the start and end of each item. */
    trim: boolean;
    /** Leave out empty items. */
    skipEmpty: boolean;
    /** Join only: put this text before and after each item, such as a quote. */
    wrap: string;
}

/** Reads "\n", "\t", and "\\" in a typed delimiter. */
export function unescapeDelimiter(text: string): string {
    return text.replace(/\\(n|t|\\)/g, (_, char: string) =>
        char === "n" ? "\n" : char === "t" ? "\t" : "\\",
    );
}

/**
 * Split: cuts the text at each delimiter and writes one item per line.
 * Join: reads one item per line and joins them with the delimiter.
 */
export function splitJoin(text: string, options: SplitJoinOptions): string {
    const delimiter = unescapeDelimiter(options.delimiter);
    let items =
        options.direction === "split"
            ? delimiter === ""
                ? [text]
                : text.split(delimiter)
            : splitLines(text).lines;
    if (options.trim) items = items.map((item) => item.trim());
    if (options.skipEmpty) items = items.filter((item) => item !== "");
    if (options.direction === "split") return items.join("\n");
    const wrap = unescapeDelimiter(options.wrap);
    return items.map((item) => wrap + item + wrap).join(delimiter);
}
