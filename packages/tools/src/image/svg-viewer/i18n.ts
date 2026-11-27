import type { LocalizedText } from "@handyweb/core";
import type { Risk } from "./logic";

export const strings = {
    input: { fa: "کد SVG", en: "SVG code" },
    orFile: { fa: "یا فایل SVG را برگزینید", en: "Or choose an SVG file" },
    preview: { fa: "پیش‌نمایش", en: "Preview" },
    background: { fa: "پس‌زمینه", en: "Background" },
    checker: { fa: "شطرنجی", en: "Checker" },
    light: { fa: "روشن", en: "Light" },
    dark: { fa: "تیره", en: "Dark" },
    size: { fa: "اندازه", en: "Size" },
    elements: { fa: "عنصر", en: "elements" },
    risky: {
        fa: "این SVG بخش‌های ناامن داشت. پیش‌نمایش و خروجی تنها نسخه پاک‌شده‌اند:",
        en: "This SVG had unsafe parts. The preview and the downloads use only the cleaned copy:",
    },
    pngSize: { fa: "اندازه PNG (ضلع بلندتر)", en: "PNG size (longest side)" },
    downloadPng: { fa: "دانلود PNG", en: "Download PNG" },
    downloadSvg: { fa: "دانلود SVG پاک", en: "Download the clean SVG" },
    copyClean: { fa: "کپی SVG پاک", en: "Copy the clean SVG" },
    safeNote: {
        fa: "SVG به شکل تصویر (<img>) نشان داده می‌شود، پس هیچ اسکریپتی اجرا نمی‌شود و هیچ فایلی از اینترنت بارگیری نمی‌شود.",
        en: "The SVG is shown as an image (<img>), so no script runs and no file loads from the internet.",
    },
} as const satisfies Record<string, LocalizedText>;

export const RISKS: Record<Risk, LocalizedText> = {
    script: { fa: "اسکریپت (<script>)", en: "Script (<script>)" },
    "event-handler": {
        fa: "رویداد مانند onload یا onclick",
        en: "Event handler, such as onload or onclick",
    },
    "javascript-url": { fa: "پیوند javascript:", en: "javascript: link" },
    "external-reference": { fa: "بارگیری فایل از اینترنت", en: "A file loaded from the internet" },
    "foreign-object": {
        fa: "HTML درون SVG (foreignObject)",
        en: "HTML inside the SVG (foreignObject)",
    },
};
