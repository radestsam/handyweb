import type { ToolDefinition } from "@handyweb/core";

export const imageFlipMeta: ToolDefinition = {
    id: "image-flip",
    slug: "image-flip",
    aliases: ["flip-image", "mirror-image", "image-flipper", "mirror-photo"],
    category: "image",
    alsoIn: [],
    related: ["image-rotate", "image-resize"],
    tags: ["image", "flip", "mirror"],
    title: { fa: "قرینه کردن عکس", en: "Image Flipper" },
    seoTitle: {
        fa: "قرینه کردن عکس و آینه‌ای کردن سلفی",
        en: "Image Flipper: Mirror a Photo or Selfie Online",
    },
    description: {
        fa: "قرینه کردن عکس به شکل افقی یا عمودی (آینه‌ای)، برای نمونه برای درست کردن سلفی برعکس.",
        en: "Flip a photo horizontally or vertically (mirror it), for example to fix a mirrored selfie.",
    },
    keywords: {
        fa: ["قرینه کردن عکس", "آینه‌ای کردن عکس", "برعکس کردن سلفی", "فلیپ عکس"],
        en: ["flip image", "mirror image", "flip photo", "mirror selfie", "image flipper"],
    },
    presets: [],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["image"],
    outputKinds: ["image"],
    limits: { maxInputBytes: 100_000_000 },
    limitations: {
        fa: "قرینه کردن پیکسل‌ها را دست نمی‌زند، اما JPEG دوباره فشرده می‌شود. فراداده (EXIF) در خروجی نمی‌ماند. GIF متحرک تنها با نخستین فریم ذخیره می‌شود.",
        en: "A flip keeps every pixel, but a JPEG is compressed again. Metadata (EXIF) is not kept. An animated GIF keeps only its first frame.",
    },
    guide: {
        steps: [
            { fa: "عکس را برگزینید.", en: "Choose a photo." },
            {
                fa: "قرینه افقی یا عمودی را روشن کنید.",
                en: "Turn on Flip horizontally or Flip vertically.",
            },
            {
                fa: "ساخت تصویر را بزنید و دانلود کنید.",
                en: "Click Make the image and download it.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "چرا نوشته‌ها در سلفی برعکس‌اند؟",
                    en: "Why is the text in my selfie backwards?",
                },
                answer: {
                    fa: "بسیاری از دوربین‌های جلو تصویر را مانند آینه ذخیره می‌کنند. قرینه افقی آن را درست می‌کند.",
                    en: "Many front cameras save the picture like a mirror. A horizontal flip fixes it.",
                },
            },
        ],
    },
};
