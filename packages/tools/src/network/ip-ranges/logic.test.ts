import { describe, expect, it } from "vitest";
import { rangesFor, SPECIAL } from "./logic";

describe("IP ranges", () => {
    it("finds the range of an address", () => {
        expect(rangesFor("192.168.0.5")?.map((r) => r.network)).toEqual(["192.168.0.0"]);
        expect(rangesFor("100.70.1.1")?.[0]?.name.en).toBe("Carrier-grade NAT (RFC 6598)");
        expect(rangesFor("fd12::1")?.[0]?.network).toBe("fc00::");
        expect(rangesFor("8.8.8.8")).toEqual([]);
        expect(rangesFor("not an ip")).toBeNull();
    });

    it("lists the most specific range first", () => {
        expect(rangesFor("::1")?.map((r) => r.prefix)).toEqual([128]);
    });

    it("has names in both languages", () => {
        for (const range of SPECIAL) expect(range.name.fa && range.name.en).toBeTruthy();
    });
});
