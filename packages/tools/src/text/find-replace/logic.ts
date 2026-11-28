import { ToolFailure } from "@handyweb/core/runtime";
import { compile } from "../../developer/regex-tester/logic";

export interface ReplaceInput {
    text: string;
    find: string;
    replace: string;
    /** `regex`: find is a JavaScript pattern, and replace can use $1, $<name>, and $&. */
    mode: "text" | "regex";
    ignoreCase: boolean;
    /** Text mode: match only whole words. */
    wholeWord: boolean;
    /** Replace every match, or only the first. */
    all: boolean;
}

export interface ReplaceOutput {
    text: string;
    count: number;
}

function escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Replaces text. In text mode, the find text is literal, and "$" in the
 * replacement is literal too. Whole word uses Unicode letters, so Persian
 * words work.
 */
export function findReplace(input: ReplaceInput): ReplaceOutput {
    if (input.find === "") return { text: input.text, count: 0 };
    const flags = `${input.all ? "g" : ""}${input.ignoreCase ? "i" : ""}u`;
    let regex: RegExp;
    if (input.mode === "regex") {
        regex = compile(input.find, flags);
    } else {
        const body = escapeRegex(input.find);
        regex = new RegExp(
            input.wholeWord ? `(?<![\\p{L}\\p{N}_])${body}(?![\\p{L}\\p{N}_])` : body,
            flags,
        );
    }
    let count = 0;
    const text = input.text.replace(regex, (...args: unknown[]) => {
        count++;
        if (input.mode === "text") return input.replace;
        // Expand $1, $<name>, $&, and $$ for this one match.
        const match = args[0] as string;
        const last = args[args.length - 1];
        const named =
            typeof last === "object" && last !== null ? (last as Record<string, string>) : {};
        const groups = args.slice(1, typeof last === "object" && last !== null ? -3 : -2) as Array<
            string | undefined
        >;
        return input.replace.replace(
            /\$(\$|&|<([^>]+)>|(\d{1,2}))/g,
            (whole, token: string, name?: string, digits?: string) => {
                if (token === "$") return "$";
                if (token === "&") return match;
                if (name !== undefined) return named[name] ?? "";
                const index = Number(digits);
                return index >= 1 && index <= groups.length ? (groups[index - 1] ?? "") : whole;
            },
        );
    });
    return { text, count };
}

export function checkReplaceInput(input: ReplaceInput): void {
    if (input.text.length > 5_000_000) {
        throw new ToolFailure(
            "too-large",
            { fa: "نوشته بیش از ۵ مگابایت است.", en: "The text is larger than 5 MB." },
            "size",
        );
    }
}
