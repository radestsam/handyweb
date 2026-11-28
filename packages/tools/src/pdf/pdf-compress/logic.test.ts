import { PDFDocument, PDFName, PDFRawStream, type PDFNumber } from "@cantoo/pdf-lib";
import { describe, expect, it } from "vitest";
import { compressedName, compressPdf, saving, type Recompress } from "./logic";

const latin1 = (data: Uint8Array) => new TextDecoder("latin1").decode(data);

/** Bytes that stand in for a JPEG: a marker text and padding. */
function fakeJpeg(marker: string, size: number): Uint8Array {
    const bytes = new Uint8Array(size).fill(0x41);
    bytes.set(new TextEncoder().encode(marker));
    return bytes;
}

async function makePdf(
    images: Array<{ space: string; size: number; marker: string }>,
    unused = false,
): Promise<Uint8Array> {
    const document = await PDFDocument.create();
    const page = document.addPage([300, 300]);
    for (const [index, image] of images.entries()) {
        const stream = document.context.stream(fakeJpeg(image.marker, image.size), {
            Type: "XObject",
            Subtype: "Image",
            Width: 2000,
            Height: 1000,
            ColorSpace: image.space,
            BitsPerComponent: 8,
            Filter: "DCTDecode",
        });
        page.node.setXObject(PDFName.of(`Im${index}`), document.context.register(stream));
    }
    if (unused) document.context.register(document.context.stream("unused-object-text"));
    return document.save({ useObjectStreams: false });
}

/** A fake encoder: halves the size and the longest side. */
const half: Recompress = async (image, target) => ({
    bytes: fakeJpeg(`new-${target.quality}`, Math.floor(image.bytes.length / 2)),
    width: Math.round(image.width / 2),
    height: Math.round(image.height / 2),
});

async function imageDicts(bytes: Uint8Array) {
    const document = await PDFDocument.load(bytes);
    return document.context
        .enumerateIndirectObjects()
        .filter(([, object]) => object instanceof PDFRawStream)
        .map(([, object]) => (object as PDFRawStream).dict)
        .filter((dict) => dict.get(PDFName.of("Subtype")) === PDFName.of("Image"));
}

describe("pdf compress", () => {
    it("replaces a large image when the new one is smaller", async () => {
        const result = await compressPdf(
            await makePdf([{ space: "DeviceRGB", size: 50_000, marker: "old-rgb" }]),
            "medium",
            half,
        );
        expect(result.imagesFound).toBe(1);
        expect(result.imagesChanged).toBe(1);
        const raw = latin1(result.bytes);
        expect(raw).toContain("new-0.65");
        expect(raw).not.toContain("old-rgb");
        const [dict] = await imageDicts(result.bytes);
        expect((dict?.get(PDFName.of("Width")) as PDFNumber).asNumber()).toBe(1000);
    });

    it("keeps an image when the saving is too small, and skips CMYK and small images", async () => {
        const almost: Recompress = async (image) => ({
            bytes: fakeJpeg("almost", Math.floor(image.bytes.length * 0.95)),
            width: image.width,
            height: image.height,
        });
        const result = await compressPdf(
            await makePdf([
                { space: "DeviceRGB", size: 50_000, marker: "keep-rgb" },
                { space: "DeviceCMYK", size: 50_000, marker: "keep-cmyk" },
                { space: "DeviceRGB", size: 5_000, marker: "keep-small" },
            ]),
            "strong",
            almost,
        );
        expect(result.imagesChanged).toBe(0);
        const raw = latin1(result.bytes);
        for (const marker of ["keep-rgb", "keep-cmyk", "keep-small"]) expect(raw).toContain(marker);
    });

    it("writes a gray image as RGB", async () => {
        const result = await compressPdf(
            await makePdf([{ space: "DeviceGray", size: 40_000, marker: "old-gray" }]),
            "light",
            half,
        );
        const [dict] = await imageDicts(result.bytes);
        expect(dict?.get(PDFName.of("ColorSpace"))).toBe(PDFName.of("DeviceRGB"));
    });

    it("removes unused objects", async () => {
        const result = await compressPdf(await makePdf([], true), "medium", half);
        expect(latin1(result.bytes)).not.toContain("unused-object-text");
        expect(result.imagesFound).toBe(0);
    });

    it("reports the saving and names the output", () => {
        expect(saving(1000, 400)).toBe(60);
        expect(saving(1000, 1100)).toBe(-10);
        expect(compressedName("Scan.pdf")).toBe("Scan-compressed.pdf");
    });
});
