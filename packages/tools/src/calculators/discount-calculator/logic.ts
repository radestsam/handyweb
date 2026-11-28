export interface Discount {
    /** The price after all discounts. */
    final: number;
    /** How much is saved. */
    saved: number;
    /** The total discount in percent. Two discounts of 20% and 10% are 28%, not 30%. */
    totalPercent: number;
}

/** Applies one or more percent discounts one after the other. */
export function applyDiscounts(price: number, percents: number[]): Discount {
    const final = percents.reduce((value, percent) => value * (1 - percent / 100), price);
    return {
        final,
        saved: price - final,
        totalPercent: price === 0 ? 0 : ((price - final) / price) * 100,
    };
}

/** The discount percent from the price before and after. */
export function discountPercent(before: number, after: number): number | null {
    return before === 0 ? null : ((before - after) / before) * 100;
}

/** The price before the discount, from the price after it. */
export function originalPrice(after: number, percent: number): number | null {
    return percent >= 100 ? null : after / (1 - percent / 100);
}
