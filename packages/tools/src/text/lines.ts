/*
 * Line helpers shared by the line tools. A tool splits the text into lines,
 * changes the list, and joins it again with the same line break, so a CRLF
 * file stays CRLF.
 */

export interface Lines {
    lines: string[];
    /** The line break of the input: CRLF if the text has one, else LF (or CR alone). */
    newline: "\n" | "\r\n" | "\r";
    /** The text ended with a line break. */
    trailing: boolean;
}

export function splitLines(text: string): Lines {
    const newline = text.includes("\r\n")
        ? "\r\n"
        : text.includes("\n") || !text.includes("\r")
          ? "\n"
          : "\r";
    if (text === "") return { lines: [], newline, trailing: false };
    const lines = text.split(/\r\n|\r|\n/);
    const trailing = lines.length > 1 && lines[lines.length - 1] === "";
    if (trailing) lines.pop();
    return { lines, newline, trailing };
}

export function joinLines({ lines, newline, trailing }: Lines): string {
    if (lines.length === 0) return "";
    return lines.join(newline) + (trailing ? newline : "");
}

/** True for a line that holds only whitespace. */
export function isBlank(line: string): boolean {
    return line.trim() === "";
}
