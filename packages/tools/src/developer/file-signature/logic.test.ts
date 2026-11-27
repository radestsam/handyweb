import { describe, expect, it } from "vitest";
import { detect } from "./logic";

const bytes = (hex: string) =>
    Uint8Array.from(hex.match(/../g) ?? [], (pair) => parseInt(pair, 16));

describe("detect", () => {
    it("finds common formats", () => {
        expect(detect(bytes("89504e470d0a1a0a0000"), "a.png").matches[0]?.name).toBe("PNG image");
        expect(detect(bytes("ffd8ffe000"), "a.jpg").matches[0]?.mime).toBe("image/jpeg");
        expect(detect(bytes("255044462d312e37"), "a.pdf").matches[0]?.kind).toBe("document");
        expect(detect(bytes("504b030414"), "report.docx").mismatch).toBe(false);
    });

    it("reads signatures with any bytes and an offset", () => {
        expect(detect(bytes("52494646aabbccdd57454250"), "x.webp").matches[0]?.name).toBe(
            "WebP image",
        );
        expect(detect(bytes("52494646aabbccdd57415645"), "x.wav").matches[0]?.name).toBe(
            "WAV audio",
        );
        expect(detect(bytes("0000001c6674797061766966"), "x.avif").matches[0]?.name).toBe(
            "AVIF image",
        );
        expect(detect(bytes("47494638396100"), "x.gif").matches[0]?.name).toBe("GIF image");
    });

    it("flags a program disguised as an image", () => {
        const result = detect(bytes("4d5a90000300"), "photo.jpg");
        expect(result.matches[0]?.kind).toBe("executable");
        expect(result.mismatch).toBe(true);
        expect(result.extension).toBe("jpg");
    });

    it("finds a TAR header at offset 257", () => {
        const data = new Uint8Array(300);
        data.set(bytes("7573746172"), 257);
        expect(detect(data, "a.tar").matches[0]?.name).toBe("TAR archive");
    });

    it("says when nothing is known and the bytes look like text", () => {
        const result = detect(new TextEncoder().encode("سلام دنیا\n"), "notes.txt");
        expect(result.matches).toEqual([]);
        expect(result.looksLikeText).toBe(true);
        expect(detect(bytes("000102"), "x.bin").looksLikeText).toBe(false);
    });
});
