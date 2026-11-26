import { ToolFailure } from "@handyweb/core/runtime";
import { scanJson, type ScanError, type ScanWarning } from "./scan";

export type Indent = "2" | "4" | "tab";
export type Action = "format" | "minify" | "validate";

export interface JsonInput {
    text: string;
    action: Action;
    indent: Indent;
    sortKeys: boolean;
}

export interface JsonOutput {
    output: string;
    warnings: ScanWarning[];
}

const REASONS: Record<ScanError["reason"], { fa: string; en: string }> = {
    "unexpected-end": { fa: "JSON پیش از پایان بریده شده است.", en: "The JSON ends too early." },
    "unexpected-character": { fa: "نویسه نابجا", en: "Unexpected character" },
    "trailing-comma": {
        fa: "ویرگول زیادی پیش از بسته شدن آرایه یا آبجکت",
        en: "Extra comma before the end of an array or object",
    },
    "bad-escape": {
        fa: "escape نادرست در رشته",
        en: "Invalid escape sequence in a string",
    },
    "control-character": {
        fa: "نویسه کنترلی (مانند خط تازه) درون رشته. به جای آن \\n بنویسید.",
        en: "Control character (such as a line break) inside a string. Use \\n.",
    },
    "bad-number": { fa: "شماره نادرست", en: "Invalid number" },
    "extra-content": {
        fa: "نوشته زیادی پس از پایان JSON",
        en: "Extra text after the end of the JSON",
    },
};

/** Validates, then formats or minifies. Throws a ToolFailure with the line and column. */
export function processJson({ text, action, indent, sortKeys }: JsonInput): JsonOutput {
    const scan = scanJson(text);
    if (!scan.ok) {
        const { line, column, reason, found } = scan.error;
        const where = { fa: `خط ${line}، ستون ${column}`, en: `line ${line}, column ${column}` };
        const shown = found && reason === "unexpected-character" ? ` «${found}»` : "";
        throw new ToolFailure(
            "invalid-input",
            {
                fa: `${REASONS[reason].fa}${shown} در ${where.fa}.`,
                en: `${REASONS[reason].en}${shown.replace(/[«»]/g, '"')} at ${where.en}.`,
            },
            `${line}:${column}`,
        );
    }

    if (action === "validate") return { output: "", warnings: scan.warnings };

    const value: unknown = JSON.parse(text.charCodeAt(0) === 0xfeff ? text.slice(1) : text);
    const ordered = sortKeys ? sortDeep(value) : value;
    const space = action === "minify" ? undefined : indent === "tab" ? "\t" : Number(indent);
    return { output: JSON.stringify(ordered, null, space), warnings: scan.warnings };
}

function sortDeep(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(sortDeep);
    if (value !== null && typeof value === "object") {
        return Object.fromEntries(
            Object.keys(value)
                .sort()
                .map((key) => [key, sortDeep((value as Record<string, unknown>)[key])]),
        );
    }
    return value;
}
