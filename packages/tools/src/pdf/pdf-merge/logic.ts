import { safeFileName } from "@handyweb/core/files";
import { ToolFailure } from "@handyweb/core/runtime";
import { openPdf, pdfLib } from "../shared/pdflib";

/** The largest number of files in one merge. */
export const MAX_FILES = 50;
/** The largest size of one file, in bytes. */
export const MAX_FILE_BYTES = 100_000_000;
/** The largest size of all files together, in bytes. */
export const MAX_TOTAL_BYTES = 200_000_000;

/** Counts the pages of one PDF. It also checks that the file can be merged. */
export async function countPages(bytes: Uint8Array): Promise<number> {
    return (await openPdf(bytes)).getPageCount();
}

/**
 * Puts all pages of the PDFs into one new PDF, in the order of the list. The
 * new file gets no metadata from the sources and no "producer" field.
 */
export async function mergePdfs(
    sources: readonly Uint8Array[],
    onProgress?: (done: number) => void,
): Promise<{ bytes: Uint8Array; pages: number }> {
    if (sources.length > MAX_FILES)
        throw new ToolFailure("too-large", {
            fa: `بیشینه ${MAX_FILES} فایل را می‌توان یکی کرد.`,
            en: `You can merge up to ${MAX_FILES} files.`,
        });
    const { PDFDocument } = await pdfLib();
    const merged = await PDFDocument.create({ updateMetadata: false });
    for (const [index, bytes] of sources.entries()) {
        const source = await openPdf(bytes);
        const pages = await merged.copyPages(source, source.getPageIndices());
        for (const page of pages) merged.addPage(page);
        onProgress?.(index + 1);
    }
    return { bytes: await merged.save(), pages: merged.getPageCount() };
}

/** The name of the merged file, made from the name of the first file. */
export function mergedName(first: string | undefined): string {
    const base = (first ?? "").replace(/\.pdf$/i, "") || "document";
    return safeFileName(`${base}-merged.pdf`);
}
