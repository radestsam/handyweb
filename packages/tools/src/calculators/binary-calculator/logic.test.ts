import { describe, expect, it } from "vitest";
import { calculate, solve } from "./logic";

describe("binary calculator", () => {
    it("does arithmetic and bit operations", () => {
        expect(calculate(0b1010n, 0b0110n, "+")).toBe(16n);
        expect(calculate(7n, 2n, "/")).toBe(3n);
        expect(calculate(-7n, 2n, "/")).toBe(-3n);
        expect(calculate(0b1100n, 0b1010n, "AND")).toBe(0b1000n);
        expect(calculate(0b1100n, 0b1010n, "XOR")).toBe(0b0110n);
        expect(calculate(1n, 64n, "<<")).toBe(18446744073709551616n);
        expect(() => calculate(1n, 0n, "%")).toThrow(/zero/);
    });

    it("reads binary by default and writes every base", () => {
        expect(solve("1010", "110", "+", 2)).toEqual({
            binary: "1 0000",
            hex: "10",
            decimal: "16",
            octal: "20",
        });
        expect(solve("0xff", "1", "+", "auto").binary).toBe("1 0000 0000");
    });
});
