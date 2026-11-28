import type { LocalizedText } from "@handyweb/core";

export const strings = {
    mode: { fa: "روش", en: "Mode" },
    pixels: { fa: "پیکسل", en: "Pixels" },
    percent: { fa: "درصد", en: "Percent" },
    longest: { fa: "ضلع بلندتر", en: "Longest side" },
    width: { fa: "پهنا", en: "Width" },
    height: { fa: "بلندا", en: "Height" },
    keepRatio: { fa: "نگه داشتن نسبت", en: "Keep the aspect ratio" },
    format: { fa: "قالب خروجی", en: "Output format" },
    same: { fa: "مانند ورودی", en: "Same as input" },
    quality: { fa: "کیفیت", en: "Quality" },
    resize: { fa: "تغییر اندازه", en: "Resize" },
    original: { fa: "اصلی", en: "Original" },
    result: { fa: "نتیجه", en: "Result" },
    another: { fa: "تصویر دیگر", en: "Another image" },
    metadata: {
        fa: "فایل خروجی هیچ فراداده‌ای (EXIF، مکان، نام دوربین) ندارد. چرخش عکس پیش از تغییر اندازه اعمال می‌شود.",
        en: "The output file has no metadata (EXIF, location, camera name). The photo orientation is applied before the resize.",
    },
    jpegAlpha: {
        fa: "JPEG شفافیت ندارد؛ بخش‌های شفاف سفید می‌شوند.",
        en: "JPEG has no transparency; transparent areas become white.",
    },
} as const satisfies Record<string, LocalizedText>;
