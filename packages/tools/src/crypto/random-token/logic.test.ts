import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import type { RandomSource } from "../password-generator/logic";
import {
    ALPHABETS,
    encodeBytes,
    generateMany,
    generateToken,
    randomBytes,
    tokenBits,
} from "./logic";

function fixed(...values: number[]): RandomSource {
    let i = 0;
    return (buffer) => {
        for (let k = 0; k < buffer.length; k++) buffer[k] = values[i++ % values.length] as number;
        return buffer;
    };
}

function detail(fn: () => unknown): string | undefined {
    try {
        fn();
    } catch (error) {
        if (error instanceof ToolFailure) return error.detail;
        throw error;
    }
    throw new Error("expected a ToolFailure");
}

describe("generateToken", () => {
    it("uses only the chosen alphabet and has the length", () => {
        for (const [name, chars] of Object.entries(ALPHABETS)) {
            const token = generateToken(name as keyof typeof ALPHABETS, 200);
            expect(token).toHaveLength(200);
            for (const char of token) expect(chars).toContain(char);
        }
    });

    it("maps random values to characters", () => {
        expect(generateToken("hex", 4, fixed(0, 15, 16, 31))).toBe("0f0f");
    });

    it("rejects a bad length", () => {
        expect(detail(() => generateToken("hex", 0))).toBe("length");
        expect(detail(() => generateToken("hex", 1025))).toBe("length");
        expect(detail(() => generateToken("hex", 2.5))).toBe("length");
    });

    it("computes the bits", () => {
        expect(tokenBits("hex", 32)).toBe(128);
        expect(tokenBits("base64url", 22)).toBe(132);
    });
});

describe("randomBytes", () => {
    it("returns the number of bytes asked for", () => {
        for (const count of [1, 3, 4, 5, 32, 1024]) expect(randomBytes(count)).toHaveLength(count);
    });

    it("takes the bytes from the random words", () => {
        expect(randomBytes(3, fixed(0x04030201))).toEqual(new Uint8Array([1, 2, 3]));
    });

    it("rejects a bad count", () => {
        expect(detail(() => randomBytes(0))).toBe("bytes");
    });
});

describe("encodeBytes", () => {
    const bytes = new Uint8Array([0xfb, 0xff, 0x00]);

    it("writes hex, Base64, and Base64url", () => {
        expect(encodeBytes(bytes, "hex")).toBe("fbff00");
        expect(encodeBytes(bytes, "base64")).toBe("+/8A");
        expect(encodeBytes(new Uint8Array([0xfb, 0xff]), "base64")).toBe("+/8=");
        expect(encodeBytes(new Uint8Array([0xfb, 0xff]), "base64url")).toBe("-_8");
    });
});

describe("generateMany", () => {
    it("writes one value per line", () => {
        let n = 0;
        expect(generateMany(3, () => String(n++))).toBe("0\n1\n2");
    });

    it("rejects a bad count", () => {
        expect(detail(() => generateMany(101, () => "x"))).toBe("count");
    });
});
