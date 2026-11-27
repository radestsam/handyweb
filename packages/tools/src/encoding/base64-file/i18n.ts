import type { LocalizedText } from "@handyweb/core";

export const strings = {
    mode: { fa: "کار", en: "Action" },
    encode: { fa: "فایل به Base64", en: "File to Base64" },
    decode: { fa: "Base64 به فایل", en: "Base64 to file" },
    format: { fa: "شکل خروجی", en: "Output format" },
    dataUri: { fa: "Data URI", en: "Data URI" },
    base64: { fa: "Base64 خالی", en: "Plain Base64" },
    input: { fa: "Base64 یا Data URI", en: "Base64 or Data URI" },
    orText: { fa: "یا نوشته", en: "Or text" },
    type: { fa: "گونه", en: "Type" },
    size: { fa: "اندازه", en: "Size" },
    download: { fa: "دانلود فایل", en: "Download the file" },
    tooLarge: { fa: "فایل بیش از ۱۰ مگابایت است.", en: "The file is larger than 10 MB." },
    hint: {
        fa: "Base64 حدود یک‌سوم از فایل بزرگ‌تر است.",
        en: "Base64 is about one third larger than the file.",
    },
} as const satisfies Record<string, LocalizedText>;
