import type { ToolDefinition } from "@handyweb/core";

export const aspectRatioMeta: ToolDefinition = {
    id: "aspect-ratio",
    slug: "aspect-ratio",
    aliases: ["aspect-ratio-calculator", "ratio-calculator", "16-9-calculator"],
    category: "calculators",
    alsoIn: ["image"],
    related: ["image-resize", "image-crop"],
    tags: ["ratio", "resolution", "video"],
    title: { fa: "محاسبه نسبت تصویر", en: "Aspect Ratio Calculator" },
    description: {
        fa: "نسبت تصویر را از پهنا و بلندا پیدا کنید (برای نمونه ۱۹۲۰×۱۰۸۰ برابر ۱۶:۹)، یا ضلع دیگر را برای یک نسبت مانند ۱۶:۹، ۴:۵ یا ۹:۱۶ حساب کنید.",
        en: "Find the aspect ratio from a width and height (1920×1080 is 16:9), or work out the other side for a ratio such as 16:9, 4:5, or 9:16.",
    },
    keywords: {
        fa: ["نسبت تصویر", "محاسبه نسبت ابعاد", "نسبت ۱۶ به ۹", "ابعاد استوری"],
        en: ["aspect ratio calculator", "16:9 calculator", "ratio from resolution", "image ratio"],
    },
    presets: [],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["text"],
    outputKinds: ["text"],
    limits: { maxInputBytes: 100 },
    limitations: {
        fa: "نسبت از اندازه‌های گردشده (عدد صحیح) ساده می‌شود. «نزدیک به» نسبتی رایج را نشان می‌دهد که تا ۱٪ فرق دارد.",
        en: "The ratio is simplified from whole-number sizes. “Close to” shows a common ratio that is within 1%.",
    },
    guide: {
        steps: [
            {
                fa: "پهنا و بلندا را بنویسید تا نسبت را ببینید.",
                en: "Enter the width and height to see the ratio.",
            },
            {
                fa: "یا یک نسبت و یک ضلع را بنویسید تا ضلع دیگر را ببینید.",
                en: "Or enter a ratio and one side to see the other side.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "چرا ۱۳۶۶×۷۶۸ برابر ۱۶:۹ نیست؟",
                    en: "Why is 1366×768 not exactly 16:9?",
                },
                answer: {
                    fa: "۱۳۶۶÷۷۶۸ برابر ۱٫۷۷۹ است و ۱۶:۹ برابر ۱٫۷۷۸. نسبت دقیق آن ۶۸۳:۳۸۴ است، اما به ۱۶:۹ بسیار نزدیک است.",
                    en: "1366÷768 is 1.779, and 16:9 is 1.778. The exact ratio is 683:384, but it is very close to 16:9.",
                },
            },
        ],
    },
    example: "1920",
};
