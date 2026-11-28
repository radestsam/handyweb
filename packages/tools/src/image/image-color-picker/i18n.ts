import type { LocalizedText } from "@handyweb/core";

export const strings = {
    help: {
        fa: "روی عکس بزنید تا رنگ آن نقطه را بگیرید. با کلیدهای جهت، نقطه را پیکسل به پیکسل جابه‌جا کنید.",
        en: "Click the picture to take the color of that point. Use the arrow keys to move the point one pixel at a time.",
    },
    image: { fa: "تصویر؛ برای گرفتن رنگ بزنید", en: "Picture; click to pick a color" },
    sample: { fa: "اندازه نمونه", en: "Sample size" },
    one: { fa: "۱ پیکسل", en: "1 pixel" },
    three: { fa: "میانگین ۳×۳", en: "3×3 average" },
    five: { fa: "میانگین ۵×۵", en: "5×5 average" },
    position: { fa: "نقطه", en: "Point" },
    screen: { fa: "گرفتن رنگ از صفحه", en: "Pick from the screen" },
    picked: { fa: "رنگ‌های گرفته‌شده", en: "Picked colors" },
    another: { fa: "تصویر دیگر", en: "Another image" },
    large: {
        fa: "این تصویر بزرگ است و برای گرفتن رنگ با اندازه کوچک‌تری خوانده شد.",
        en: "This picture is large, so it was read at a smaller size to pick colors.",
    },
} as const satisfies Record<string, LocalizedText>;
