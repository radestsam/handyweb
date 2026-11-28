import type { LocalizedText } from "@handyweb/core";

export const strings = {
    number: { fa: "عدد", en: "Number" },
    hint: {
        fa: "شماره‌های فارسی و لاتین، جداکننده هزارگان و اعشار (تا ۶ رقم) پذیرفته می‌شوند.",
        en: "Persian and Latin digits, thousands separators, and decimals (up to 6 places) are accepted.",
    },
    ordinal: { fa: "عدد ترتیبی (بیست و یکم)", en: "Ordinal (بیست و یکم)" },
    unit: { fa: "یکای پول", en: "Currency" },
    none: { fa: "هیچ", en: "None" },
    rial: { fa: "ریال", en: "Rial" },
    toman: { fa: "تومان", en: "Toman" },
    words: { fa: "به حروف", en: "In Persian words" },
} as const satisfies Record<string, LocalizedText>;
