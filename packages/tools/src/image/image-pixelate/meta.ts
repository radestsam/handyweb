import type { ToolDefinition } from "@handyweb/core";

export const imagePixelateMeta: ToolDefinition = {
    id: "image-pixelate",
    slug: "image-pixelate",
    aliases: ["pixelate-image", "image-pixelator", "censor-image", "mosaic-image"],
    category: "image",
    alsoIn: [],
    related: ["image-blur", "image-metadata"],
    tags: ["image", "pixelate", "privacy", "censor"],
    title: { fa: "پیکسلی کردن عکس", en: "Image Pixelator" },
    seoTitle: {
        fa: "پیکسلی کردن عکس و شطرنجی کردن چهره",
        en: "Image Pixelator for Faces, Plates, and Text",
    },
    description: {
        fa: "پیکسلی کردن عکس یا یک ناحیه از آن، مانند چهره، پلاک یا شماره کارت، تا خوانده نشود (موزاییکی).",
        en: "Pixelate one area of a picture, such as a face, a plate, or a card number, or all of it, so it cannot be read.",
    },
    keywords: {
        fa: [
            "پیکسلی کردن عکس",
            "شطرنجی کردن عکس",
            "سانسور عکس",
            "پنهان کردن بخشی از عکس",
            "موزاییک عکس",
        ],
        en: [
            "pixelate image",
            "image pixelator",
            "censor image",
            "hide part of image",
            "mosaic image",
        ],
    },
    presets: [
        {
            id: "area",
            title: { fa: "پیکسلی کردن بخشی از عکس", en: "Pixelate Part of an Image" },
            keywords: {
                fa: ["سانسور بخشی از عکس"],
                en: ["pixelate part of a photo", "censor part of image"],
            },
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
        fa: "خروجی تا ۱۶.۷ مگاپیکسل. خانه‌های کوچک ممکن است نوشته را خوانا بگذارند. فراداده (EXIF) در خروجی نمی‌ماند. GIF متحرک تنها با نخستین فریم ذخیره می‌شود.",
        en: "Output up to 16.7 megapixels. Small blocks may leave text readable. Metadata (EXIF) is not kept. An animated GIF keeps only its first frame.",
    },
    guide: {
        steps: [
            { fa: "عکس را برگزینید.", en: "Choose a picture." },
            {
                fa: "«یک ناحیه» را برگزینید و ناحیه را روی عکس بکشید.",
                en: "Choose One area, and drag the area on the picture.",
            },
            {
                fa: "اندازه خانه‌ها را تنظیم کنید، اعمال را بزنید و دانلود کنید.",
                en: "Set the block size, click Apply, and download.",
            },
        ],
        faq: [
            {
                question: { fa: "پیکسلی کردن امن است؟", en: "Is pixelating safe?" },
                answer: {
                    fa: "با خانه‌های بزرگ، دست‌کم هم‌اندازه بلندی حرف‌ها، بله. خانه‌های کوچک را گاهی می‌توان با حدس زدن برگرداند.",
                    en: "With large blocks, at least as tall as the letters, yes. Small blocks can sometimes be undone by guessing.",
                },
            },
        ],
    },
};
