import type { LocalizedText } from "@handyweb/core";

export const strings = {
    input: { fa: "SVG ورودی", en: "Input SVG" },
    output: { fa: "SVG بهینه", en: "Optimized SVG" },
    orFile: { fa: "یا فایل SVG را برگزینید", en: "Or choose an SVG file" },
    precision: { fa: "رقم اعشار", en: "Decimal places" },
    keepTitle: {
        fa: "نگه داشتن title و desc (برای صفحه‌خوان)",
        en: "Keep title and desc (for screen readers)",
    },
    sanitize: {
        fa: "پاک کردن بخش‌های ناامن (اسکریپت، رویداد، فایل اینترنتی)",
        en: "Remove unsafe parts (scripts, event handlers, internet files)",
    },
    before: { fa: "پیش", en: "Before" },
    after: { fa: "پس", en: "After" },
    smaller: { fa: "کوچک‌تر", en: "smaller" },
    download: { fa: "دانلود SVG", en: "Download SVG" },
    precisionHelp: {
        fa: "۲ رقم برای آیکون‌ها بس است. اگر پس از بهینه‌سازی شکل دیگرگون شد، رقم بیشتری برگزینید.",
        en: "2 places are enough for icons. If the shape changes after optimizing, choose more places.",
    },
} as const satisfies Record<string, LocalizedText>;
