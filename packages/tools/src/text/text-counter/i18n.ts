import type { LocalizedText } from "@handyweb/core";

export const strings = {
    counts: { fa: "شمارش‌ها", en: "Counts" },
    words: { fa: "واژه", en: "Words" },
    characters: { fa: "نویسه", en: "Characters" },
    charactersNoSpaces: { fa: "نویسه بی اسپیس", en: "Characters without spaces" },
    lines: { fa: "خط", en: "Lines" },
    paragraphs: { fa: "بند", en: "Paragraphs" },
    sentences: { fa: "جمله", en: "Sentences" },
    readingTime: { fa: "زمان خواندن", en: "Reading time" },
    wordsPerMinute: { fa: "واژه در دقیقه", en: "Words per minute" },
    minutes: { fa: "دقیقه", en: "min" },
    seconds: { fa: "ثانیه", en: "s" },
    and: { fa: " و ", en: " " },
} as const satisfies Record<string, LocalizedText>;
