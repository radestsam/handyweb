import type { ToolDefinition } from "@handyweb/core";

export const imageCompressorMeta: ToolDefinition = {
    id: "image-compressor",
    slug: "image-compressor",
    aliases: ["compress-image", "image-optimizer", "reduce-image-size", "photo-compressor"],
    category: "image",
    alsoIn: [],
    related: ["image-resize", "image-converter"],
    tags: ["image", "compress", "jpg", "webp"],
    title: { fa: "کم کردن حجم عکس", en: "Image Compressor" },
    seoTitle: {
        fa: "کم کردن حجم عکس و فشرده سازی عکس آنلاین",
        en: "Image Compressor: Reduce Photo Size Online",
    },
    description: {
        fa: "کم کردن حجم عکس و فشرده سازی عکس با WebP یا JPEG و کیفیت دلخواه، و دیدن حجم پیش و پس پیش از دانلود.",
        en: "Make a photo file smaller with WebP or JPEG at the quality you choose, and see the size before and after.",
    },
    keywords: {
        fa: ["کم کردن حجم عکس", "فشرده سازی عکس", "کاهش حجم تصویر", "فشرده کردن عکس"],
        en: [
            "compress image",
            "image compressor",
            "reduce image size",
            "compress jpg",
            "optimize image",
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
    outputKinds: ["image"],
    limits: { maxInputBytes: 100_000_000 },
    limitations: {
        fa: "فشرده‌سازی با افت کیفیت است. فایلی که از پیش فشرده است ممکن است کوچک‌تر نشود؛ ابزار در این حالت هشدار می‌دهد. فراداده (EXIF) و پروفایل رنگ در خروجی نمی‌مانند. GIF متحرک تنها با نخستین فریم ذخیره می‌شود.",
        en: "Compression loses some quality. A file that is already compressed may not get smaller; the tool warns you then. Metadata (EXIF) and color profiles are not kept. An animated GIF keeps only its first frame.",
    },
    guide: {
        steps: [
            { fa: "عکس را برگزینید.", en: "Choose a photo." },
            {
                fa: "WebP یا JPEG، کیفیت و در صورت نیاز بیشینه اندازه را برگزینید.",
                en: "Choose WebP or JPEG, the quality, and if needed a maximum size.",
            },
            {
                fa: "فشرده‌سازی را بزنید، حجم را بسنجید و دانلود کنید.",
                en: "Click Compress, compare the sizes, and download.",
            },
        ],
        faq: [
            {
                question: { fa: "چه کیفیتی مناسب است؟", en: "Which quality should I use?" },
                answer: {
                    fa: "برای بیشتر عکس‌ها ۷۰ تا ۸۰ تفاوت دیدنی ندارد و حجم را چند برابر کم می‌کند. کوچک کردن اندازه (برای نمونه به ۱۹۲۰ پیکسل) بیشترین اثر را دارد.",
                    en: "For most photos, 70 to 80 shows no visible change and makes the file several times smaller. A smaller size (for example 1920 px) has the largest effect.",
                },
            },
        ],
    },
};
