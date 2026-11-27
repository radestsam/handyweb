import type { LocalizedText } from "@handyweb/core";

export const strings = {
    mode: { fa: "شیوه", en: "Case" },
    upper: { fa: "همه بزرگ", en: "UPPER" },
    lower: { fa: "همه کوچک", en: "lower" },
    title: { fa: "شیوه عنوان", en: "Title" },
    sentence: { fa: "شیوه جمله", en: "Sentence" },
} as const satisfies Record<string, LocalizedText>;
