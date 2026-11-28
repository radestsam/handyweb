import { describe, expect, it } from "vitest";
import { crc32, makeZip, readStoredZip } from "./zip";

describe("zip", () => {
    it("computes CRC-32", () => {
        expect(crc32(new TextEncoder().encode("hello"))).toBe(0x3610a686);
        expect(crc32(new Uint8Array())).toBe(0);
    });

    it("writes a stored ZIP that reads back, with UTF-8 names", () => {
        const zip = makeZip([
            { name: "a.txt", data: new TextEncoder().encode("hello") },
            { name: "پوشه/ب.png", data: Uint8Array.from([1, 2, 3]) },
        ]);
        expect([...zip.slice(0, 4)]).toEqual([0x50, 0x4b, 0x03, 0x04]);
        const entries = readStoredZip(zip);
        expect(entries.map((e) => e.name)).toEqual(["a.txt", "پوشه/ب.png"]);
        expect(new TextDecoder().decode(entries[0]?.data)).toBe("hello");
        expect([...(entries[1]?.data ?? [])]).toEqual([1, 2, 3]);
        // The same input gives the same bytes.
        expect(makeZip([{ name: "a", data: new Uint8Array(1) }])).toEqual(
            makeZip([{ name: "a", data: new Uint8Array(1) }]),
        );
    });
});
