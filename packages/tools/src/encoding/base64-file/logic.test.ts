import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { decodeFile, encodeFile } from "./logic";

const PNG = new Uint8Array([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 73, 72, 68, 82,
]);

describe("encodeFile", () => {
    it("detects the type from the bytes", () => {
        const result = encodeFile(PNG, "application/octet-stream");
        expect(result.mime).toBe("image/png");
        expect(result.dataUri.startsWith("data:image/png;base64,iVBORw0KGgo")).toBe(true);
    });

    it("falls back to the reported type", () => {
        expect(encodeFile(new TextEncoder().encode("hello"), "text/plain")).toEqual({
            base64: "aGVsbG8=",
            dataUri: "data:text/plain;base64,aGVsbG8=",
            mime: "text/plain",
        });
        expect(encodeFile(new Uint8Array([1, 2]), "").mime).toBe("application/octet-stream");
    });
});

describe("decodeFile", () => {
    it("reads a Data URI and plain Base64", () => {
        const uri = encodeFile(PNG, "").dataUri;
        expect(decodeFile(uri)).toEqual({ bytes: PNG, mime: "image/png", fileName: "file.png" });
        expect(decodeFile("aGVsbG8=")).toMatchObject({
            mime: "application/octet-stream",
            fileName: "file.bin",
        });
        expect(decodeFile("data:text/plain;charset=utf-8;base64,aGVsbG8=").mime).toBe("text/plain");
    });

    it("rejects a Data URI that is not Base64 and bad Base64", () => {
        expect(() => decodeFile("data:text/plain,hello")).toThrow(ToolFailure);
        expect(() => decodeFile("a*b")).toThrow(ToolFailure);
    });
});
