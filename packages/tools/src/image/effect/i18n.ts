import type { LocalizedText } from "@handyweb/core";

export const strings = {
    whole: { fa: "همه تصویر", en: "Whole image" },
    area: { fa: "یک ناحیه", en: "One area" },
    target: { fa: "کجا", en: "Where" },
    drawHelp: {
        fa: "روی تصویر بکشید تا ناحیه را بکشید، برای نمونه روی چهره، پلاک یا شماره تلفن.",
        en: "Drag on the picture to draw the area, for example over a face, a plate, or a phone number.",
    },
    blurStrength: { fa: "شدت محو کردن (پیکسل)", en: "Blur strength (pixels)" },
    blockSize: { fa: "اندازه خانه‌ها (پیکسل)", en: "Block size (pixels)" },
    apply: { fa: "اعمال", en: "Apply" },
    format: { fa: "قالب خروجی", en: "Output format" },
    same: { fa: "مانند ورودی", en: "Same as input" },
    blurWarning: {
        fa: "برای پنهان کردن نوشته یا شماره، محو کردن همیشه امن نیست و گاهی برگرداندنی است. برای این کار پیکسلی کردن با خانه‌های بزرگ بهتر است.",
        en: "To hide text or numbers, blur is not always safe and can sometimes be undone. For that, pixelate with large blocks is better.",
    },
    pixelNote: {
        fa: "برای پنهان کردن نوشته، خانه‌ها را دست‌کم هم‌اندازه بلندی حرف‌ها بگیرید.",
        en: "To hide text, make the blocks at least as tall as the letters.",
    },
} as const satisfies Record<string, LocalizedText>;
