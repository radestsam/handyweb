import type { LocalizedText } from "@handyweb/core";

export const strings = {
    color: { fa: "رنگ", en: "Color" },
    picker: { fa: "انتخاب رنگ", en: "Pick a color" },
    hint: {
        fa: "HEX، rgb()، hsl()، hwb() یا نام رنگ CSS.",
        en: "HEX, rgb(), hsl(), hwb(), or a CSS color name.",
    },
    formats: { fa: "شکل‌ها", en: "Formats" },
    contrast: { fa: "کنتراست با متن", en: "Contrast with text" },
    onWhite: { fa: "روی سفید", en: "On white" },
    onBlack: { fa: "روی سیاه", en: "On black" },
    pass: { fa: "پذیرفته برای متن (AA)", en: "Passes for text (AA)" },
    large: { fa: "تنها برای متن بزرگ", en: "Large text only" },
    failText: { fa: "برای متن کم است", en: "Too low for text" },
} as const satisfies Record<string, LocalizedText>;
