import type { LocalizedText } from "@handyweb/core";

export const strings = {
    value: { fa: "مقدار", en: "Value" },
    unit: { fa: "یکا", en: "Unit" },
    context: { fa: "زمینه", en: "Context" },
    root: { fa: "اندازه فونت ریشه (px)", en: "Root font size (px)" },
    font: { fa: "اندازه فونت عنصر (px)", en: "Element font size (px)" },
    vw: { fa: "پهنای نمایشگر (px)", en: "Viewport width (px)" },
    vh: { fa: "بلندای نمایشگر (px)", en: "Viewport height (px)" },
    parent: { fa: "اندازه والد برای ٪ (px)", en: "Parent size for % (px)" },
    results: { fa: "برابر با", en: "Equals" },
    note: {
        fa: "یکاهای مطلق با قاعده CSS حساب می‌شوند: ۱in = ۹۶px. این‌ها پیکسل CSS‌اند، نه پیکسل فیزیکی صفحه.",
        en: "Absolute units follow the CSS rule: 1in = 96px. These are CSS pixels, not physical screen pixels.",
    },
} as const satisfies Record<string, LocalizedText>;
