import type { PDFDocumentProxy } from "pdfjs-dist";
import { pageText, type TextPiece } from "./logic";

/** Reads the text of one page with pdf.js. */
export async function extractPage(pdf: PDFDocumentProxy, pageNumber: number): Promise<string> {
    const page = await pdf.getPage(pageNumber);
    try {
        const content = await page.getTextContent();
        const items = content.items.filter(
            (item): item is TextPiece & typeof item => "str" in item,
        );
        return pageText(items);
    } finally {
        page.cleanup();
    }
}
