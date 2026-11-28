import type { LocalizedText } from "@handyweb/core";

export const strings = {
    rotateLeft: { fa: "چرخش ۹۰° به چپ", en: "Rotate 90° left" },
    rotateRight: { fa: "چرخش ۹۰° به راست", en: "Rotate 90° right" },
    rotate180: { fa: "چرخش ۱۸۰°", en: "Rotate 180°" },
    angle: { fa: "زاویه دلخواه (درجه)", en: "Custom angle (degrees)" },
    flipX: { fa: "قرینه افقی", en: "Flip horizontally" },
    flipY: { fa: "قرینه عمودی", en: "Flip vertically" },
    background: { fa: "رنگ گوشه‌ها", en: "Corner color" },
    transparent: { fa: "شفاف", en: "Transparent" },
    format: { fa: "قالب خروجی", en: "Output format" },
    same: { fa: "مانند ورودی", en: "Same as input" },
    apply: { fa: "ساخت تصویر", en: "Make the image" },
    reset: { fa: "بازگشت به حالت اول", en: "Reset" },
    another: { fa: "تصویر دیگر", en: "Another image" },
    result: { fa: "نتیجه", en: "Result" },
    lossy: {
        fa: "زاویه‌ای جز مضرب ۹۰ تصویر را کمی نرم می‌کند و آن را بزرگ‌تر می‌کند تا گوشه‌ها بریده نشوند.",
        en: "An angle that is not a multiple of 90 softens the image a little and makes it larger, so no corner is cut.",
    },
    metadata: {
        fa: "فایل خروجی هیچ فراداده‌ای (EXIF، مکان) ندارد. چرخش ذخیره‌شده در عکس پیش از کار اعمال می‌شود.",
        en: "The output file has no metadata (EXIF, location). The orientation stored in the photo is applied first.",
    },
} as const satisfies Record<string, LocalizedText>;
