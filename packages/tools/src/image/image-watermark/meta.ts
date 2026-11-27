import type { ToolDefinition } from "@handyweb/core";

export const imageWatermarkMeta: ToolDefinition = {
    id: "image-watermark",
    slug: "image-watermark",
    aliases: ["watermark-image", "add-watermark", "photo-watermark", "logo-on-image"],
    category: "image",
    alsoIn: [],
    related: ["image-resize", "image-blur"],
    tags: ["image", "watermark", "logo"],
    title: { fa: "واترمارک روی عکس", en: "Image Watermark Tool" },
    description: {
        fa: "متن فارسی یا انگلیسی یا لوگوی خود را به‌عنوان واترمارک روی عکس بگذارید، در یک گوشه یا تکرارشده در همه تصویر. عکس از دستگاه شما بیرون نمی‌رود.",
        en: "Put Persian or English text, or your logo, on a photo as a watermark, in one corner or repeated over the whole picture. The photo never leaves your device.",
    },
    keywords: {
        fa: [
            "واترمارک",
            "واترمارک روی عکس",
            "لوگو روی عکس",
            "گذاشتن متن روی عکس",
            "واترمارک فارسی",
        ],
        en: [
            "watermark image",
            "add watermark to photo",
            "logo on image",
            "text on image",
            "photo watermark",
        ],
    },
    presets: [
        {
            id: "tiled",
            title: { fa: "واترمارک تکراری روی همه عکس", en: "Repeated Watermark Over the Photo" },
            keywords: { fa: ["واترمارک تکراری"], en: ["tiled watermark", "repeated watermark"] },
            options: { layout: "tiled" },
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
        fa: "خروجی تا ۱۶.۷ مگاپیکسل. متن با فونت سایت (Estedad یا Noto Sans) نوشته می‌شود. فراداده (EXIF) در خروجی نمی‌ماند. GIF متحرک تنها با نخستین فریم ذخیره می‌شود. هیچ واترمارکی پاک‌نشدنی نیست.",
        en: "Output up to 16.7 megapixels. Text uses the site font (Estedad or Noto Sans). Metadata (EXIF) is not kept. An animated GIF keeps only its first frame. No watermark is impossible to remove.",
    },
    guide: {
        steps: [
            { fa: "عکس را برگزینید.", en: "Choose a photo." },
            { fa: "متن را بنویسید یا لوگو را برگزینید.", en: "Type the text or choose the logo." },
            {
                fa: "جا، اندازه، پیدایی و زاویه را تنظیم کنید و پیش‌نمایش را ببینید.",
                en: "Set the position, size, opacity, and angle, and check the preview.",
            },
            {
                fa: "ساخت تصویر را بزنید و دانلود کنید.",
                en: "Click Make the image and download it.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "متن فارسی درست نشان داده می‌شود؟",
                    en: "Does Persian text show correctly?",
                },
                answer: {
                    fa: "بله. متن فارسی راست‌به‌چپ و با فونت Estedad نوشته می‌شود.",
                    en: "Yes. Persian text is drawn right to left with the Estedad font.",
                },
            },
        ],
    },
};
