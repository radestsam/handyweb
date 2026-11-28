import { PDFDict, PDFDocument, PDFHexString, PDFName } from "@cantoo/pdf-lib";
import { describe, expect, it } from "vitest";
import { emptyText, outputName, readMetadata, writeMetadata } from "./logic";

const latin1 = (data: Uint8Array) => new TextDecoder("latin1").decode(data);

async function makePdf(): Promise<Uint8Array> {
    const document = await PDFDocument.create({ updateMetadata: false });
    document.addPage();
    document.setTitle("Secret plan");
    document.setAuthor("Jane Roe");
    document.setProducer("Office 2030");
    document.setCreationDate(new Date("2024-03-01T10:00:00Z"));
    const info = document.context.lookup(document.context.trailerInfo.Info, PDFDict);
    info.set(PDFName.of("Company"), PDFHexString.fromText("Acme"));
    // An XMP stream with the author name, like many office programs write.
    const xmp = document.context.stream("<x:xmpmeta>Jane Roe</x:xmpmeta>", {
        Type: "Metadata",
        Subtype: "XML",
    });
    document.catalog.set(PDFName.of("Metadata"), document.context.register(xmp));
    // An object that nothing uses, like an old revision of the file.
    document.context.register(PDFHexString.fromText("old revision by Jane Roe"));
    return document.save({ useObjectStreams: false });
}

describe("pdf metadata", () => {
    it("reads the fields, the dates, custom keys, and XMP", async () => {
        const metadata = await readMetadata(await makePdf());
        expect(metadata.text.Title).toBe("Secret plan");
        expect(metadata.text.Author).toBe("Jane Roe");
        expect(metadata.text.Producer).toBe("Office 2030");
        expect(metadata.text.Subject).toBe("");
        expect(metadata.created?.toISOString()).toBe("2024-03-01T10:00:00.000Z");
        expect(metadata.otherKeys).toEqual(["Company"]);
        expect(metadata.hasXmp).toBe(true);
        expect(metadata.pages).toBe(1);
    });

    it("removes all metadata and leaves no old copy in the file", async () => {
        const output = await writeMetadata(await makePdf(), emptyText(), {
            created: undefined,
            modified: undefined,
        });
        const metadata = await readMetadata(output);
        expect(metadata.text.Title).toBe("");
        expect(metadata.created).toBeUndefined();
        expect(metadata.otherKeys).toEqual([]);
        expect(metadata.hasXmp).toBe(false);
        expect(metadata.pages).toBe(1);
        const raw = latin1(output);
        expect(raw).not.toContain("Jane Roe");
        expect(raw).not.toContain("Acme");
        expect(raw).not.toContain("/Info");
    });

    it("writes new values, Persian text, and keeps a date", async () => {
        const created = new Date("2025-01-02T03:04:05Z");
        const output = await writeMetadata(
            await makePdf(),
            { ...emptyText(), Title: "گزارش سالانه", Author: "  Sam  " },
            { created, modified: undefined },
        );
        const metadata = await readMetadata(output);
        expect(metadata.text.Title).toBe("گزارش سالانه");
        expect(metadata.text.Author).toBe("Sam");
        expect(metadata.text.Producer).toBe("");
        expect(metadata.created?.toISOString()).toBe(created.toISOString());
        expect(metadata.modified).toBeUndefined();
        expect(latin1(output)).not.toContain("Jane Roe");
    });

    it("names the output", () => {
        expect(outputName("Plan.pdf")).toBe("Plan-metadata.pdf");
    });
});
