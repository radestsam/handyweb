import type { LocalizedText } from "@handyweb/core";

export const strings = {
    mode: { fa: "کار", en: "Operation" },
    encode: { fa: "رمزگذاری", en: "Escape" },
    decode: { fa: "رمزگشایی", en: "Unescape" },
    format: { fa: "شکل", en: "Format" },
    js: { fa: "JS / JSON", en: "JS / JSON" },
    es6: { fa: "ES6", en: "ES6" },
    python: { fa: "Python", en: "Python" },
    codepoint: { fa: "U+XXXX", en: "U+XXXX" },
    all: {
        fa: "حروف لاتین و شماره‌ها هم رمزگذاری شوند",
        en: "Escape ASCII letters and digits too",
    },
    text: { fa: "نوشته", en: "Text" },
    escaped: { fa: "رمزگذاری‌شده", en: "Escaped" },
    swap: { fa: "جابه‌جایی ورودی و خروجی", en: "Swap input and output" },
    decodeHint: {
        fa: "همه این شکل‌ها، حتی درهم، خوانده می‌شوند:",
        en: "Every one of these forms is read, also mixed:",
    },
} as const satisfies Record<string, LocalizedText>;
