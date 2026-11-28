import { safeFileName, sniffBytes } from "@handyweb/core/files";
import { ToolFailure } from "@handyweb/core/runtime";

/** The largest number of files in one merge. */
export const MAX_FILES = 50;
/** The largest size of one file, in bytes. */
export const MAX_FILE_BYTES = 100_000_000;
/** The largest size of all files together, in bytes. */
export const MAX_TOTAL_BYTES = 200_000_000;

/** The PDF library is large, so it loads only when a PDF is opened. */
const pdfLib = () => import("@cantoo/pdf-lib");

const notPdf = () =>
    new ToolFailure("invalid-input", {
        fa: "این فایل PDF نیست یا آسیب دیده است.",
        en: "This file is not a PDF, or it is damaged.",
    });

const encrypted = () =>
    new ToolFailure("unsupported", {
        fa: "این PDF با گذرواژه قفل شده است. نخست قفل آن را بردارید.",
        en: "This PDF is protected with a password. Remove the protection first.",
    });

/** Opens one PDF. Throws a ToolFailure when the file is not a PDF or is encrypted. */
async function open(bytes: Uint8Array) {
    // Do not trust the file name or the MIME type. A PDF starts with "%PDF-".
    if (sniffBytes(bytes.subarray(0, 16)) !== "pdf") throw notPdf();
    const { PDFDocument } = await pdfLib();
    let document;
    try {
        // Load an encrypted file too, so that the check below can name the problem.
        document = await PDFDocument.load(bytes, {
            updateMetadata: false,
            ignoreEncryption: true,
        });
    } catch {
        throw notPdf();
    }
    if (document.isEncrypted) throw encrypted();
    // A damaged file can load without a page tree. Reading the pages finds it.
    let pages = 0;
    try {
        pages = document.getPageCount();
    } catch {
        throw notPdf();
    }
    if (pages === 0) throw notPdf();
    return document;
}

/** Counts the pages of one PDF. It also checks that the file can be merged. */
export async function countPages(bytes: Uint8Array): Promise<number> {
    return (await open(bytes)).getPageCount();
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
        const source = await open(bytes);
        const pages = await merged.copyPages(source, source.getPageIndices());
        for (const page of pages) merged.addPage(page);
        onProgress?.(index + 1);
    }
    return { bytes: await merged.save(), pages: merged.getPageCount() };
}

/** Moves the item at `from` one place up (-1) or down (+1). */
export function move<T>(list: readonly T[], from: number, step: -1 | 1): T[] {
    const to = from + step;
    if (from < 0 || from >= list.length || to < 0 || to >= list.length) return [...list];
    const next = [...list];
    [next[from], next[to]] = [next[to] as T, next[from] as T];
    return next;
}

/** The name of the merged file, made from the name of the first file. */
export function mergedName(first: string | undefined): string {
    const base = (first ?? "").replace(/\.pdf$/i, "") || "document";
    return safeFileName(`${base}-merged.pdf`);
}
