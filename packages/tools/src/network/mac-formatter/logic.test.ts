import { describe, expect, it } from "vitest";
import { eui64, formatMac, formatMany, parseMac } from "./logic";

describe("MAC addresses", () => {
    it("reads every common style", () => {
        const expected = [0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5e];
        for (const text of [
            "00:1A:2B:3C:4D:5E",
            "00-1a-2b-3c-4d-5e",
            "001a.2b3c.4d5e",
            "001A2B3C4D5E",
        ])
            expect(parseMac(text).bytes).toEqual(expected);
        expect(() => parseMac("00:1A:2B:3C:4D")).toThrow(/12 hex/);
    });

    it("writes every style", () => {
        const bytes = parseMac("001a2b3c4d5e").bytes;
        expect(formatMac(bytes, "colon", true)).toBe("00:1A:2B:3C:4D:5E");
        expect(formatMac(bytes, "hyphen", false)).toBe("00-1a-2b-3c-4d-5e");
        expect(formatMac(bytes, "dot", false)).toBe("001a.2b3c.4d5e");
    });

    it("reads the I/G and U/L bits", () => {
        expect(parseMac("01:00:5e:00:00:01")).toMatchObject({ multicast: true, local: false });
        expect(parseMac("da:a1:19:00:00:01")).toMatchObject({ multicast: false, local: true });
        expect(parseMac("ff:ff:ff:ff:ff:ff").broadcast).toBe(true);
    });

    it("builds the EUI-64 interface ID", () => {
        expect(eui64(parseMac("00:1a:2b:3c:4d:5e").bytes)).toBe("21a:2bff:fe3c:4d5e");
    });

    it("formats many lines and marks bad ones", () => {
        expect(formatMany("00:1a:2b:3c:4d:5e\nbad\n", "plain", false)).toEqual([
            { input: "00:1a:2b:3c:4d:5e", output: "001a2b3c4d5e" },
            { input: "bad", output: null },
        ]);
    });
});
