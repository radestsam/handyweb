import { describe, expect, it } from "vitest";
import { applyDiscounts, discountPercent, originalPrice } from "./logic";

describe("discount", () => {
    it("applies one and two discounts", () => {
        expect(applyDiscounts(1_000_000, [20])).toEqual({
            final: 800_000,
            saved: 200_000,
            totalPercent: 20,
        });
        const two = applyDiscounts(100, [20, 10]);
        expect(two.final).toBeCloseTo(72, 10);
        expect(two.totalPercent).toBeCloseTo(28, 10);
    });

    it("finds the percent and the original price", () => {
        expect(discountPercent(250, 200)).toBe(20);
        expect(discountPercent(0, 5)).toBeNull();
        expect(originalPrice(800, 20)).toBe(1000);
        expect(originalPrice(0, 100)).toBeNull();
    });
});
