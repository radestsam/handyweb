import { ToolFailure } from "@handyweb/core/runtime";

export type Indent = "2" | "4" | "tab";

export interface FormatOptions {
    indent: Indent;
    /** Keep at most this many empty lines in a row. */
    maxEmptyLines: number;
}

export type Beautifier = (source: string, options: Record<string, unknown>) => string;

/** Options shared by the HTML, CSS, and JavaScript beautifiers of js-beautify. */
export function beautifyOptions(options: FormatOptions): Record<string, unknown> {
    return {
        indent_size: options.indent === "tab" ? 1 : Number(options.indent),
        indent_char: options.indent === "tab" ? "\t" : " ",
        indent_with_tabs: options.indent === "tab",
        end_with_newline: true,
        preserve_newlines: options.maxEmptyLines > 0,
        // js-beautify counts line breaks: 2 breaks keep one empty line.
        max_preserve_newlines: options.maxEmptyLines + 1,
        wrap_line_length: 0,
    };
}

/**
 * Formats code with one js-beautify function. js-beautify reformats the
 * text without checking that the code is valid, so the result of invalid
 * code is also not valid.
 */
export function formatCode(source: string, beautify: Beautifier, options: FormatOptions): string {
    if (source.trim() === "") {
        throw new ToolFailure(
            "invalid-input",
            { fa: "ورودی خالی است.", en: "The input is empty." },
            "empty",
        );
    }
    return beautify(source, beautifyOptions(options));
}
