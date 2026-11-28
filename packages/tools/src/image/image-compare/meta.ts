import type { ToolDefinition } from "@handyweb/core";

export const imageCompareMeta: ToolDefinition = {
    id: "image-compare",
    slug: "image-compare",
    aliases: ["compare-images", "image-diff", "before-after-image", "image-comparison"],
    category: "image",
    alsoIn: ["developer"],
    related: ["image-compressor", "image-resize"],
    tags: ["image", "compare", "diff"],
    title: { fa: "مقایسه دو تصویر", en: "Image Comparer" },
    description: {
        fa: "دو تصویر را با اسلایدر پیش و پس، شفافیت یا تفاوت پیکسل به پیکسل بسنجید و بخش‌های تغییرکرده را ببینید. تصویرها از دستگاه شما بیرون نمی‌روند.",
        en: "Compare two pictures with a before-and-after slider, opacity, or a pixel-by-pixel difference, and see what changed. The pictures never leave your device.",
    },
    keywords: {
        fa: ["مقایسه عکس", "مقایسه دو تصویر", "تفاوت دو عکس", "پیدا کردن تفاوت عکس"],
        en: [
            "compare images",
            "image diff",
            "image comparison",
            "before after slider",
            "find difference between images",
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
    outputKinds: ["image", "structured"],
    limits: { maxInputBytes: 100_000_000 },
    limitations: {
        fa: "سنجش در اندازه تصویر اول و تا ۴ مگاپیکسل انجام می‌شود. تصویری با اندازه دیگر کشیده می‌شود، پس تفاوت پیکسلی آن دقیق نیست. تفاوت جابه‌جایی یا چرخش را نمی‌شناسد.",
        en: "The comparison runs at the size of the first picture, up to 4 megapixels. A picture of another size is stretched, so its pixel difference is not exact. Moves and turns are not detected.",
    },
    guide: {
        steps: [
            { fa: "تصویر اول و دوم را برگزینید.", en: "Choose the first and the second picture." },
            {
                fa: "اسلایدر، شفافیت یا تفاوت پیکسل‌ها را برگزینید.",
                en: "Choose Slider, Opacity, or Pixel difference.",
            },
            {
                fa: "در حالت تفاوت، آستانه را برای نادیده گرفتن نویز تنظیم کنید.",
                en: "In difference mode, set the threshold to ignore noise.",
            },
        ],
        faq: [
            {
                question: { fa: "آستانه چیست؟", en: "What is the threshold?" },
                answer: {
                    fa: "بیشترین تفاوت رنگ (۰ تا ۲۵۵) که نادیده گرفته می‌شود. فشرده‌سازی JPEG تفاوت‌های کوچکی می‌سازد؛ آستانه ۸ تا ۱۶ آن‌ها را پنهان می‌کند.",
                    en: "The largest color change (0 to 255) that is ignored. JPEG compression makes small changes; a threshold of 8 to 16 hides them.",
                },
            },
        ],
    },
};
