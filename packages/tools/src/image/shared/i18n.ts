import type { LocalizedText } from "@handyweb/core";

export const shared = {
    another: { fa: "تصویر دیگر", en: "Another image" },
    result: { fa: "نتیجه", en: "Result" },
    format: { fa: "قالب خروجی", en: "Output format" },
    quality: { fa: "کیفیت", en: "Quality" },
    smaller: { fa: "کوچک‌تر", en: "smaller" },
    larger: { fa: "بزرگ‌تر", en: "larger" },
    noWebp: {
        fa: "این مرورگر WebP نمی‌نویسد، پس خروجی PNG است.",
        en: "This browser cannot write WebP, so the output is PNG.",
    },
    metadata: {
        fa: "فایل خروجی هیچ فراداده‌ای (EXIF، مکان، نام دوربین) ندارد. چرخش ذخیره‌شده در عکس پیش از کار اعمال می‌شود.",
        en: "The output file has no metadata (EXIF, location, camera name). The orientation stored in the photo is applied first.",
    },
} as const satisfies Record<string, LocalizedText>;
