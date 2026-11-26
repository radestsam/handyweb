import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { base64ToBytes, decodeBase64, encodeBase64 } from "./logic";

// RFC 4648 section 10 test vectors.
const VECTORS: Array<[string, string]> = [
    ["", ""],
    ["f", "Zg=="],
    ["fo", "Zm8="],
    ["foo", "Zm9v"],
    ["foob", "Zm9vYg=="],
    ["fooba", "Zm9vYmE="],
    ["foobar", "Zm9vYmFy"],
];

const failure = (run: () => unknown): ToolFailure => {
    try {
        run();
    } catch (error) {
        if (error instanceof ToolFailure) return error;
        throw error;
    }
    throw new Error("Expected a ToolFailure");
};

describe("encodeBase64", () => {
    it.each(VECTORS)("encodes %j as %j", (text, encoded) => {
        expect(encodeBase64(text)).toBe(encoded);
    });

    it("encodes Persian text as UTF-8", () => {
        expect(encodeBase64("سلام")).toBe("2LPZhNin2YU=");
    });

    it("encodes emoji (characters outside the BMP)", () => {
        expect(encodeBase64("😀")).toBe("8J+YgA==");
    });

    it("uses the URL-safe alphabet and drops padding on request", () => {
        expect(encodeBase64("ûÿ", { urlSafe: false, padding: true })).toBe("w7vDvw==");
        expect(encodeBase64("ûÿ", { urlSafe: true, padding: false })).toBe("w7vDvw");
        expect(encodeBase64("?>", { urlSafe: true, padding: true })).toBe("Pz4=");
        expect(encodeBase64("~~~", { urlSafe: false, padding: true })).toBe("fn5+");
        expect(encodeBase64("~~~", { urlSafe: true, padding: true })).toBe("fn5-");
    });

    it("encodes a large input without a stack overflow", () => {
        const text = "a".repeat(3 * 200_000);
        expect(encodeBase64(text)).toHaveLength(800_000);
    });
});

describe("decodeBase64", () => {
    it.each(VECTORS)("decodes %j from %j", (text, encoded) => {
        expect(decodeBase64(encoded)).toBe(text);
    });

    it("round-trips Persian and emoji text", () => {
        const text = "متن فارسی با نیم‌فاصله و 😀 و English";
        expect(decodeBase64(encodeBase64(text))).toBe(text);
    });

    it("accepts URL-safe input, missing padding, and line breaks", () => {
        expect(decodeBase64("fn5-")).toBe("~~~");
        expect(decodeBase64("Zm9vYg")).toBe("foob");
        expect(decodeBase64("Zm9v\nYmFy\r\n")).toBe("foobar");
        expect(decodeBase64("  Zm9v YmFy  ")).toBe("foobar");
    });

    it("names the position of an invalid character", () => {
        const error = failure(() => decodeBase64("Zm9v*mFy"));
        expect(error.code).toBe("invalid-input");
        expect(error.localized.en).toContain("position 5");
    });

    it("rejects a mix of both alphabets", () => {
        expect(failure(() => decodeBase64("ab+c-d==")).code).toBe("invalid-input");
    });

    it("rejects an impossible length and bad padding", () => {
        expect(failure(() => decodeBase64("Zm9vY")).detail).toBe("length");
        expect(failure(() => decodeBase64("Zm9===")).detail).toBe("too-much-padding");
        expect(failure(() => decodeBase64("Zm9vYg=")).detail).toBe("padding");
    });

    it("reports binary data instead of showing replacement characters", () => {
        const error = failure(() => decodeBase64("/w=="));
        expect(error.localized.en).toContain("not UTF-8 text");
    });

    it("decodes bytes", () => {
        expect([...base64ToBytes("AAEC/w==")]).toEqual([0, 1, 2, 255]);
    });
});
