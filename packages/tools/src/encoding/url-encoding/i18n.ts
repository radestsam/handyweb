import type { LocalizedText } from "@handyweb/core";

export const strings = {
    mode: { fa: "کار", en: "Operation" },
    encode: { fa: "رمزگذاری", en: "Encode" },
    decode: { fa: "رمزگشایی", en: "Decode" },
    scope: { fa: "ورودی", en: "Input is" },
    component: { fa: "بخشی از URL", en: "URL part" },
    full: { fa: "URL کامل", en: "Full URL" },
    plusEncode: { fa: "اسپیس به + (فرم HTML)", en: "Space as + (HTML form)" },
    plusDecode: { fa: "+ به اسپیس (فرم HTML)", en: "+ as space (HTML form)" },
    text: { fa: "نوشته", en: "Text" },
    encoded: { fa: "رمزگذاری‌شده", en: "Encoded" },
    swap: { fa: "جابه‌جایی ورودی و خروجی", en: "Swap input and output" },
    componentHint: {
        fa: "همه نویسه‌های ویژه، مانند / ? & = #، رمزگذاری می‌شوند. برای مقدار یک پارامتر یا یک بخش از مسیر.",
        en: "Every special character, such as / ? & = #, is encoded. Use it for a query value or a path segment.",
    },
    fullHint: {
        fa: "ساختار URL (: / ? # & =) دست‌نخورده می‌ماند و تنها نویسه‌های دیگر، مانند حروف فارسی و اسپیس، رمزگذاری می‌شوند.",
        en: "The URL structure (: / ? # & =) stays, and only other characters, such as Persian letters and spaces, are encoded.",
    },
} as const satisfies Record<string, LocalizedText>;
