import type { LocalizedText } from "@handyweb/core";

export const strings = {
    mode: { fa: "کار", en: "Operation" },
    encode: { fa: "رمزگذاری", en: "Encode" },
    decode: { fa: "رمزگشایی", en: "Decode" },
    textInput: { fa: "نوشته", en: "Text" },
    base64Input: { fa: "Base64", en: "Base64" },
    urlSafe: { fa: "نویسه‌های ایمن برای URL (‎- و _‎)", en: "URL-safe alphabet (- and _)" },
    padding: { fa: "افزودن = در پایان", en: "Add = padding" },
    swap: { fa: "جابه‌جایی ورودی و خروجی", en: "Swap input and output" },
    tooLarge: {
        fa: "ورودی بیش از ۵ مگابایت است.",
        en: "The input is larger than 5 MB.",
    },
    decodeHint: {
        fa: "اسپیس‌ها و خط‌های تازه کنار گذاشته می‌شوند.",
        en: "Spaces and line breaks are ignored.",
    },
} as const satisfies Record<string, LocalizedText>;
