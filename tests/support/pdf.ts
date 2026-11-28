import type { Page } from "@playwright/test";
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

/**
 * A PDF with one large, high-quality photo-like JPEG. The browser of the test
 * makes the JPEG (Node has no JPEG encoder), so the compressor has real work.
 */
export async function makePhotoPdf(page: Page): Promise<Buffer> {
    const jpeg = await page.evaluate(async () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1600;
        canvas.height = 1200;
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        const gradient = context.createLinearGradient(0, 0, 1600, 1200);
        gradient.addColorStop(0, "#1e3a8a");
        gradient.addColorStop(1, "#f59e0b");
        context.fillStyle = gradient;
        context.fillRect(0, 0, 1600, 1200);
        for (let i = 0; i < 4000; i++) {
            context.fillStyle = `hsl(${(i * 37) % 360} 70% 50% / 0.5)`;
            context.fillRect((i * 97) % 1600, (i * 61) % 1200, 12, 12);
        }
        const blob = await new Promise<Blob>((resolve) =>
            canvas.toBlob((blob: Blob | null) => resolve(blob as Blob), "image/jpeg", 0.98),
        );
        return [...new Uint8Array(await blob.arrayBuffer())];
    });
    const pdf = await PDFDocument.create();
    const image = await pdf.embedJpg(Uint8Array.from(jpeg));
    pdf.addPage([1600 * 0.45, 1200 * 0.45]).drawImage(image, {
        x: 0,
        y: 0,
        width: 1600 * 0.45,
        height: 1200 * 0.45,
    });
    return Buffer.from(await pdf.save());
}
