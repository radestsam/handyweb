import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import {
    computeHmac,
    encodeMac,
    keyBytes,
    parseExpected,
    verifyHmac,
    type HmacInput,
} from "./logic";

// RFC 4231 test case 2.
const JEFE: HmacInput = {
    message: "what do ya want for nothing?",
    key: "Jefe",
    keyFormat: "text",
    algorithm: "SHA-256",
};
const JEFE_HEX = {
    "SHA-256": "5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843",
    "SHA-384":
        "af45d2e376484031617f78d2b58a6b1b9c7ef464f5a01b47e42ec3736322445e8e2240ca5e69e2c78b3239ecfab21649",
    "SHA-512":
        "164b7a7bfcf819e2e395fbe73b56e0a387bd64222e831fd610270cd7ea2505549758bf75c05a994a6d034f65f8f0e6fdcaeab1a34d4a6b4b636e070a38bce737",
} as const;

async function rejects(promise: Promise<unknown>): Promise<ToolFailure> {
    try {
        await promise;
    } catch (error) {
        if (error instanceof ToolFailure) return error;
        throw error;
    }
    throw new Error("expected a ToolFailure");
}

describe("computeHmac", () => {
    it.each(Object.entries(JEFE_HEX))("matches RFC 4231 case 2 for %s", async (algorithm, hex) => {
        const mac = await computeHmac({ ...JEFE, algorithm: algorithm as HmacInput["algorithm"] });
        expect(encodeMac(mac, "hex")).toBe(hex);
    });

    it("reads a hex key (RFC 4231 case 1)", async () => {
        const mac = await computeHmac({
            message: "Hi There",
            key: "0b".repeat(20),
            keyFormat: "hex",
            algorithm: "SHA-256",
        });
        expect(encodeMac(mac, "hex")).toBe(
            "b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7",
        );
    });

    it("reads Persian text as UTF-8", async () => {
        const mac = await computeHmac({ ...JEFE, message: "سلام", key: "کلید" });
        expect(encodeMac(mac, "hex")).toBe(
            "9dd7439491a19706c5539a3fc491cfb971c5e4917ebe9764bf2f4b62a39aaf1d",
        );
    });

    it("rejects an empty or a malformed key", async () => {
        expect((await rejects(computeHmac({ ...JEFE, key: "" }))).detail).toBe("empty key");
        expect((await rejects(computeHmac({ ...JEFE, key: "abc", keyFormat: "hex" }))).detail).toBe(
            "hex length",
        );
        expect((await rejects(computeHmac({ ...JEFE, key: "zz", keyFormat: "hex" }))).detail).toBe(
            "hex",
        );
        expect(
            (await rejects(computeHmac({ ...JEFE, key: "a*b", keyFormat: "base64" }))).detail,
        ).toBe("base64");
    });
});

describe("keyBytes", () => {
    it("reads Base64 and Base64url keys", () => {
        expect(keyBytes("SmVmZQ==", "base64")).toEqual(new TextEncoder().encode("Jefe"));
        expect(keyBytes("-_8", "base64")).toEqual(new Uint8Array([0xfb, 0xff]));
    });
});

describe("verifyHmac", () => {
    it("accepts the right MAC in hex, Base64, and with a webhook prefix", async () => {
        const mac = await computeHmac(JEFE);
        expect(await verifyHmac(JEFE, JEFE_HEX["SHA-256"].toUpperCase())).toBe(true);
        expect(await verifyHmac(JEFE, encodeMac(mac, "base64"))).toBe(true);
        expect(await verifyHmac(JEFE, `sha256=${JEFE_HEX["SHA-256"]}`)).toBe(true);
    });

    it("rejects a wrong MAC", async () => {
        const wrong = JEFE_HEX["SHA-256"].replace(/^5b/, "5c");
        expect(await verifyHmac(JEFE, wrong)).toBe(false);
        expect(await verifyHmac({ ...JEFE, message: "changed" }, JEFE_HEX["SHA-256"])).toBe(false);
    });

    it("returns null for a value it cannot read", async () => {
        expect(await verifyHmac(JEFE, "")).toBeNull();
        expect(await verifyHmac(JEFE, "abcd")).toBeNull();
        expect(parseExpected(JEFE_HEX["SHA-512"], "SHA-256")).toBeNull();
    });
});
