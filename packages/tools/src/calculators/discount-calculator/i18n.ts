import type { LocalizedText } from "@handyweb/core";

export const strings = {
    price: { fa: "قیمت", en: "Price" },
    discount: { fa: "تخفیف", en: "Discount" },
    second: { fa: "تخفیف دوم (اختیاری)", en: "Second discount (optional)" },
    final: { fa: "قیمت پس از تخفیف", en: "Price after the discount" },
    saved: { fa: "مقدار صرفه‌جویی", en: "You save" },
    total: { fa: "تخفیف روی‌هم", en: "Total discount" },
    reverseTitle: { fa: "درصد تخفیف از دو قیمت", en: "Discount percent from two prices" },
    before: { fa: "قیمت پیش از تخفیف", en: "Price before" },
    after: { fa: "قیمت پس از تخفیف", en: "Price after" },
    stacked: {
        fa: "دو تخفیف پشت سر هم روی‌هم جمع نمی‌شوند: ۲۰٪ و سپس ۱۰٪ برابر ۲۸٪ است، نه ۳۰٪.",
        en: "Two discounts in a row do not add up: 20% and then 10% is 28%, not 30%.",
    },
} as const satisfies Record<string, LocalizedText>;
