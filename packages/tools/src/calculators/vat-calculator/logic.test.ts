import { describe, expect, it } from "vitest";
import { addVat, removeVat } from "./logic";

describe("VAT", () => {
    it("adds VAT", () => {
        expect(addVat(1_000_000, 10)).toEqual({ net: 1_000_000, vat: 100_000, gross: 1_100_000 });
    });

    it("takes VAT out of a price", () => {
        const split = removeVat(1_100_000, 10);
        expect(split.net).toBeCloseTo(1_000_000, 6);
        expect(split.vat).toBeCloseTo(100_000, 6);
        // Taking 10% off the gross price is wrong; the VAT is 1/11 of it.
        expect(split.vat).not.toBeCloseTo(110_000, 0);
    });

    it("handles a rate of 0", () => {
        expect(removeVat(500, 0)).toEqual({ net: 500, vat: 0, gross: 500 });
    });
});
