import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { base64ToBytes } from "../base64/logic";
import { compress, decompress, detectFormat, FORMATS } from "./logic";

const text = new TextEncoder().encode("سلام HandyWeb ".repeat(200));

describe("compress and decompress", () => {
    it.each(FORMATS)("round-trips %s", async (format) => {
        const packed = await compress(text, format);
        expect(packed.length).toBeLessThan(text.length);
        expect(await decompress(packed, format)).toEqual(text);
    });

    it("reads gzip and zlib data made by Python", async () => {
        const hello = new TextEncoder().encode("hello hello hello");
        expect(
            await decompress(base64ToBytes("H4sIAAAAAAACE8tIzcnJV8hAkACAiPnlEQAAAA=="), "gzip"),
        ).toEqual(hello);
        expect(await decompress(base64ToBytes("eJzLSM3JyVfIQJAAOi4GfQ=="), "deflate")).toEqual(
            hello,
        );
    });

    it("stops at the output limit", async () => {
        const bomb = await compress(new Uint8Array(5_000_000), "gzip");
        await expect(decompress(bomb, "gzip", 1_000_000)).rejects.toMatchObject({
            detail: "output limit",
        });
    });

    it("reports data of the wrong format", async () => {
        await expect(decompress(text, "gzip")).rejects.toBeInstanceOf(ToolFailure);
    });
});

describe("detectFormat", () => {
    it("finds gzip and zlib headers", async () => {
        expect(detectFormat(await compress(text, "gzip"))).toBe("gzip");
        expect(detectFormat(await compress(text, "deflate"))).toBe("deflate");
        expect(detectFormat(text)).toBeNull();
    });
});
