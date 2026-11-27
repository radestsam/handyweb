import { PDFDocument } from "@cantoo/pdf-lib";
import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { countPages, mergedName, mergePdfs, move } from "./logic";

/** A PDF with `pages` pages. Each page has a width of 100 + its number, so the order is visible. */
async function makePdf(pages: number, start = 0, title?: string): Promise<Uint8Array> {
    const document = await PDFDocument.create();
    for (let i = 0; i < pages; i++) document.addPage([100 + start + i, 200]);
    if (title) document.setTitle(title);
    return document.save();
}

describe("pdf merge", () => {
    it("counts pages", async () => {
        expect(await countPages(await makePdf(3))).toBe(3);
    });

    it("merges all pages in the order of the list", async () => {
        const merged = await mergePdfs([await makePdf(2, 0), await makePdf(1, 10)]);
        expect(merged.pages).toBe(3);
        const document = await PDFDocument.load(merged.bytes);
        expect(document.getPages().map((page) => page.getWidth())).toEqual([100, 101, 110]);
    });

    it("reports progress per file", async () => {
        const done: number[] = [];
        await mergePdfs([await makePdf(1), await makePdf(1)], (count) => done.push(count));
        expect(done).toEqual([1, 2]);
    });

    it("does not copy the metadata of the sources", async () => {
        const merged = await mergePdfs([await makePdf(1, 0, "Secret report")]);
        const document = await PDFDocument.load(merged.bytes, { updateMetadata: false });
        expect(document.getTitle()).toBeUndefined();
        expect(document.getProducer()).toBeUndefined();
    });

    it("rejects a file that is not a PDF", async () => {
        const text = new TextEncoder().encode("hello, this is not a PDF file");
        await expect(countPages(text)).rejects.toBeInstanceOf(ToolFailure);
        await expect(countPages(text)).rejects.toMatchObject({ code: "invalid-input" });
    });

    it("rejects a damaged PDF", async () => {
        const broken = new TextEncoder().encode("%PDF-1.7\n garbage without objects");
        await expect(countPages(broken)).rejects.toMatchObject({ code: "invalid-input" });
    });

    it("rejects an encrypted PDF", async () => {
        const document = await PDFDocument.create();
        document.addPage();
        document.encrypt({ userPassword: "secret", ownerPassword: "owner" });
        const bytes = await document.save();
        await expect(countPages(bytes)).rejects.toMatchObject({ code: "unsupported" });
    });

    it("moves items and names the output", () => {
        expect(move(["a", "b", "c"], 2, -1)).toEqual(["a", "c", "b"]);
        expect(move(["a", "b", "c"], 0, 1)).toEqual(["b", "a", "c"]);
        expect(move(["a", "b"], 0, -1)).toEqual(["a", "b"]);
        expect(mergedName("Report.PDF")).toBe("Report-merged.pdf");
        expect(mergedName(undefined)).toBe("document-merged.pdf");
    });
});
