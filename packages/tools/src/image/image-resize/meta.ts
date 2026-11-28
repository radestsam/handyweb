import type { ToolDefinition } from "@handyweb/core";

export const imageResizeMeta: ToolDefinition = {
    id: "image-resize",
    slug: "image-resize",
    aliases: ["image-resizer", "resize-image", "photo-resizer", "picture-resizer"],
    category: "image",
    alsoIn: [],
    related: ["base64-file", "file-signature"],
    tags: ["image", "resize", "photo"],
    title: { fa: "تغییر اندازه عکس", en: "Image Resizer" },
    seoTitle: {
        fa: "تغییر اندازه عکس و کوچک کردن ابعاد آنلاین",
        en: "Image Resizer: Resize Photos by Pixels or Percent",
    },
    description: {
        fa: "تغییر سایز عکس با پیکسل، درصد یا ضلع بلندتر، و دانلود آن به شکل PNG، JPEG یا WebP.",
        en: "Resize a photo by pixels, percent, or the longest side, and download it as PNG, JPEG, or WebP.",
    },
    keywords: {
        fa: [
            "کوچک کردن عکس",
            "تغییر سایز عکس",
            "کم کردن ابعاد عکس",
            "تغییر اندازه عکس",
            "ریسایز عکس",
        ],
        en: [
            "resize image",
            "image resizer",
            "reduce image size",
            "photo resizer",
            "resize jpg",
            "resize png",
        ],
    },
    presets: [
        {
            id: "percent",
            title: { fa: "کوچک کردن عکس با درصد", en: "Resize Image by Percent" },
            keywords: { fa: ["کوچک کردن درصدی عکس"], en: ["resize image by percentage"] },
            options: { mode: "percent" },
        },
    ],
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
        fa: "ورودی تا ۵۰ مگاپیکسل و خروجی تا ۱۶.۷ مگاپیکسل (۴۰۹۶×۴۰۹۶). GIF متحرک تنها با نخستین فریم ذخیره می‌شود. فراداده (EXIF) و پروفایل رنگ در خروجی نمی‌مانند. برخی مرورگرها (Safari قدیمی) WebP نمی‌نویسند و PNG می‌سازند.",
        en: "Input up to 50 megapixels and output up to 16.7 megapixels (4096×4096). An animated GIF keeps only its first frame. Metadata (EXIF) and color profiles are not kept. Some browsers (old Safari) cannot write WebP and make PNG instead.",
    },
    guide: {
        steps: [
            { fa: "عکس را برگزینید یا بکشید و رها کنید.", en: "Choose or drop a photo." },
            {
                fa: "پهنا و بلندا، درصد یا ضلع بلندتر را بنویسید.",
                en: "Enter the width and height, a percent, or the longest side.",
            },
            {
                fa: "تغییر اندازه را بزنید و نتیجه را دانلود کنید.",
                en: "Click Resize and download the result.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "چرا حجم فایل PNG بیشتر شد؟",
                    en: "Why did the PNG file get bigger?",
                },
                answer: {
                    fa: "PNG بدون افت کیفیت ذخیره می‌کند و برای عکس حجیم است. برای عکس، JPEG یا WebP با کیفیت ۸۰ تا ۹۰ را برگزینید.",
                    en: "PNG is lossless and is large for photos. For a photo, choose JPEG or WebP with a quality of 80 to 90.",
                },
            },
        ],
    },
};
