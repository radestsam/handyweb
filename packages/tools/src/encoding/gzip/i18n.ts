import type { LocalizedText } from "@handyweb/core";

export const strings = {
    mode: { fa: "کار", en: "Action" },
    compress: { fa: "فشرده‌سازی", en: "Compress" },
    decompress: { fa: "باز کردن", en: "Decompress" },
    format: { fa: "گونه", en: "Format" },
    text: { fa: "نوشته", en: "Text" },
    base64: { fa: "داده فشرده به Base64", en: "Compressed data as Base64" },
    orFile: { fa: "یا یک فایل", en: "Or a file" },
    original: { fa: "اندازه اصلی", en: "Original size" },
    compressed: { fa: "اندازه فشرده", en: "Compressed size" },
    saved: { fa: "کاهش", en: "Saved" },
    download: { fa: "دانلود", en: "Download" },
    result: { fa: "نوشته بازشده", en: "Decompressed text" },
    notText: {
        fa: "داده بازشده نوشته UTF-8 نیست. آن را به شکل فایل دانلود کنید.",
        en: "The decompressed data is not UTF-8 text. Download it as a file.",
    },
    detected: { fa: "گونه از سربرگ داده شناخته شد", en: "Format detected from the data header" },
} as const satisfies Record<string, LocalizedText>;
