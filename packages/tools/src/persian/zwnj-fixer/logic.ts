/*
 * Persian ZWNJ (نیم‌فاصله, U+200C) fixes. Each rule changes a space, or a
 * missing ZWNJ, into a ZWNJ in one common pattern. The rules look only at
 * separate words, so a word such as «میز» or «تنها» never changes.
 */

const ZWNJ = "\u200c";
/** A Persian letter. */
const L = "[\\u0621-\\u064a\\u067e\\u0686\\u0698\\u06a9\\u06af\\u06cc]";
/** The edge of a word: not a Persian letter, a ZWNJ, or a diacritic. */
const START = `(?<![\\u0600-\\u06ff\\u200c])`;
const END = `(?![\\u0600-\\u06ff\\u200c])`;

export type ZwnjRule = "prefix" | "plural" | "comparative" | "heSuffix";
export const ZWNJ_RULES: readonly ZwnjRule[] = ["prefix", "plural", "comparative", "heSuffix"];

const PATTERNS: Record<ZwnjRule, RegExp> = {
    // «می روم»، «نمی دانم» → «می‌روم»، «نمی‌دانم»
    prefix: new RegExp(`${START}(ن?می) +(?=${L})`, "gu"),
    // «کتاب ها»، «کتاب های» → «کتاب‌ها»، «کتاب‌های»
    plural: new RegExp(`(${L}) +(ها(?:ی|یی|یم|یت|یش|یمان|یتان|یشان)?)${END}`, "gu"),
    // «بزرگ تر»، «بزرگ ترین» → «بزرگ‌تر»، «بزرگ‌ترین»
    comparative: new RegExp(`(${L}) +(ترین|تر)${END}`, "gu"),
    // «خانه ای»، «خانه ام» → «خانه‌ای»، «خانه‌ام»
    heSuffix: new RegExp(`(${L}ه) +(ای|ایم|اید|اند|ام|ات|اش)${END}`, "gu"),
};

export type ZwnjOptions = Record<ZwnjRule, boolean>;
export const DEFAULT_OPTIONS: ZwnjOptions = {
    prefix: true,
    plural: true,
    comparative: true,
    heSuffix: true,
};

export interface ZwnjResult {
    text: string;
    counts: Partial<Record<ZwnjRule, number>>;
}

export function fixZwnj(text: string, options: ZwnjOptions = DEFAULT_OPTIONS): ZwnjResult {
    const counts: ZwnjResult["counts"] = {};
    let out = text;
    for (const rule of ZWNJ_RULES) {
        if (!options[rule]) continue;
        out = out.replace(PATTERNS[rule], (...args: string[]) => {
            counts[rule] = (counts[rule] ?? 0) + 1;
            if (rule === "prefix") return `${args[1] as string}${ZWNJ}`;
            return `${args[1] as string}${ZWNJ}${args[2] as string}`;
        });
    }
    return { text: out, counts };
}
