import type { ToolDefinition } from "@handyweb/core";

export const imageBlurMeta: ToolDefinition = {
    id: "image-blur",
    slug: "image-blur",
    aliases: ["blur-image", "blur-photo", "blur-background", "blur-face"],
    category: "image",
    alsoIn: [],
    related: ["image-pixelate", "image-resize", "image-metadata"],
    tags: ["image", "blur", "privacy"],
    title: { fa: "محو کردن عکس", en: "Image Blur Tool" },
    seoTitle: {
        fa: "محو کردن عکس و بلر کردن چهره یا پلاک",
        en: "Image Blur Tool for Faces and Number Plates",
    },
    description: {
        fa: "محو کردن عکس (بلر کردن) یا تنها یک ناحیه از آن، مانند چهره یا پلاک، و دانلود نتیجه.",
        en: "Blur a whole picture or only one area, such as a face or a number plate, and download it.",
    },
    keywords: {
        fa: ["محو کردن عکس", "بلر کردن عکس", "مات کردن عکس", "محو کردن چهره"],
        en: ["blur image", "blur photo", "blur part of image", "blur face", "image blur tool"],
    },
    presets: [
        {
            id: "area",
            title: { fa: "محو کردن بخشی از عکس", en: "Blur Part of an Image" },
            keywords: { fa: ["محو کردن بخشی از عکس"], en: ["blur part of a photo"] },
            options: { target: "area" },
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
        fa: "خروجی تا ۱۶.۷ مگاپیکسل. محو کردن برای پنهان کردن نوشته همیشه امن نیست؛ پیکسلی کردن را به کار ببرید. فراداده (EXIF) در خروجی نمی‌ماند. GIF متحرک تنها با نخستین فریم ذخیره می‌شود.",
        en: "Output up to 16.7 megapixels. Blur is not always safe to hide text; use pixelate. Metadata (EXIF) is not kept. An animated GIF keeps only its first frame.",
    },
    guide: {
        steps: [
            { fa: "عکس را برگزینید.", en: "Choose a picture." },
            {
                fa: "همه تصویر یا یک ناحیه را برگزینید و ناحیه را روی عکس بکشید.",
                en: "Choose the whole image or one area, and drag the area on the picture.",
            },
            {
                fa: "شدت را تنظیم کنید، اعمال را بزنید و دانلود کنید.",
                en: "Set the strength, click Apply, and download.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "برای پنهان کردن شماره کارت، محو کنم؟",
                    en: "Should I blur a card number to hide it?",
                },
                answer: {
                    fa: "بهتر است نه. محو کردن کم را گاهی می‌توان برگرداند. پیکسلی کردن با خانه‌های بزرگ یا پوشاندن با یک رنگ امن‌تر است.",
                    en: "Better not. A light blur can sometimes be undone. Pixelate with large blocks, or cover it with a solid color, is safer.",
                },
            },
        ],
    },
};
