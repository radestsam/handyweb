import type { ToolDefinition } from "@handyweb/core";

export const imageCropMeta: ToolDefinition = {
    id: "image-crop",
    slug: "image-crop",
    aliases: ["crop-image", "image-cropper", "crop-photo", "photo-cropper"],
    category: "image",
    alsoIn: [],
    related: ["image-resize", "image-rotate"],
    tags: ["image", "crop", "photo"],
    title: { fa: "برش عکس", en: "Image Cropper" },
    seoTitle: {
        fa: "برش عکس آنلاین با نسبت ۱:۱ و استوری",
        en: "Image Cropper: Crop Photos to 1:1, 16:9, or 9:16",
    },
    description: {
        fa: "برش عکس با نسبت آزاد یا ۱:۱، ۴:۳، ۱۶:۹ و ۹:۱۶ (استوری) و دانلود آن.",
        en: "Crop part of a photo with a free ratio or 1:1, 4:3, 16:9, or 9:16 (story), and download it.",
    },
    keywords: {
        fa: ["برش عکس", "کراپ عکس", "بریدن عکس", "عکس مربعی", "برش عکس برای استوری"],
        en: ["crop image", "image cropper", "crop photo", "square crop", "crop to 16:9"],
    },
    presets: [
        {
            id: "square",
            title: { fa: "برش مربعی عکس (۱:۱)", en: "Crop Image to Square (1:1)" },
            keywords: { fa: ["عکس مربعی", "برش ۱:۱"], en: ["square crop", "crop to square"] },
            options: { ratio: "1:1" },
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
        fa: "برش پیکسل‌های ناحیه را دست نمی‌زند، اما JPEG دوباره فشرده می‌شود. فراداده (EXIF) در خروجی نمی‌ماند. GIF متحرک تنها با نخستین فریم ذخیره می‌شود.",
        en: "A crop keeps the pixels of the area, but a JPEG is compressed again. Metadata (EXIF) is not kept. An animated GIF keeps only its first frame.",
    },
    guide: {
        steps: [
            { fa: "عکس را برگزینید.", en: "Choose a photo." },
            {
                fa: "نسبت را برگزینید و ناحیه را بکشید یا عددها را بنویسید.",
                en: "Choose a ratio, then drag the area or type the numbers.",
            },
            {
                fa: "بریدن را بزنید و نتیجه را دانلود کنید.",
                en: "Click Crop and download the result.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "نسبت مناسب استوری و پست اینستاگرام چیست؟",
                    en: "Which ratio fits an Instagram story or post?",
                },
                answer: {
                    fa: "استوری و ریلز ۹:۱۶ است. پست ۱:۱ یا ۴:۵ است.",
                    en: "Stories and reels are 9:16. Posts are 1:1 or 4:5.",
                },
            },
        ],
    },
};
