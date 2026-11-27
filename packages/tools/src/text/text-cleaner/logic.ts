/*
 * Text cleanup: whitespace and invisible characters. Each rule is a separate
 * option, and the result counts what each rule changed. The cleaner never
 * removes ZWNJ (U+200C) or ZWJ (U+200D): Persian words and emoji need them.
 * Letters and digits are the job of the Persian normalizer.
 */

export type EmptyLineMode = "keep" | "collapse" | "remove";

export interface CleanOptions {
    /** C0 and C1 control characters, apart from tab and the line breaks. */
    controlChars: boolean;
    /** ZWSP, word joiner, BOM, soft hyphen, and other zero-width characters. */
    zeroWidth: boolean;
    /** LRM, RLM, ALM, and the bidi embedding, override, and isolate controls. */
    bidiControls: boolean;
    /** No-break and other Unicode spaces to a normal space; line and paragraph separators to a line break. */
    unicodeSpaces: boolean;
    /** Runs of spaces and tabs inside a line to one space. */
    collapseSpaces: boolean;
    /** Spaces and tabs at the start and end of each line. */
    trimLines: boolean;
    /** `collapse` keeps at most one empty line in a row. Empty lines at the start and end go too. */
    emptyLines: EmptyLineMode;
}

export type CleanRule = Exclude<keyof CleanOptions, "emptyLines"> | "emptyLines";

export const DEFAULT_OPTIONS: CleanOptions = {
    controlChars: true,
    zeroWidth: true,
    bidiControls: false,
    unicodeSpaces: true,
    collapseSpaces: true,
    trimLines: true,
    emptyLines: "collapse",
};

/** The Persian preset also removes the direction marks that word processors add. */
export const PERSIAN_OPTIONS: CleanOptions = { ...DEFAULT_OPTIONS, bidiControls: true };

export interface CleanResult {
    text: string;
    /** Changes per rule. A rule that changed nothing is not in the object. */
    counts: Partial<Record<CleanRule, number>>;
}

const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;
const ZERO_WIDTH = /[\u00AD\u180E\u200B\u2060-\u2064\uFEFF]/g;
const BIDI = /[\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/g;
const UNICODE_SPACE = /[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g;
const LINE_SEPARATOR = /[\u2028\u2029]/g;
const SPACE_RUN = /[ \t]{2,}|\t/g;
const EDGE_SPACE = /^[ \t]+|[ \t]+$/gm;

export function cleanText(text: string, options: CleanOptions = DEFAULT_OPTIONS): CleanResult {
    const counts: CleanResult["counts"] = {};
    const add = (rule: CleanRule, n: number) => {
        if (n > 0) counts[rule] = (counts[rule] ?? 0) + n;
    };
    const remove = (rule: CleanRule, pattern: RegExp, replacement = "") => {
        text = text.replace(pattern, (match) => {
            add(rule, match.length);
            return replacement;
        });
    };

    if (options.controlChars) remove("controlChars", CONTROL);
    if (options.zeroWidth) remove("zeroWidth", ZERO_WIDTH);
    if (options.bidiControls) remove("bidiControls", BIDI);
    if (options.unicodeSpaces) {
        remove("unicodeSpaces", UNICODE_SPACE, " ");
        remove("unicodeSpaces", LINE_SEPARATOR, "\n");
    }
    if (options.trimLines) {
        text = text.replace(EDGE_SPACE, () => {
            add("trimLines", 1);
            return "";
        });
    }
    if (options.collapseSpaces) {
        text = text.replace(SPACE_RUN, () => {
            add("collapseSpaces", 1);
            return " ";
        });
    }
    if (options.emptyLines !== "keep" && text !== "") {
        const newline = text.includes("\r\n") ? "\r\n" : "\n";
        const lines = text.split(/\r\n|\r|\n/);
        const blank = (line: string) => line.trim() === "";
        let kept: string[];
        if (options.emptyLines === "remove") {
            kept = lines.filter((line) => !blank(line));
        } else {
            let start = 0;
            let end = lines.length;
            while (start < end && blank(lines[start] as string)) start++;
            while (end > start && blank(lines[end - 1] as string)) end--;
            kept = lines
                .slice(start, end)
                .filter((line, i, all) => !(blank(line) && i > 0 && blank(all[i - 1] as string)));
        }
        add("emptyLines", lines.length - kept.length);
        text = kept.join(newline);
    }
    return { text, counts };
}
