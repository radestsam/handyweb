import { PDFDocument } from "@cantoo/pdf-lib";
import { describe, expect, it } from "vitest";
import { imagesToPdf, pdfName, placeImage, type PdfImage } from "./logic";

const bytes = (base64: string) => Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
const latin1 = (data: Uint8Array) => new TextDecoder("latin1").decode(data);

/** A PNG of 4 x 2 pixels. */
const PNG: PdfImage = {
    kind: "png",
    bytes: bytes(
        "iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAYAAAB/qH1jAAAAH0lEQVR4nA3IsQEAAAiDMGof93NlyBJgLxpVEEOj6gG+gAwJKx3JVgAAAABJRU5ErkJggg==",
    ),
    width: 4,
    height: 2,
};

/** A JPEG of 4 x 2 pixels. */
const JPEG: PdfImage = {
    kind: "jpeg",
    bytes: bytes(
        "/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAABKADAAQAAAABAAAAAgAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgAAgAEAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMAAgICAgICAwICAwUDAwMFBgUFBQUGCAYGBgYGCAoICAgICAgKCgoKCgoKCgwMDAwMDA4ODg4ODw8PDw8PDw8PD//bAEMBAgICBAQEBwQEBxALCQsQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEP/dAAQAAf/aAAwDAQACEQMRAD8A/D4AYpcCkHSlr+/WfNo//9k=",
    ),
    width: 4,
    height: 2,
};

describe("images to pdf", () => {
    it("sizes the page to the image with fit", () => {
        expect(placeImage(800, 600, "fit", "none")).toEqual({
            pageWidth: 600,
            pageHeight: 450,
            x: 0,
            y: 0,
            width: 600,
            height: 450,
        });
        const withMargin = placeImage(800, 600, "fit", "small");
        expect(withMargin.pageWidth).toBeCloseTo(600 + 2 * 28.35);
        expect(withMargin.x).toBeCloseTo(28.35);
    });

    it("fits and centers the image on a paper page", () => {
        const portrait = placeImage(1000, 2000, "a4", "none");
        expect([portrait.pageWidth, portrait.pageHeight]).toEqual([595.28, 841.89]);
        expect(portrait.height).toBeCloseTo(841.89);
        expect(portrait.width).toBeCloseTo(420.945);
        expect(portrait.x).toBeCloseTo((595.28 - 420.945) / 2);
        expect(portrait.y).toBeCloseTo(0);
        const landscape = placeImage(3000, 1000, "letter", "large");
        expect([landscape.pageWidth, landscape.pageHeight]).toEqual([792, 612]);
        expect(landscape.width).toBeCloseTo(792 - 2 * 56.69);
        expect(landscape.x).toBeCloseTo(56.69);
    });

    it("makes one page per image, in order", async () => {
        const done: number[] = [];
        const result = await imagesToPdf([PNG, JPEG, PNG], "fit", "none", (n) => done.push(n));
        expect(result.pages).toBe(3);
        expect(done).toEqual([1, 2, 3]);
        const pdf = await PDFDocument.load(result.bytes, { updateMetadata: false });
        expect(pdf.getPages().map((page) => page.getWidth())).toEqual([3, 3, 3]);
        expect(pdf.getProducer()).toBeUndefined();
    });

    it("keeps the JPEG bytes as they are", async () => {
        const result = await imagesToPdf([JPEG], "a4", "small");
        const text = latin1(result.bytes);
        expect(text).toContain("/DCTDecode");
        expect(text).toContain(latin1(JPEG.bytes));
    });

    it("rejects a damaged image and an empty list", async () => {
        const broken: PdfImage = { ...JPEG, bytes: JPEG.bytes.slice(0, 20) };
        await expect(imagesToPdf([PNG, broken], "fit", "none")).rejects.toMatchObject({
            code: "invalid-input",
        });
        await expect(imagesToPdf([], "fit", "none")).rejects.toMatchObject({
            code: "invalid-input",
        });
    });

    it("names the output", () => {
        expect(pdfName("scan-01.jpg")).toBe("scan-01.pdf");
        expect(pdfName(undefined)).toBe("images.pdf");
    });
});
