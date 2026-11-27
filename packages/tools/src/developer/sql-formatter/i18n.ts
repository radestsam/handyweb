import type { LocalizedText } from "@handyweb/core";

export const strings = {
    dialect: { fa: "گویش SQL", en: "SQL dialect" },
    keywordCase: { fa: "واژه‌های کلیدی", en: "Keywords" },
    upper: { fa: "بزرگ", en: "UPPER" },
    lower: { fa: "کوچک", en: "lower" },
    preserve: { fa: "دست‌نخورده", en: "Keep" },
    indent: { fa: "تورفتگی", en: "Indent" },
    spaces2: { fa: "۲ اسپیس", en: "2 spaces" },
    spaces4: { fa: "۴ اسپیس", en: "4 spaces" },
} as const satisfies Record<string, LocalizedText>;
