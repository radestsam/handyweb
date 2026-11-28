import type { ToolDefinition } from "@handyweb/core";

export const imageRotateMeta: ToolDefinition = {
    id: "image-rotate",
    slug: "image-rotate",
    aliases: ["rotate-image", "image-rotator", "rotate-photo"],
    category: "image",
    alsoIn: [],
    related: ["image-flip", "image-resize"],
    tags: ["image", "rotate", "photo"],
    title: { fa: "چرخاندن عکس", en: "Image Rotator" },
    seoTitle: {
        fa: "چرخاندن عکس ۹۰ درجه یا با هر زاویه",
        en: "Image Rotator: Rotate a Photo by Any Angle",
    },
    description: {
        fa: "چرخاندن عکس ۹۰ یا ۱۸۰ درجه، یا با هر زاویه دلخواه، و دانلود آن بدون افت کیفیت.",
        en: "Rotate a photo by 90 or 180 degrees, or by any angle, and download it without quality loss.",
    },
    keywords: {
        fa: ["چرخاندن عکس", "چرخش تصویر", "صاف کردن عکس کج", "عکس برعکس"],
        en: ["rotate image", "rotate photo", "image rotator", "rotate jpg", "straighten photo"],
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
        fa: "چرخش ۹۰، ۱۸۰ و ۲۷۰ درجه پیکسل‌ها را دست نمی‌زند، اما JPEG دوباره فشرده می‌شود. زاویه دیگر کمی نرمی می‌آورد. فراداده (EXIF) در خروجی نمی‌ماند. GIF متحرک تنها با نخستین فریم ذخیره می‌شود.",
        en: "A turn of 90, 180, or 270 degrees keeps every pixel, but a JPEG is compressed again. Other angles soften the image a little. Metadata (EXIF) is not kept. An animated GIF keeps only its first frame.",
    },
    guide: {
        steps: [
            { fa: "عکس را برگزینید.", en: "Choose a photo." },
            {
                fa: "با دکمه‌ها بچرخانید یا زاویه را بنویسید.",
                en: "Rotate with the buttons, or type an angle.",
            },
            {
                fa: "ساخت تصویر را بزنید و دانلود کنید.",
                en: "Click Make the image and download it.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "چرا عکس من در برخی برنامه‌ها کج نشان داده می‌شود؟",
                    en: "Why does my photo show turned in some apps?",
                },
                answer: {
                    fa: "دوربین‌ها چرخش را در EXIF می‌نویسند و برخی برنامه‌ها آن را نادیده می‌گیرند. این ابزار چرخش را در خود پیکسل‌ها اعمال می‌کند، پس خروجی همه‌جا یکسان دیده می‌شود.",
                    en: "Cameras write the orientation into EXIF, and some apps ignore it. This tool applies the orientation to the pixels, so the output looks the same everywhere.",
                },
            },
        ],
    },
};
