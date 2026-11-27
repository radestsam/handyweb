export type NumericFormat = "decimal" | "hex";

export interface EncodeOptions {
    /** Also encode every character outside ASCII, such as Persian letters and emoji. */
    nonAscii: boolean;
    /** The form of the numeric references for non-ASCII characters. */
    format: NumericFormat;
}

export const DEFAULT_OPTIONS: EncodeOptions = { nonAscii: false, format: "decimal" };

/**
 * The five characters that HTML gives a meaning. With them encoded, the text
 * is safe inside an element and inside a quoted attribute value.
 */
const SPECIAL: Readonly<Record<string, string>> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
};

export function encodeEntities(text: string, options: EncodeOptions = DEFAULT_OPTIONS): string {
    let out = "";
    for (const char of text) {
        const named = SPECIAL[char];
        if (named) {
            out += named;
            continue;
        }
        const code = char.codePointAt(0) as number;
        if (options.nonAscii && code > 0x7e) {
            out +=
                options.format === "hex" ? `&#x${code.toString(16).toUpperCase()};` : `&#${code};`;
        } else {
            out += char;
        }
    }
    return out;
}

/**
 * Decodes named and numeric character references with the HTML parser of the
 * browser, so the result follows the HTML standard: all 2,231 named
 * references, references without the final ";" where the standard allows
 * them, and the Windows-1252 rules for &#128; to &#159;.
 *
 * The text goes into an inert document (DOMParser runs no script and loads
 * nothing) as the content of a <textarea>. Inside a textarea, the parser
 * decodes references but does not read tags. Each "<" is written as "&lt;", so
 * the input cannot close the textarea. The newline after the start tag keeps a
 * newline at the start of the input, because the parser drops the first one.
 */
export function decodeEntities(text: string): string {
    if (text === "") return "";
    const html = `<textarea>\n${text.replace(/</g, "&lt;")}</textarea>`;
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.querySelector("textarea")?.value ?? "";
}
