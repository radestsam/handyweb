import type { ToolDefinition } from "@handyweb/core";

export const textExtractorMeta: ToolDefinition = {
    id: "text-extractor",
    slug: "text-extractor",
    aliases: ["email-extractor", "url-extractor", "phone-number-extractor", "number-extractor"],
    category: "text",
    alsoIn: ["developer"],
    related: ["find-replace", "remove-duplicate-lines"],
    tags: ["extract", "email", "url", "phone"],
    title: { fa: "استخراج ایمیل، لینک و شماره تلفن از متن", en: "Email, URL, and Phone Extractor" },
    seoTitle: {
        fa: "استخراج ایمیل، لینک و شماره تلفن از متن",
        en: "Email, URL, and Phone Extractor for Any Text",
    },
    description: {
        fa: "استخراج ایمیل، لینک، شماره تلفن، عدد، هشتگ و منشن از یک متن. شماره‌های با رقم فارسی هم پیدا می‌شوند.",
        en: "Pull emails, URLs, phone numbers (Persian digits too), numbers, hashtags, and mentions out of a text.",
    },
    keywords: {
        fa: [
            "استخراج ایمیل",
            "استخراج لینک",
            "استخراج شماره تلفن",
            "بیرون کشیدن شماره",
            "استخراج هشتگ",
        ],
        en: [
            "email extractor",
            "url extractor",
            "phone number extractor",
            "extract numbers",
            "extract hashtags",
        ],
    },
    presets: [
        {
            id: "urls",
            title: { fa: "بیرون کشیدن لینک‌ها", en: "URL Extractor" },
            keywords: { fa: ["استخراج لینک"], en: ["url extractor", "link extractor"] },
            options: { kind: "urls" },
        },
        {
            id: "phones",
            title: { fa: "بیرون کشیدن شماره تلفن", en: "Phone Number Extractor" },
            keywords: { fa: ["استخراج موبایل"], en: ["phone number extractor"] },
            options: { kind: "phones" },
        },
    ],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["text"],
    outputKinds: ["text"],
    limits: { maxInputBytes: 5_000_000 },
    limitations: {
        fa: "الگوها شکل‌های رایج را می‌یابند، نه همه شکل‌هایی که استانداردها می‌پذیرند. شماره تلفن برای شماره‌های ایران و شماره‌های بین‌المللی با + ساخته شده است.",
        en: "The patterns find the common forms, not every form the standards allow. Phone numbers are tuned for Iranian numbers and international numbers with a +.",
    },
    guide: {
        steps: [
            { fa: "نوشته را بچسبانید.", en: "Paste the text." },
            { fa: "آنچه را می‌خواهید برگزینید.", en: "Choose what to extract." },
            { fa: "فهرست را کپی کنید.", en: "Copy the list." },
        ],
        faq: [
            {
                question: {
                    fa: "شماره‌های فارسی خوانده می‌شوند؟",
                    en: "Are Persian digits read?",
                },
                answer: {
                    fa: "بله. ۰۹۱۲۳۴۵۶۷۸۹ یافته می‌شود و در خروجی با شماره‌های لاتین نوشته می‌شود.",
                    en: "Yes. ۰۹۱۲۳۴۵۶۷۸۹ is found, and the output writes it with Latin digits.",
                },
            },
        ],
    },
    example: "با ما در info@handyweb.ir یا ۰۹۱۲۳۴۵۶۷۸۹ در تماس باشید: https://handyweb.ir",
};
