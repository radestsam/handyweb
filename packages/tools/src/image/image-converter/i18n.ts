import type { LocalizedText } from "@handyweb/core";

export const strings = {
    convert: { fa: "تبدیل", en: "Convert" },
    background: { fa: "رنگ زمینه بخش‌های شفاف", en: "Background for transparent areas" },
    jpegAlpha: {
        fa: "JPEG شفافیت ندارد؛ بخش‌های شفاف با رنگ زمینه پر می‌شوند.",
        en: "JPEG has no transparency; transparent areas get the background color.",
    },
} as const satisfies Record<string, LocalizedText>;
