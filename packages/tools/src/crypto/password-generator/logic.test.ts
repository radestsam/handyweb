import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import {
    DEFAULT_PASSPHRASE,
    DEFAULT_PASSWORD,
    SETS,
    SIMILAR,
    generatePassphrase,
    generatePassword,
    passphraseBits,
    passwordBits,
    randomInt,
    strength,
    type PasswordOptions,
    type RandomSource,
} from "./logic";
import { EFF_WORDS } from "./words";

/** A source that returns the given values in order, then repeats them. */
function fixed(...values: number[]): RandomSource {
    let i = 0;
    return (buffer) => {
        for (let k = 0; k < buffer.length; k++) buffer[k] = values[i++ % values.length] as number;
        return buffer;
    };
}

function failure(fn: () => unknown): ToolFailure {
    try {
        fn();
    } catch (error) {
        if (error instanceof ToolFailure) return error;
        throw error;
    }
    throw new Error("expected a ToolFailure");
}

describe("randomInt", () => {
    it("draws again above the largest multiple, so there is no modulo bias", () => {
        // For max 3, the limit is 2^32 - 1. The value 2^32 - 1 is rejected.
        expect(randomInt(3, fixed(2 ** 32 - 1, 7))).toBe(1);
        expect(randomInt(10, fixed(2 ** 32 - 1, 2 ** 32 - 6, 25))).toBe(5);
    });

    it("stays in range with real randomness", () => {
        for (let i = 0; i < 1000; i++) {
            const value = randomInt(7);
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(7);
        }
    });

    it("is roughly uniform", () => {
        const counts = new Array(6).fill(0) as number[];
        for (let i = 0; i < 60_000; i++) counts[randomInt(6)]!++;
        for (const count of counts) expect(Math.abs(count - 10_000)).toBeLessThan(600);
    });
});

describe("generatePassword", () => {
    it("has the length and one character of each chosen set", () => {
        for (let i = 0; i < 200; i++) {
            const password = generatePassword({ ...DEFAULT_PASSWORD, length: 8 });
            expect(password).toHaveLength(8);
            for (const set of Object.values(SETS)) {
                expect([...set].some((char) => password.includes(char))).toBe(true);
            }
        }
    });

    it("uses only the chosen sets", () => {
        const options: PasswordOptions = {
            length: 64,
            sets: { lower: false, upper: false, digits: true, symbols: false },
            excludeSimilar: false,
        };
        expect(generatePassword(options)).toMatch(/^[0-9]{64}$/);
    });

    it("can leave out similar characters", () => {
        const options = { ...DEFAULT_PASSWORD, length: 128, excludeSimilar: true };
        for (let i = 0; i < 20; i++) {
            const password = generatePassword(options);
            expect([...SIMILAR].some((char) => password.includes(char))).toBe(false);
        }
    });

    it("rejects a bad length or no sets", () => {
        expect(failure(() => generatePassword({ ...DEFAULT_PASSWORD, length: 3 })).detail).toBe(
            "length",
        );
        expect(
            failure(() =>
                generatePassword({
                    ...DEFAULT_PASSWORD,
                    sets: { lower: false, upper: false, digits: false, symbols: false },
                }),
            ).detail,
        ).toBe("no sets");
    });

    it("computes the strength in bits", () => {
        expect(passwordBits(DEFAULT_PASSWORD)).toBeCloseTo(20 * Math.log2(26 + 26 + 10 + 28));
        expect(strength(passwordBits(DEFAULT_PASSWORD))).toBe("very-strong");
    });
});

describe("generatePassphrase", () => {
    it("joins words from the list", () => {
        const phrase = generatePassphrase(DEFAULT_PASSPHRASE, ["alpha", "beta"], fixed(0, 1));
        expect(phrase).toBe("alpha-beta-alpha-beta-alpha-beta");
    });

    it("capitalizes and adds one digit", () => {
        const options = { ...DEFAULT_PASSPHRASE, words: 3, capitalize: true, addDigit: true };
        // Words 0, 1, 0; then the digit goes after word 2, and the digit is 7.
        expect(generatePassphrase(options, ["red", "sky"], fixed(0, 1, 0, 2, 7))).toBe(
            "Red-Sky-Red7",
        );
    });

    it("uses the EFF list", () => {
        expect(EFF_WORDS).toHaveLength(7776);
        expect(new Set(EFF_WORDS).size).toBe(7776);
        const words = generatePassphrase({ ...DEFAULT_PASSPHRASE, separator: " " }, EFF_WORDS);
        for (const word of words.split(" ")) expect(EFF_WORDS).toContain(word);
    });

    it("computes the strength in bits", () => {
        expect(passphraseBits(DEFAULT_PASSPHRASE, 7776)).toBeCloseTo(77.55, 1);
        expect(strength(passphraseBits({ ...DEFAULT_PASSPHRASE, words: 4 }, 7776))).toBe("fair");
    });

    it("rejects a bad number of words", () => {
        expect(
            failure(() => generatePassphrase({ ...DEFAULT_PASSPHRASE, words: 2 }, EFF_WORDS))
                .detail,
        ).toBe("words");
    });
});
