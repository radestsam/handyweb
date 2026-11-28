import { ToolFailure } from "@handyweb/core/runtime";

/*
 * Regular expression testing with the JavaScript engine of the browser. The
 * UI runs runRegex in a worker with a time limit, because a pattern with
 * catastrophic backtracking can run for a very long time, and only a worker
 * can be stopped.
 */

export const FLAGS = ["g", "i", "m", "s", "u"] as const;
export type Flag = (typeof FLAGS)[number];

export interface RegexInput {
    pattern: string;
    flags: string;
    text: string;
    /** The most matches to return. */
    limit: number;
}

export interface RegexMatch {
    /** Start and end, in UTF-16 code units, as JavaScript counts them. */
    index: number;
    end: number;
    text: string;
    /** Numbered groups 1 to n. A group that did not take part is null. */
    groups: Array<string | null>;
    named: Record<string, string | null>;
}

export interface RegexOutput {
    matches: RegexMatch[];
    /** More matches exist than `limit`. */
    truncated: boolean;
}

/** Compiles the pattern, or throws a ToolFailure with the message of the engine. */
export function compile(pattern: string, flags: string): RegExp {
    try {
        return new RegExp(pattern, flags);
    } catch (error) {
        throw new ToolFailure(
            "invalid-input",
            { fa: "الگو درست نیست.", en: "The pattern is not valid." },
            error instanceof Error ? error.message : String(error),
        );
    }
}

function toMatch(match: RegExpExecArray): RegexMatch {
    const named: Record<string, string | null> = {};
    for (const [name, value] of Object.entries(match.groups ?? {})) named[name] = value ?? null;
    return {
        index: match.index,
        end: match.index + match[0].length,
        text: match[0],
        groups: match.slice(1).map((value) => value ?? null),
        named,
    };
}

export function runRegex({ pattern, flags, text, limit }: RegexInput): RegexOutput {
    if (pattern === "") return { matches: [], truncated: false };
    const regex = compile(pattern, flags);
    if (!regex.global) {
        const match = regex.exec(text);
        return { matches: match ? [toMatch(match)] : [], truncated: false };
    }
    const matches: RegexMatch[] = [];
    // matchAll moves past an empty match, so a pattern such as /a*/g ends.
    for (const match of text.matchAll(regex)) {
        if (matches.length === limit) return { matches, truncated: true };
        matches.push(toMatch(match));
    }
    return { matches, truncated: false };
}

/**
 * Finds a group with a quantifier that has a quantifier itself, such as
 * (a+)+, (\w*)*, or (x|xy){2,}. Such patterns can take exponential time on
 * text that almost matches. This is a warning only: it does not find every
 * slow pattern, and some patterns it names are fast.
 */
export function backtrackingRisk(pattern: string): boolean {
    // Remove escapes and character classes, so "\(" and "[+*]" do not count.
    const plain = pattern.replace(/\\./g, "x").replace(/\[(?:[^\]\\]|\\.)*\]/g, "x");
    const stack: boolean[] = [];
    for (let i = 0; i < plain.length; i++) {
        const char = plain[i];
        if (char === "(") {
            stack.push(false);
        } else if (char === ")") {
            const inner = stack.pop() ?? false;
            const next = plain[i + 1];
            const quantified =
                next === "*" ||
                next === "+" ||
                (next === "{" && /^\{\d+,/.test(plain.slice(i + 1)));
            if (inner && quantified) return true;
            if (stack.length > 0 && (inner || quantified)) stack[stack.length - 1] = true;
        } else if (
            char === "*" ||
            char === "+" ||
            (char === "{" && /^\{\d+,\d*\}/.test(plain.slice(i)))
        ) {
            if (stack.length > 0) stack[stack.length - 1] = true;
        }
    }
    return false;
}
