import type { LocalizedText } from "@handyweb/core";

export const strings = {
    first: { fa: "تصویر اول (پیش)", en: "First image (before)" },
    second: { fa: "تصویر دوم (پس)", en: "Second image (after)" },
    mode: { fa: "روش", en: "Mode" },
    slider: { fa: "اسلایدر", en: "Slider" },
    opacity: { fa: "شفافیت", en: "Opacity" },
    difference: { fa: "تفاوت پیکسل‌ها", en: "Pixel difference" },
    position: { fa: "جای اسلایدر", en: "Slider position" },
    blend: { fa: "شفافیت تصویر دوم", en: "Opacity of the second image" },
    threshold: {
        fa: "آستانه (نادیده گرفتن تفاوت‌های کوچک)",
        en: "Threshold (ignore small changes)",
    },
    changed: { fa: "پیکسل تغییر کرده", en: "pixels changed" },
    same: {
        fa: "دو تصویر پیکسل به پیکسل یکسان‌اند.",
        en: "The two images are the same, pixel for pixel.",
    },
    resized: {
        fa: "اندازه دو تصویر یکسان نیست. تصویر دوم برای سنجش به اندازه تصویر اول درآمد.",
        en: "The two images are not the same size. The second image was scaled to the size of the first for the comparison.",
    },
    another: { fa: "تصویرهای دیگر", en: "Other images" },
} as const satisfies Record<string, LocalizedText>;
