import { safeFileName } from "@handyweb/core/files";

/** The largest PDF file, in bytes. */
export const MAX_FILE_BYTES = 100_000_000;
/** The largest number of pages that the tool reads. */
export const MAX_PAGES = 1000;

/** The part of a pdf.js text item that the tool uses. */
export interface TextPiece {
    str: string;
    hasEOL: boolean;
}

/**
 * Joins the text items of one page. pdf.js marks the end of a line with
 * hasEOL. Spaces at the end of a line are removed, and runs of empty lines
 * become one empty line.
 */
export function pageText(items: readonly TextPiece[]): string {
    return items
        .map((item) => item.str + (item.hasEOL ? "\n" : ""))
        .join("")
        .split("\n")
        .map((line) => line.replace(/[ \t ]+$/u, ""))
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

/**
 * Joins the pages. With headers, each page starts with a line such as
 * "--- Page 2 ---", so the reader can find the source of a line.
 */
export function joinPages(
    pages: readonly string[],
    headers: boolean,
    label: (page: number) => string,
): string {
    if (!headers) return pages.filter((text) => text !== "").join("\n\n");
    return pages.map((text, index) => `--- ${label(index + 1)} ---\n${text}`).join("\n\n");
}

/** The name of the text file. */
export function textName(source: string): string {
    const base = source.replace(/\.pdf$/i, "") || "document";
    return safeFileName(`${base}.txt`);
}
