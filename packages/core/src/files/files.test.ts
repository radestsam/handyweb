// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { checkFileSize, formatBytes } from "./validate";
import { sniffBytes, sniffFile } from "./sniff";
import { ObjectUrls, safeFileName } from "./output";

describe("checkFileSize", () => {
    it("rejects a zero-byte file", () => {
        expect(checkFileSize({ size: 0 }, 100)).toMatchObject({ ok: false, code: "empty" });
    });

    it("accepts a file at the limit and rejects one byte more", () => {
        expect(checkFileSize({ size: 100 }, 100)).toEqual({ ok: true });
        const result = checkFileSize({ size: 101 }, 100);
        expect(result).toMatchObject({ ok: false, code: "too-large" });
    });

    it("accepts any size when the tool has no limit", () => {
        expect(checkFileSize({ size: 10 ** 12 }, undefined)).toEqual({ ok: true });
    });

    it("names both sizes in the message", () => {
        const result = checkFileSize({ size: 2_500_000 }, 1_000_000);
        expect(result.ok || result.message.en).toBe(
            "The file is 2.5 MB. This tool accepts up to 1 MB.",
        );
        expect(result.ok || result.message.fa).toContain("مگابایت");
    });
});

describe("formatBytes", () => {
    it("uses decimal units", () => {
        expect(formatBytes(999)).toBe("999 B");
        expect(formatBytes(1500)).toBe("1.5 KB");
        expect(formatBytes(5_000_000_000)).toBe("5 GB");
    });

    it("uses Persian digits in Persian", () => {
        expect(formatBytes(1500, "fa")).toBe("۱٫۵ کیلوبایت");
    });
});

describe("sniff", () => {
    const bytes = (...values: number[]) => new Uint8Array([...values, ...new Array(16).fill(0)]);

    it("detects common types by their magic bytes", () => {
        expect(sniffBytes(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a))).toBe("png");
        expect(sniffBytes(bytes(0xff, 0xd8, 0xff, 0xe0))).toBe("jpeg");
        expect(sniffBytes(new TextEncoder().encode("%PDF-1.7\n.........."))).toBe("pdf");
        expect(sniffBytes(new TextEncoder().encode("RIFF....WEBPVP8 "))).toBe("webp");
        expect(sniffBytes(bytes(0x1f, 0x8b, 0x08))).toBe("gzip");
    });

    it("does not trust the file name", async () => {
        const fake = new File([new TextEncoder().encode("hello world")], "photo.png", {
            type: "image/png",
        });
        expect(await sniffFile(fake)).toBe("unknown");
    });

    it("handles an empty file", () => {
        expect(sniffBytes(new Uint8Array())).toBe("unknown");
    });
});

describe("ObjectUrls", () => {
    it("revokes every URL it created", () => {
        let n = 0;
        const create = vi.spyOn(URL, "createObjectURL").mockImplementation(() => `blob:${n++}`);
        const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
        const urls = new ObjectUrls();
        urls.create(new Blob(["a"]));
        urls.create(new Blob(["b"]));
        expect(urls.size).toBe(2);
        urls.revokeAll();
        expect(revoke).toHaveBeenCalledTimes(2);
        expect(urls.size).toBe(0);
        create.mockRestore();
        revoke.mockRestore();
    });
});

describe("safeFileName", () => {
    it("removes path separators and forbidden characters", () => {
        expect(safeFileName("../../etc/passwd")).toBe("_.._etc_passwd");
        expect(safeFileName('a<b>c:"d|e?*.txt')).toBe("a_b_c__d_e__.txt");
    });

    it("keeps Persian names", () => {
        expect(safeFileName("گزارش نهایی.pdf")).toBe("گزارش نهایی.pdf");
    });

    it("never returns an empty name", () => {
        expect(safeFileName("...")).toBe("handyweb-output");
        expect(safeFileName("")).toBe("handyweb-output");
    });
});
