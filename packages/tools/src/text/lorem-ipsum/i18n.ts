import type { LocalizedText } from "@handyweb/core";

export const strings = {
    language: { fa: "زبان", en: "Language" },
    fa: { fa: "فارسی", en: "Persian" },
    la: { fa: "لاتین (Lorem ipsum)", en: "Latin (Lorem ipsum)" },
    unit: { fa: "گونه", en: "Unit" },
    paragraphs: { fa: "بند", en: "Paragraphs" },
    sentences: { fa: "جمله", en: "Sentences" },
    words: { fa: "واژه", en: "Words" },
    count: { fa: "شمار", en: "Count" },
    classicStart: {
        fa: "آغاز با «Lorem ipsum dolor sit amet»",
        en: "Start with “Lorem ipsum dolor sit amet”",
    },
    regenerate: { fa: "ساخت دوباره", en: "Generate again" },
} as const satisfies Record<string, LocalizedText>;
