import type { LocalizedText } from "@handyweb/core";

export const strings = {
    printTitle: { fa: "اندازه چاپ یک تصویر", en: "Print size of a picture" },
    width: { fa: "پهنا (پیکسل)", en: "Width (pixels)" },
    height: { fa: "بلندا (پیکسل)", en: "Height (pixels)" },
    dpi: { fa: "رزولوشن (DPI)", en: "Resolution (DPI)" },
    printSize: { fa: "اندازه چاپ", en: "Print size" },
    megapixels: { fa: "مگاپیکسل", en: "Megapixels" },
    needTitle: { fa: "پیکسل لازم برای چاپ", en: "Pixels needed to print" },
    paper: { fa: "کاغذ", en: "Paper" },
    needed: { fa: "پیکسل لازم", en: "Pixels needed" },
    unit: { fa: "یکا", en: "Unit" },
    tip: {
        fa: "۳۰۰ DPI برای چاپ عکس و کتاب، ۱۵۰ DPI برای پوستری که از دور دیده می‌شود، و ۷۲ یا ۹۶ برای صفحه نمایش بس است. DPI به تنهایی کیفیت تصویر را بالا نمی‌برد.",
        en: "300 DPI is enough for photos and books, 150 DPI for a poster seen from a distance, and 72 or 96 for a screen. DPI alone does not make a picture sharper.",
    },
} as const satisfies Record<string, LocalizedText>;
