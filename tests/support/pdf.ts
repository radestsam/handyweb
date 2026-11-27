import { PDFDocument } from "@cantoo/pdf-lib";

/**
 * A small PDF for the browser tests. Page i has a width of 100 + start + i
 * points, so a test can read the page order of a merged file.
 */
export async function makePdf(pages: number, start = 0): Promise<Buffer> {
    const document = await PDFDocument.create();
    for (let i = 0; i < pages; i++) document.addPage([100 + start + i, 200]);
    return Buffer.from(await document.save());
}

/** The page widths of a PDF, in page order. */
export async function pageWidths(bytes: Uint8Array): Promise<number[]> {
    const document = await PDFDocument.load(bytes);
    return document.getPages().map((page) => page.getWidth());
}
