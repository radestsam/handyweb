import { ToolFailure } from "@handyweb/core/runtime";

/*
 * CSV as RFC 4180 describes it: fields separated by a delimiter, rows by a
 * line break, and a field in double quotes when it holds the delimiter, a
 * quote, or a line break. A quote inside a quoted field is written twice.
 */

export type Delimiter = "," | ";" | "\t";

function fail(fa: string, en: string, detail?: string): ToolFailure {
    return new ToolFailure("invalid-input", { fa, en }, detail);
}

function quote(value: string, delimiter: Delimiter): string {
    return /["\r\n]/.test(value) || value.includes(delimiter) || /^\s|\s$/.test(value)
        ? `"${value.replace(/"/g, '""')}"`
        : value;
}

function cell(value: unknown, flatten: boolean): string {
    if (value === null || value === undefined) return "";
    if (typeof value === "object" && !flatten) return JSON.stringify(value);
    return String(value);
}

/** Turns {a: {b: 1}} into {"a.b": 1}. Arrays keep their index: "list.0". */
function flattenObject(
    value: unknown,
    prefix = "",
    out: Record<string, unknown> = {},
): Record<string, unknown> {
    if (value !== null && typeof value === "object") {
        const entries = Object.entries(value as Record<string, unknown>);
        if (entries.length === 0 && prefix) out[prefix] = Array.isArray(value) ? "[]" : "{}";
        for (const [key, child] of entries)
            flattenObject(child, prefix ? `${prefix}.${key}` : key, out);
    } else {
        out[prefix] = value;
    }
    return out;
}

export interface ToCsvOptions {
    delimiter: Delimiter;
    /** Write nested objects as "a.b" columns, not as JSON text. */
    flatten: boolean;
}

/**
 * A JSON array of objects becomes one row per object, with a header of every
 * key in the order it first appears. An array of arrays becomes rows without
 * a header. A single object becomes one row.
 */
export function jsonToCsv(text: string, options: ToCsvOptions): string {
    let data: unknown;
    try {
        data = JSON.parse(text);
    } catch (error) {
        throw fail(
            "JSON درست نیست.",
            "The JSON is not valid.",
            error instanceof Error ? error.message : undefined,
        );
    }
    const rows = Array.isArray(data) ? data : [data];
    if (rows.length === 0) return "";
    const line = (values: unknown[]) =>
        values
            .map((value) => quote(cell(value, options.flatten), options.delimiter))
            .join(options.delimiter);
    if (rows.every(Array.isArray)) return (rows as unknown[][]).map(line).join("\r\n");
    if (!rows.every((row) => row !== null && typeof row === "object" && !Array.isArray(row))) {
        throw fail(
            "JSON باید آرایه‌ای از شیءها یا آرایه‌ای از آرایه‌ها باشد.",
            "The JSON must be an array of objects or an array of arrays.",
            "shape",
        );
    }
    const objects = (rows as Record<string, unknown>[]).map((row) =>
        options.flatten ? flattenObject(row) : row,
    );
    const keys: string[] = [];
    const seen = new Set<string>();
    for (const row of objects) {
        for (const key of Object.keys(row)) {
            if (!seen.has(key)) {
                seen.add(key);
                keys.push(key);
            }
        }
    }
    return [line(keys), ...objects.map((row) => line(keys.map((key) => row[key])))].join("\r\n");
}

/** Reads CSV into rows of fields. */
export function parseCsv(text: string, delimiter: Delimiter): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let field = "";
    let quoted = false;
    let i = 0;
    const source = text.replace(/^\uFEFF/, "");
    let line = 1;
    while (i < source.length) {
        const char = source[i] as string;
        if (quoted) {
            if (char === '"') {
                if (source[i + 1] === '"') {
                    field += '"';
                    i += 2;
                    continue;
                }
                quoted = false;
                i++;
                continue;
            }
            if (char === "\n") line++;
            field += char;
            i++;
            continue;
        }
        if (char === '"' && field === "") {
            quoted = true;
            i++;
        } else if (char === delimiter) {
            row.push(field);
            field = "";
            i++;
        } else if (char === "\r" || char === "\n") {
            row.push(field);
            rows.push(row);
            row = [];
            field = "";
            i += char === "\r" && source[i + 1] === "\n" ? 2 : 1;
            line++;
        } else {
            field += char;
            i++;
        }
    }
    if (quoted) {
        throw fail(
            `یک گیومه باز بسته نشده است (از خط ${line} یا پیش از آن).`,
            `A quoted field is not closed (at or before line ${line}).`,
            "open quote",
        );
    }
    if (field !== "" || row.length > 0) {
        row.push(field);
        rows.push(row);
    }
    return rows;
}

/** Picks the delimiter that splits the first line into the most fields. */
export function detectDelimiter(text: string): Delimiter {
    const first = text.replace(/^\uFEFF/, "").split(/\r?\n/)[0] ?? "";
    const candidates: Delimiter[] = [",", ";", "\t"];
    let best: Delimiter = ",";
    let most = 0;
    for (const candidate of candidates) {
        const count = first.split(candidate).length;
        if (count > most) {
            most = count;
            best = candidate;
        }
    }
    return best;
}

export interface ToJsonOptions {
    delimiter: Delimiter | "auto";
    /** The first row holds the names of the columns. */
    header: boolean;
    /** Read numbers, true, false, and null as JSON values, not as text. */
    types: boolean;
}

function typed(value: string, types: boolean): unknown {
    if (!types) return value;
    if (value === "") return null;
    if (value === "true") return true;
    if (value === "false") return false;
    if (value === "null") return null;
    // Only plain numbers. "007" and "1e5" stay text, so IDs and codes keep their form.
    if (/^-?(0|[1-9]\d{0,14})(\.\d+)?$/.test(value)) return Number(value);
    return value;
}

export function csvToJson(text: string, options: ToJsonOptions): string {
    const delimiter = options.delimiter === "auto" ? detectDelimiter(text) : options.delimiter;
    const rows = parseCsv(text, delimiter);
    if (rows.length === 0) return "[]";
    if (!options.header) {
        return JSON.stringify(
            rows.map((row) => row.map((value) => typed(value, options.types))),
            null,
            2,
        );
    }
    const [head, ...body] = rows as [string[], ...string[][]];
    const names = head.map((name, index) => name.trim() || `column${index + 1}`);
    const objects = body.map((row) => {
        const object: Record<string, unknown> = {};
        names.forEach((name, index) => {
            object[name] = typed(row[index] ?? "", options.types);
        });
        return object;
    });
    return JSON.stringify(objects, null, 2);
}
