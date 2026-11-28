import type { ToolDefinition } from "@handyweb/core";

export const imagePaletteMeta: ToolDefinition = {
    id: "image-palette",
    slug: "image-palette",
    aliases: ["color-palette-from-image", "palette-extractor", "image-colors"],
    category: "image",
    alsoIn: ["developer"],
    related: ["image-color-picker", "color-converter"],
    tags: ["image", "color", "palette"],
    title: { fa: "استخراج پالت رنگ از تصویر", en: "Image Palette Extractor" },
    description: {
        fa: "رنگ‌های اصلی یک عکس را با سهم هر رنگ پیدا کنید و آن‌ها را به شکل متغیرهای CSS، فهرست HEX یا JSON کپی کنید. عکس از دستگاه شما بیرون نمی‌رود.",
        en: "Find the main colors of a picture with the share of each one, and copy them as CSS variables, a HEX list, or JSON. The picture never leaves your device.",
    },
    keywords: {
        fa: ["پالت رنگ عکس", "رنگ های عکس", "استخراج رنگ از عکس", "پالت رنگی"],
        en: [
            "color palette from image",
            "palette extractor",
            "image colors",
            "extract colors from image",
            "dominant colors",
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
        fa: "رنگ‌ها از نسخه ۱۲۸ پیکسلی عکس خوانده می‌شوند، پس جزئیات بسیار کوچک دیده نمی‌شوند. بخش‌های شفاف نادیده گرفته می‌شوند.",
        en: "Colors are read from a 128-pixel copy of the picture, so very small details are not seen. Transparent areas are ignored.",
    },
    guide: {
        steps: [
            { fa: "عکس را برگزینید.", en: "Choose a picture." },
            { fa: "شمار رنگ‌ها را برگزینید.", en: "Choose the number of colors." },
            { fa: "رنگ یا پالت کامل را کپی کنید.", en: "Copy a color or the whole palette." },
        ],
        faq: [
            {
                question: { fa: "رنگ‌ها چگونه پیدا می‌شوند؟", en: "How are the colors found?" },
                answer: {
                    fa: "با روش median cut: پیکسل‌ها بارها بر پایه رنگ دو گروه می‌شوند و میانگین هر گروه یک رنگ پالت است. نتیجه برای یک عکس همیشه یکسان است.",
                    en: "With median cut: the pixels are split by color again and again, and the average of each group is one palette color. The result is always the same for a picture.",
                },
            },
        ],
    },
};
