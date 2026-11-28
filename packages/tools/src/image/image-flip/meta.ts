import type { ToolDefinition } from "@handyweb/core";

export const imageFlipMeta: ToolDefinition = {
    id: "image-flip",
    slug: "image-flip",
    aliases: ["flip-image", "mirror-image", "image-flipper", "mirror-photo"],
    category: "image",
    alsoIn: [],
    related: ["image-rotate", "image-resize"],
    tags: ["image", "flip", "mirror"],
    title: { fa: "قرینه کردن تصویر", en: "Image Flipper" },
    description: {
        fa: "عکس را افقی یا عمودی قرینه (آینه‌ای) کنید، برای نمونه سلفی برعکس را درست کنید. عکس از دستگاه شما بیرون نمی‌رود.",
        en: "Flip a photo horizontally or vertically (mirror it), for example to fix a mirrored selfie. The photo never leaves your device.",
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
