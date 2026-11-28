import type { ToolDefinition } from "@handyweb/core";

export const colorContrastMeta: ToolDefinition = {
    id: "color-contrast",
    slug: "color-contrast",
    aliases: [
        "contrast-checker",
        "wcag-contrast",
        "color-contrast-checker",
        "accessibility-contrast",
    ],
    category: "calculators",
    alsoIn: ["developer"],
    related: ["color-converter", "image-color-picker"],
    tags: ["color", "contrast", "wcag", "accessibility"],
    title: { fa: "بررسی کنتراست رنگ (WCAG)", en: "Color Contrast Checker (WCAG)" },
    seoTitle: {
        fa: "بررسی کنتراست رنگ (WCAG) متن و پس‌زمینه",
        en: "Color Contrast Checker (WCAG) for Text and UI",
    },
    description: {
        fa: "نسبت کنتراست رنگ متن و پس‌زمینه را حساب کنید، قبولی در AA و AAA استاندارد WCAG را ببینید و نزدیک‌ترین رنگ خوانا را بگیرید.",
        en: "Work out the contrast ratio of a text and a background color, see whether it passes WCAG AA and AAA, and get the closest readable color.",
    },
    keywords: {
        fa: ["کنتراست رنگ", "بررسی کنتراست", "دسترس پذیری رنگ", "wcag"],
        en: [
            "contrast checker",
            "color contrast",
            "wcag contrast",
            "accessible colors",
            "contrast ratio",
        ],
    },
    presets: [],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["text"],
    outputKinds: ["text"],
    limits: { maxInputBytes: 200 },
    limitations: {
        fa: "روش WCAG 2 به کار می‌رود، نه APCA. رنگ شفاف متن روی پس‌زمینه کشیده می‌شود؛ پس‌زمینه شفاف، مات فرض می‌شود.",
        en: "The WCAG 2 method is used, not APCA. A transparent text color is drawn over the background; a transparent background is treated as solid.",
    },
    guide: {
        steps: [
            {
                fa: "رنگ متن و پس‌زمینه را بنویسید یا برگزینید.",
                en: "Type or pick the text and background colors.",
            },
            {
                fa: "نسبت و نتیجه AA و AAA را ببینید.",
                en: "Read the ratio and the AA and AAA results.",
            },
            {
                fa: "اگر قبول نشد، رنگ پیشنهادی را به کار ببرید.",
                en: "If it fails, use the suggested color.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "AA و AAA چه فرقی دارند؟",
                    en: "What is the difference between AA and AAA?",
                },
                answer: {
                    fa: "AA کمینه پذیرفته‌شده است: ۴٫۵ به ۱ برای متن معمولی و ۳ به ۱ برای متن درشت. AAA سخت‌گیرتر است: ۷ به ۱ و ۴٫۵ به ۱.",
                    en: "AA is the accepted minimum: 4.5:1 for normal text and 3:1 for large text. AAA is stricter: 7:1 and 4.5:1.",
                },
            },
        ],
    },
    example: "#777777",
};
