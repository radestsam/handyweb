import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { base32Decode, hotp, parseTotp, totpAt, type TotpAlgorithm } from "./logic";

const ascii = (text: string) => new TextEncoder().encode(text) as Uint8Array<ArrayBuffer>;

describe("hotp", () => {
    it("matches RFC 4226 appendix D", async () => {
        const secret = ascii("12345678901234567890");
        const expected = ["755224", "287082", "359152", "969429", "338314"];
        for (const [counter, code] of expected.entries()) {
            expect(await hotp(secret, counter, 6, "SHA-1")).toBe(code);
        }
    });
});

describe("totpAt", () => {
    // RFC 6238 appendix B, 8 digits.
    const cases: Array<[TotpAlgorithm, string, number, string]> = [
        ["SHA-1", "12345678901234567890", 59, "94287082"],
        ["SHA-1", "12345678901234567890", 1111111109, "07081804"],
        ["SHA-256", "12345678901234567890123456789012", 59, "46119246"],
        ["SHA-256", "12345678901234567890123456789012", 2000000000, "90698825"],
        [
            "SHA-512",
            "1234567890123456789012345678901234567890123456789012345678901234",
            59,
            "90693936",
        ],
        [
            "SHA-512",
            "1234567890123456789012345678901234567890123456789012345678901234",
            20000000000,
            "47863826",
        ],
    ];
    it.each(cases)("%s at %s", async (algorithm, secret, seconds, code) => {
        const config = {
            secret: ascii(secret),
            algorithm,
            digits: 8,
            period: 30,
            label: "",
            issuer: "",
        };
        expect((await totpAt(config, seconds * 1000)).code).toBe(code);
    });

    it("counts the seconds left", async () => {
        const config = parseTotp("JBSWY3DPEHPK3PXP");
        expect((await totpAt(config, 61_000)).remaining).toBe(29);
    });
});

describe("parsing", () => {
    it("reads Base32 with spaces and lower case", () => {
        expect(base32Decode("jbsw y3dp ehpk 3pxp")).toEqual(base32Decode("JBSWY3DPEHPK3PXP"));
        expect([...base32Decode("JBSWY3DPEHPK3PXP")]).toEqual([
            72, 101, 108, 108, 111, 33, 222, 173, 190, 239,
        ]);
    });

    it("reads an otpauth link", () => {
        const config = parseTotp(
            "otpauth://totp/HandyWeb:sara%40example.com?secret=JBSWY3DPEHPK3PXP&issuer=HandyWeb&algorithm=SHA256&digits=8&period=60",
        );
        expect(config).toMatchObject({
            algorithm: "SHA-256",
            digits: 8,
            period: 60,
            label: "HandyWeb:sara@example.com",
            issuer: "HandyWeb",
        });
    });

    it("rejects bad input", () => {
        expect(() => parseTotp("ABC1")).toThrow(ToolFailure);
        expect(() => parseTotp("otpauth://hotp/x?secret=JBSWY3DP")).toThrow(ToolFailure);
        expect(() => parseTotp("otpauth://totp/x?secret=JBSWY3DP&digits=12")).toThrow(ToolFailure);
        expect(() => parseTotp("  ")).toThrow(ToolFailure);
    });
});
