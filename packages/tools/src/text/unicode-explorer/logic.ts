import { NAME_BLOCKS } from "./names";

export type CategoryGroup =
    | "letter"
    | "mark"
    | "number"
    | "punctuation"
    | "symbol"
    | "separator"
    | "control"
    | "format"
    | "surrogate"
    | "private"
    | "unassigned";

export interface CodePointInfo {
    /** The character itself. */
    char: string;
    code: number;
    /** U+XXXX */
    label: string;
    /** The Unicode name, or "" when it is not in the included blocks. */
    name: string;
    /** The block, or "" when it is not in the included blocks. */
    block: string;
    /** The two-letter general category, such as "Lo" or "Cf". */
    category: string;
    group: CategoryGroup;
    /** The script, such as "Arabic", "Latin", "Common", or "Inherited". */
    script: string;
    /** UTF-8 bytes as hex, such as "D8 B3". */
    utf8: string;
    /** UTF-16 code units as hex, such as "D83D DE00". */
    utf16: string;
    /** The character takes no space or cannot be seen, so the UI shows a placeholder. */
    invisible: boolean;
}

const CATEGORIES = [
    "Lu",
    "Ll",
    "Lt",
    "Lm",
    "Lo",
    "Mn",
    "Mc",
    "Me",
    "Nd",
    "Nl",
    "No",
    "Pc",
    "Pd",
    "Ps",
    "Pe",
    "Pi",
    "Pf",
    "Po",
    "Sm",
    "Sc",
    "Sk",
    "So",
    "Zs",
    "Zl",
    "Zp",
    "Cc",
    "Cf",
    "Cs",
    "Co",
    "Cn",
] as const;

const GROUPS: Record<string, CategoryGroup> = {
    L: "letter",
    M: "mark",
    N: "number",
    P: "punctuation",
    S: "symbol",
    Z: "separator",
    Cc: "control",
    Cf: "format",
    Cs: "surrogate",
    Co: "private",
    Cn: "unassigned",
};

/** The scripts that the explorer names. Others show as "Other". */
const SCRIPTS = [
    "Arabic",
    "Latin",
    "Common",
    "Inherited",
    "Greek",
    "Cyrillic",
    "Hebrew",
    "Armenian",
    "Georgian",
    "Devanagari",
    "Bengali",
    "Thai",
    "Han",
    "Hiragana",
    "Katakana",
    "Hangul",
    "Syriac",
    "Thaana",
    "Ethiopic",
] as const;

const categoryTests = CATEGORIES.map(
    (category) => [category, new RegExp(`^\\p{gc=${category}}$`, "u")] as const,
);
const scriptTests = SCRIPTS.map(
    (script) => [script, new RegExp(`^\\p{sc=${script}}$`, "u")] as const,
);

const hex = (n: number, width: number) => n.toString(16).toUpperCase().padStart(width, "0");
const encoder = new TextEncoder();

let blocks: Array<{ start: number; end: number; block: string; names: string[] }> | null = null;

/** Splits the names of a block only when a code point of that block is looked up. */
function lookup(code: number): { name: string; block: string } {
    blocks ??= NAME_BLOCKS.map(([start, block, names]) => ({
        start,
        end: start + names.split("|").length - 1,
        block,
        names: [],
    }));
    for (let i = 0; i < blocks.length; i++) {
        const entry = blocks[i] as (typeof blocks)[number];
        if (code < entry.start || code > entry.end) continue;
        if (entry.names.length === 0)
            entry.names = (NAME_BLOCKS[i] as (typeof NAME_BLOCKS)[number])[2].split("|");
        return { name: entry.names[code - entry.start] ?? "", block: entry.block };
    }
    // Names that follow a rule (Unicode section 4.8).
    if (
        (code >= 0x4e00 && code <= 0x9fff) ||
        (code >= 0x3400 && code <= 0x4dbf) ||
        (code >= 0x20000 && code <= 0x2a6df)
    ) {
        return { name: `CJK UNIFIED IDEOGRAPH-${hex(code, 4)}`, block: "" };
    }
    return { name: "", block: "" };
}

export function inspectChar(char: string): CodePointInfo {
    const code = char.codePointAt(0) as number;
    const category = categoryTests.find(([, test]) => test.test(char))?.[0] ?? "Cn";
    const group = GROUPS[category] ?? GROUPS[category[0] as string] ?? "unassigned";
    const script = scriptTests.find(([, test]) => test.test(char))?.[0] ?? "Other";
    const utf16 = Array.from({ length: char.length }, (_, i) => hex(char.charCodeAt(i), 4)).join(
        " ",
    );
    // A lone surrogate has no UTF-8 form. TextEncoder would write U+FFFD for it.
    const utf8 =
        group === "surrogate"
            ? ""
            : Array.from(encoder.encode(char), (byte) => hex(byte, 2)).join(" ");
    const { name, block } = lookup(code);
    return {
        char,
        code,
        label: `U+${hex(code, 4)}`,
        name,
        block,
        category,
        group,
        script,
        utf8,
        utf16,
        invisible:
            group === "control" ||
            group === "format" ||
            group === "separator" ||
            group === "surrogate" ||
            group === "unassigned" ||
            (code >= 0xfe00 && code <= 0xfe0f),
    };
}

export interface Inspection {
    rows: CodePointInfo[];
    /** Code points in the whole text. */
    codePoints: number;
    /** User-perceived characters in the whole text. */
    graphemes: number;
    utf8Bytes: number;
    utf16Units: number;
    /** The text has more code points than the row limit. */
    truncated: boolean;
}

const graphemeSegmenter =
    typeof Intl !== "undefined" && "Segmenter" in Intl
        ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
        : null;

/** Inspects each code point, up to `limit` rows. The counts cover the whole text. */
export function inspectText(text: string, limit = 1000): Inspection {
    const chars = Array.from(text);
    return {
        rows: chars.slice(0, limit).map(inspectChar),
        codePoints: chars.length,
        graphemes: graphemeSegmenter
            ? Array.from(graphemeSegmenter.segment(text)).length
            : chars.length,
        utf8Bytes: encoder.encode(text).length,
        utf16Units: text.length,
        truncated: chars.length > limit,
    };
}

/** The rows as tab-separated text, for a spreadsheet. */
export function toTsv(rows: readonly CodePointInfo[]): string {
    const head = "Character\tCode point\tName\tCategory\tScript\tUTF-8\tUTF-16";
    const lines = rows.map((row) =>
        [
            row.invisible ? "" : row.char,
            row.label,
            row.name,
            row.category,
            row.script,
            row.utf8,
            row.utf16,
        ].join("\t"),
    );
    return [head, ...lines].join("\n");
}
