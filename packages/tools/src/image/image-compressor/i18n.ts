import type { LocalizedText } from "@handyweb/core";

export const strings = {
    maxSide: { fa: "بیشینه ضلع بلندتر", en: "Maximum longest side" },
    original: { fa: "بدون تغییر", en: "Keep the size" },
    compress: { fa: "فشرده‌سازی", en: "Compress" },
    larger: {
        fa: "فایل فشرده‌شده از فایل اصلی بزرگ‌تر است. کیفیت را کم کنید، WebP را برگزینید، یا فایل اصلی را نگه دارید.",
        en: "The compressed file is larger than the original. Lower the quality, choose WebP, or keep the original file.",
    },
    pngNote: {
        fa: "خروجی JPEG یا WebP است، چون PNG بدون افت کیفیت است و فشرده نمی‌شود. بخش‌های شفاف در JPEG سفید می‌شوند.",
        en: "The output is JPEG or WebP, because PNG is lossless and does not compress this way. Transparent areas become white in JPEG.",
    },
} as const satisfies Record<string, LocalizedText>;
