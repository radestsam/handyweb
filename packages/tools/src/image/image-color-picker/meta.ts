import type { ToolDefinition } from "@handyweb/core";

export const imageColorPickerMeta: ToolDefinition = {
    id: "image-color-picker",
    slug: "image-color-picker",
    aliases: ["color-picker-from-image", "image-eyedropper", "pick-color-from-image"],
    category: "image",
    alsoIn: ["developer"],
    related: ["color-converter"],
    tags: ["image", "color", "picker", "hex"],
    title: { fa: "گرفتن رنگ از تصویر", en: "Image Color Picker" },
    description: {
        fa: "روی هر نقطه عکس بزنید و کد رنگ آن را به شکل HEX، RGB، HSL و OKLCH بگیرید. عکس از دستگاه شما بیرون نمی‌رود.",
        en: "Click any point of a picture and get its color as HEX, RGB, HSL, and OKLCH. The picture never leaves your device.",
    },
    keywords: {
        fa: ["کد رنگ عکس", "گرفتن رنگ از عکس", "پیدا کردن کد رنگ", "قطره چکان رنگ"],
        en: [
            "color picker from image",
            "image color picker",
            "get color from image",
            "eyedropper",
            "hex from image",
        ],
    },
    presets: [],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["image"],
    outputKinds: ["text"],
    limits: { maxInputBytes: 100_000_000 },
    limitations: {
        fa: "رنگ‌ها در sRGB خوانده می‌شوند؛ پروفایل رنگ عکس ممکن است رنگ را کمی تغییر دهد. برخی مرورگرها (مانند Brave) برای حفظ حریم خصوصی کمی نویز به پیکسل‌ها می‌افزایند. گرفتن رنگ از صفحه تنها در Chrome و Edge است.",
        en: "Colors are read in sRGB; the color profile of the picture may change a color a little. Some browsers (such as Brave) add a little noise to pixels for privacy. Picking from the screen works only in Chrome and Edge.",
    },
    guide: {
        steps: [
            { fa: "عکس را برگزینید.", en: "Choose a picture." },
            { fa: "روی نقطه دلخواه بزنید.", en: "Click the point you want." },
            { fa: "کد رنگ را کپی کنید.", en: "Copy the color code." },
        ],
        faq: [
            {
                question: { fa: "چرا میانگین ۳×۳؟", en: "Why a 3×3 average?" },
                answer: {
                    fa: "در عکس، پیکسل‌های کنار هم کمی با هم فرق دارند. میانگین چند پیکسل رنگ پایدارتری می‌دهد.",
                    en: "In a photo, pixels next to each other differ a little. An average of a few pixels gives a steadier color.",
                },
            },
        ],
    },
};
