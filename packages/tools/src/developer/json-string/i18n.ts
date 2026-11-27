import type { LocalizedText } from "@handyweb/core";

export const strings = {
    mode: { fa: "کار", en: "Action" },
    escape: { fa: "رمزگذاری", en: "Escape" },
    unescape: { fa: "رمزگشایی", en: "Unescape" },
    asciiOnly: {
        fa: "تنها ASCII (\\uXXXX برای حروف دیگر)",
        en: "ASCII only (\\uXXXX for other characters)",
    },
    quotes: { fa: "با گیومه دوگانه", en: "With double quotes" },
    text: { fa: "نوشته", en: "Text" },
    json: { fa: "رشته JSON", en: "JSON string" },
    swap: { fa: "جابه‌جایی ورودی و خروجی", en: "Swap input and output" },
} as const satisfies Record<string, LocalizedText>;
