import { PDFDocument, StandardFonts } from "@cantoo/pdf-lib";

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

/** A one-page PDF with a title and an author, for the metadata tests. */
export async function makePdfWithMetadata(title: string, author: string): Promise<Buffer> {
    const document = await PDFDocument.create({ updateMetadata: false });
    document.addPage();
    document.setTitle(title);
    document.setAuthor(author);
    document.setCreationDate(new Date("2024-03-01T10:00:00Z"));
    return Buffer.from(await document.save());
}

/** A PDF with one line of text on each page. */
export async function makeTextPdf(lines: string[]): Promise<Buffer> {
    const document = await PDFDocument.create();
    const font = await document.embedFont(StandardFonts.Helvetica);
    for (const line of lines)
        document.addPage([300, 200]).drawText(line, { x: 20, y: 150, size: 14, font });
    return Buffer.from(await document.save());
}
