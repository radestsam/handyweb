import { describe, expect, it } from "vitest";
import { readExif } from "./exif";
import { PLAIN_JPEG, RICH_JPEG, RICH_PNG, richWebp, SAMPLE_TIFF } from "./fixtures";
import { cleanName, readMetadata, stripMetadata } from "./logic";

const value = (exif: ReturnType<typeof readExif>, en: string) =>
    exif.entries.find((entry) => entry.tag.label.en === en)?.value;

describe("readExif", () => {
    it("reads camera, photo, and GPS tags", () => {
        const exif = readExif(SAMPLE_TIFF);
        expect(value(exif, "Camera make")).toBe("Canon");
        expect(value(exif, "Camera model")).toBe("EOS R5");
        expect(value(exif, "F-number")).toBe("f/2.8");
        expect(value(exif, "ISO")).toBe("200");
        expect(value(exif, "Date taken")).toBe("2026:03:21 10:30:00");
        expect(value(exif, "Camera serial number")).toBe("SN12345");
        expect(exif.orientation).toBe(6);
        expect(exif.gps?.latitude).toBeCloseTo(35.69, 2);
        expect(exif.gps?.longitude).toBeCloseTo(51.3833, 3);
    });

    it("does not throw on broken data", () => {
        expect(
            readExif(Uint8Array.from([0x4d, 0x4d, 0, 42, 0xff, 0xff, 0xff, 0xff])).entries,
        ).toEqual([]);
        expect(readExif(new Uint8Array(3)).entries).toEqual([]);
    });
});

describe("JPEG", () => {
    it("lists every metadata block", () => {
        const report = readMetadata(RICH_JPEG);
        // The sips file adds its own EXIF and IPTC (Photoshop) blocks after ours.
        expect(report.blocks.map((block) => block.kind)).toEqual([
            "exif",
            "xmp",
            "icc",
            "comment",
            "exif",
            "iptc",
        ]);
        expect(report.blocks[3]?.label).toBe("secret comment");
    });

    it("removes metadata, keeps the pixels and the orientation, and proves it", () => {
        const result = stripMetadata(RICH_JPEG, { keepIcc: false });
        expect(result.remaining).toEqual([]);
        expect(result.keptOrientation).toBe(true);
        const after = readMetadata(result.bytes);
        expect(after.exif?.orientation).toBe(6);
        expect(after.exif?.gps).toBeNull();
        expect(new TextDecoder("latin1").decode(result.bytes)).not.toMatch(/Canon|SN12345|secret/);
        // The compressed image data, from the SOS marker on, is copied byte for byte.
        const scan = (bytes: Uint8Array) => {
            for (let i = 0; i + 3 < bytes.length; i++) {
                if (
                    bytes[i] === 0xff &&
                    bytes[i + 1] === 0xda &&
                    bytes[i + 2] === 0 &&
                    bytes[i + 3] === 12
                )
                    return bytes.subarray(i);
            }
            return new Uint8Array();
        };
        expect(scan(result.bytes).length).toBeGreaterThan(0);
        expect(scan(result.bytes)).toEqual(scan(PLAIN_JPEG));
    });

    it("keeps the color profile when asked", () => {
        const result = stripMetadata(RICH_JPEG, { keepIcc: true });
        expect(readMetadata(result.bytes).blocks.map((block) => block.kind)).toEqual([
            "exif",
            "icc",
        ]);
        expect(result.remaining).toEqual([]);
    });
});

describe("PNG", () => {
    it("reads and removes text, EXIF, and time chunks", () => {
        const report = readMetadata(RICH_PNG);
        expect(report.blocks.map((block) => block.kind)).toEqual(["text", "exif", "time"]);
        expect(report.blocks[0]?.label).toBe("Author: Sara");
        expect(report.exif?.gps).not.toBeNull();
        const result = stripMetadata(RICH_PNG, { keepIcc: true });
        expect(result.remaining).toEqual([]);
        expect(readMetadata(result.bytes).blocks).toEqual([]);
    });
});

describe("WebP", () => {
    it("reads and removes EXIF and XMP, and clears the flags", () => {
        const webp = richWebp();
        expect(readMetadata(webp).blocks.map((block) => block.kind)).toEqual(["exif", "xmp"]);
        const result = stripMetadata(webp, { keepIcc: true });
        expect(result.remaining).toEqual([]);
        expect(result.bytes[20]! & 0x0c).toBe(0);
        // The RIFF size matches the file.
        expect(new DataView(result.bytes.buffer).getUint32(4, true)).toBe(result.bytes.length - 8);
    });
});

describe("other input", () => {
    it("refuses other formats and names the output", () => {
        expect(() => readMetadata(new TextEncoder().encode("GIF89a-------"))).toThrow(
            /JPEG, PNG, and WebP/,
        );
        expect(cleanName("IMG_0001.JPG")).toBe("IMG_0001-clean.JPG");
    });
});
