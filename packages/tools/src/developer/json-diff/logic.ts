import { ToolFailure } from "@handyweb/core/runtime";

export type ChangeKind = "added" | "removed" | "changed" | "type";

export interface JsonChange {
    kind: ChangeKind;
    /** A JSONPath-like path, such as $.users[2].name. */
    path: string;
    before?: unknown;
    after?: unknown;
}

export interface DiffOptions {
    /** Compare arrays as sets: the order of items does not matter. */
    ignoreArrayOrder: boolean;
}

function parse(text: string, side: "left" | "right"): unknown {
    try {
        return JSON.parse(text);
    } catch (error) {
        throw new ToolFailure(
            "invalid-input",
            side === "left"
                ? { fa: "JSON نخست درست نیست.", en: "The first JSON is not valid." }
                : { fa: "JSON دوم درست نیست.", en: "The second JSON is not valid." },
            error instanceof Error ? error.message : undefined,
        );
    }
}

function typeOf(value: unknown): string {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    return typeof value;
}

function key(path: string, name: string): string {
    return /^[A-Za-z_$][\w$]*$/.test(name) ? `${path}.${name}` : `${path}[${JSON.stringify(name)}]`;
}

/** A stable text form, with object keys sorted, to compare values as set items. */
function canonical(value: unknown): string {
    if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
    if (value !== null && typeof value === "object") {
        const entries = Object.keys(value as object)
            .sort()
            .map(
                (name) =>
                    `${JSON.stringify(name)}:${canonical((value as Record<string, unknown>)[name])}`,
            );
        return `{${entries.join(",")}}`;
    }
    return JSON.stringify(value);
}

function walk(a: unknown, b: unknown, path: string, options: DiffOptions, out: JsonChange[]): void {
    const ta = typeOf(a);
    const tb = typeOf(b);
    if (ta !== tb) {
        out.push({ kind: "type", path, before: a, after: b });
        return;
    }
    if (ta === "array") {
        const left = a as unknown[];
        const right = b as unknown[];
        if (options.ignoreArrayOrder) {
            const counts = new Map<string, number>();
            for (const item of right)
                counts.set(canonical(item), (counts.get(canonical(item)) ?? 0) + 1);
            const removed: unknown[] = [];
            for (const item of left) {
                const id = canonical(item);
                const count = counts.get(id) ?? 0;
                if (count > 0) counts.set(id, count - 1);
                else removed.push(item);
            }
            for (const item of removed)
                out.push({ kind: "removed", path: `${path}[*]`, before: item });
            for (const item of right) {
                const id = canonical(item);
                const count = counts.get(id) ?? 0;
                if (count > 0) {
                    counts.set(id, count - 1);
                    out.push({ kind: "added", path: `${path}[*]`, after: item });
                }
            }
            return;
        }
        const length = Math.max(left.length, right.length);
        for (let i = 0; i < length; i++) {
            const at = `${path}[${i}]`;
            if (i >= right.length) out.push({ kind: "removed", path: at, before: left[i] });
            else if (i >= left.length) out.push({ kind: "added", path: at, after: right[i] });
            else walk(left[i], right[i], at, options, out);
        }
        return;
    }
    if (ta === "object") {
        const left = a as Record<string, unknown>;
        const right = b as Record<string, unknown>;
        for (const name of Object.keys(left)) {
            if (!Object.hasOwn(right, name))
                out.push({ kind: "removed", path: key(path, name), before: left[name] });
            else walk(left[name], right[name], key(path, name), options, out);
        }
        for (const name of Object.keys(right)) {
            if (!Object.hasOwn(left, name))
                out.push({ kind: "added", path: key(path, name), after: right[name] });
        }
        return;
    }
    if (a !== b) out.push({ kind: "changed", path, before: a, after: b });
}

/**
 * Compares two JSON documents by structure, not by text: key order and
 * formatting do not matter. Each change names its path.
 */
export function diffJson(left: string, right: string, options: DiffOptions): JsonChange[] {
    const a = parse(left, "left");
    const b = parse(right, "right");
    const out: JsonChange[] = [];
    walk(a, b, "$", options, out);
    return out;
}

/** The changes as text, one per line, for copying. */
export function changesToText(changes: JsonChange[]): string {
    const value = (v: unknown) => JSON.stringify(v);
    return changes
        .map((change) => {
            switch (change.kind) {
                case "added":
                    return `+ ${change.path}: ${value(change.after)}`;
                case "removed":
                    return `- ${change.path}: ${value(change.before)}`;
                default:
                    return `~ ${change.path}: ${value(change.before)} → ${value(change.after)}`;
            }
        })
        .join("\n");
}
