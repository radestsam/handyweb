import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { decodeBytes, encodeBytes, type EncodeOptions } from "./logic";

const plain: EncodeOptions = { separator: "space", prefix: false, uppercase: false };

function detail(fn: () => unknown): string | undefined {
    try {
        fn();
    } catch (error) {
        if (error instanceof ToolFailure) return error.detail;
        throw error;
    }
    throw new Error("expected a ToolFailure");
}

describe("encodeBytes", () => {
    it("writes UTF-8 bytes as hex", () => {
        expect(encodeBytes("Hi", 16, plain)).toBe("48 69");
        expect(encodeBytes("س", 16, { ...plain, uppercase: true, separator: "none" })).toBe("D8B3");
        expect(encodeBytes("ab", 16, { separator: "comma", prefix: true, uppercase: false })).toBe(
            "0x61, 0x62",
        );
    });

    it("writes bytes as binary", () => {
        expect(encodeBytes("A", 2, plain)).toBe("01000001");
        expect(encodeBytes("😀", 2, { ...plain, separator: "colon" })).toBe(
            "11110000:10011111:10011000:10000000",
        );
    });
});

describe("decodeBytes", () => {
    it("reads hex in many forms", () => {
        expect(decodeBytes("48 65 6c 6c 6f", 16)).toBe("Hello");
        expect(decodeBytes("0xD8, 0xB3", 16)).toBe("س");
        expect(decodeBytes("\\xd8\\xb3", 16)).toBe("س");
        expect(decodeBytes("d8:b3", 16)).toBe("س");
    });

    it("reads binary", () => {
        expect(decodeBytes("01001000 01101001", 2)).toBe("Hi");
    });

    it("round-trips Persian and emoji", () => {
        const text = "کتاب‌ها 😀";
        expect(decodeBytes(encodeBytes(text, 16, plain), 16)).toBe(text);
        expect(decodeBytes(encodeBytes(text, 2, plain), 2)).toBe(text);
    });

    it("reports bad digits, length, and invalid UTF-8", () => {
        expect(detail(() => decodeBytes("4g", 16))).toBe("digit");
        expect(detail(() => decodeBytes("486", 16))).toBe("length");
        expect(detail(() => decodeBytes("0102", 2))).toBe("digit");
        expect(detail(() => decodeBytes("0100000", 2))).toBe("length");
        expect(detail(() => decodeBytes("ff", 16))).toBe("utf-8");
    });
});
