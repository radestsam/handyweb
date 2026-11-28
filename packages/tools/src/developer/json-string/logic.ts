import { ToolFailure } from "@handyweb/core/runtime";

export interface EscapeOptions {
    /** Write every character above U+007E as \uXXXX. */
    asciiOnly: boolean;
    /** Put double quotes around the result. */
    quotes: boolean;
}

/** Escapes text for a JSON string, as JSON.stringify does. */
export function escapeJsonString(text: string, options: EscapeOptions): string {
    let body = JSON.stringify(text).slice(1, -1);
    if (options.asciiOnly) {
        body = body.replace(
            /[\u007f-\uffff]/g,
            (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`,
        );
    }
    return options.quotes ? `"${body}"` : body;
}

/**
 * Reads an escaped JSON string, with or without the double quotes around it.
 * An error names the position of the bad escape.
 */
export function unescapeJsonString(input: string): string {
    const trimmed = input.trim();
    const quoted = trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"');
    const body = quoted ? trimmed.slice(1, -1) : input;
    try {
        const value: unknown = JSON.parse(`"${body}"`);
        return value as string;
    } catch {
        const bad = findProblem(body);
        throw new ToolFailure(
            "invalid-input",
            {
                fa: `این رشته JSON درستی نیست${bad ? `: ${bad.fa}` : "."}`,
                en: `This is not a valid JSON string${bad ? `: ${bad.en}` : "."}`,
            },
            bad?.detail,
        );
    }
}

function findProblem(body: string): { fa: string; en: string; detail: string } | null {
    for (let i = 0; i < body.length; i++) {
        const char = body[i] as string;
        const position = i + 1;
        if (char === "\\") {
            const next = body[i + 1];
            if (next === "u") {
                if (!/^[0-9a-fA-F]{4}$/.test(body.slice(i + 2, i + 6))) {
                    return {
                        fa: `پس از \\u در جایگاه ${position} چهار رقم هگز نیامده است.`,
                        en: `\\u at position ${position} is not followed by four hex digits.`,
                        detail: `position ${position}`,
                    };
                }
                i += 5;
            } else if (next !== undefined && '"\\/bfnrt'.includes(next)) {
                i += 1;
            } else {
                return {
                    fa: `دنباله \\${next ?? ""} در جایگاه ${position} در JSON نیست.`,
                    en: `\\${next ?? ""} at position ${position} is not a JSON escape.`,
                    detail: `position ${position}`,
                };
            }
        } else if (char === '"') {
            return {
                fa: `گیومه در جایگاه ${position} باید به شکل \\" بیاید.`,
                en: `The quote at position ${position} must be written as \\".`,
                detail: `position ${position}`,
            };
        } else if (char.charCodeAt(0) < 0x20) {
            return {
                fa: `نویسه کنترلی (مانند خط تازه) در جایگاه ${position} باید رمزگذاری شود، مانند \\n.`,
                en: `The control character (such as a line break) at position ${position} must be escaped, such as \\n.`,
                detail: `position ${position}`,
            };
        }
    }
    return null;
}
