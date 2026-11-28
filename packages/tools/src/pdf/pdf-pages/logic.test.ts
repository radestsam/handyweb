import { PDFDocument, degrees } from "@cantoo/pdf-lib";
import { describe, expect, it } from "vitest";
import {
    buildPdf,
    initialPages,
    outputName,
    rotateMany,
    rotatePage,
    selectAll,
    splitPdf,
    toggleSelected,
    unchanged,
} from "./logic";

/** Page i has a width of 100 + i points, so the order is visible. Page 2 is turned 90. */
async function makePdf(count: number): Promise<Uint8Array> {
    const document = await PDFDocument.create();
    for (let i = 0; i < count; i++) document.addPage([100 + i, 200]);
    document.getPage(1).setRotation(degrees(90));
    return document.save();
}

const read = async (bytes: Uint8Array) => {
    const document = await PDFDocument.load(bytes);
    return document.getPages().map((page) => [page.getWidth(), page.getRotation().angle]);
};

describe("pdf pages", () => {
    it("changes the page list", () => {
        let pages = initialPages(3);
        expect(unchanged(pages, 3)).toBe(true);
        pages = rotatePage(pages, 0, -1);
        expect(pages[0]?.rotation).toBe(270);
        pages = toggleSelected(pages, 2);
        pages = rotateMany(pages, 1);
        expect(pages.map((page) => page.rotation)).toEqual([270, 0, 90]);
        pages = selectAll(pages, false);
        pages = rotateMany(pages, 1);
        expect(pages.map((page) => page.rotation)).toEqual([0, 90, 180]);
        expect(unchanged(pages, 3)).toBe(false);
    });

    it("builds a PDF in the new order with the turns added", async () => {
        const output = await buildPdf(await makePdf(3), [
            { source: 2, rotation: 0 },
            { source: 1, rotation: 90 },
            { source: 0, rotation: 270 },
        ]);
        expect(await read(output)).toEqual([
            [102, 0],
            [101, 180],
            [100, 270],
        ]);
    });

    it("leaves pages out and refuses an empty result", async () => {
        const output = await buildPdf(await makePdf(4), [{ source: 3, rotation: 0 }]);
        expect(await read(output)).toEqual([[103, 0]]);
        await expect(buildPdf(await makePdf(2), [])).rejects.toMatchObject({
            code: "invalid-input",
        });
    });

    it("splits into one PDF per page", async () => {
        const done: number[] = [];
        const entries = await splitPdf(await makePdf(3), initialPages(3), "Book.pdf", (count) =>
            done.push(count),
        );
        expect(entries.map((entry) => entry.name)).toEqual([
            "Book-page-1.pdf",
            "Book-page-2.pdf",
            "Book-page-3.pdf",
        ]);
        expect(await read(entries[1]?.data as Uint8Array)).toEqual([[101, 90]]);
        expect(done).toEqual([1, 2, 3]);
    });

    it("names the outputs", () => {
        expect(outputName("Book.pdf", "edited")).toBe("Book-edited.pdf");
        expect(outputName("Book.pdf", "selected")).toBe("Book-selected.pdf");
        expect(outputName("Book.pdf", "pages")).toBe("Book-pages.zip");
    });
});
