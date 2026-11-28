import type { ToolDefinition } from "@handyweb/core";

export const loremIpsumMeta: ToolDefinition = {
    id: "lorem-ipsum",
    slug: "lorem-ipsum",
    aliases: ["lorem-ipsum-generator", "persian-lorem-ipsum", "placeholder-text", "dummy-text"],
    category: "text",
    alsoIn: ["persian"],
    related: ["text-counter", "text-repeater"],
    tags: ["lorem ipsum", "placeholder", "text"],
    title: {
        fa: "ساخت متن ساختگی (لورم ایپسوم فارسی)",
        en: "Lorem Ipsum Generator",
    },
    description: {
        fa: "متن ساختگی فارسی یا لاتین برای پر کردن طرح و صفحه بسازید: به شمار بند، جمله یا واژه.",
        en: "Make Persian or Latin placeholder text for designs and pages, by paragraphs, sentences, or words.",
    },
    keywords: {
        fa: ["لورم ایپسوم", "لورم ایپسوم فارسی", "متن ساختگی", "متن تستی", "متن آزمایشی"],
        en: [
            "lorem ipsum",
            "lorem ipsum generator",
            "placeholder text",
            "dummy text",
            "persian lorem ipsum",
        ],
    },
    presets: [
        {
            id: "latin",
            title: { fa: "لورم ایپسوم لاتین", en: "Latin Lorem Ipsum" },
            keywords: { fa: ["لورم ایپسوم انگلیسی"], en: ["latin lorem ipsum"] },
            options: { language: "la" },
        },
    ],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["structured"],
    outputKinds: ["text"],
    limitations: {
        fa: "متن فارسی از واژه‌های رایج و تصادفی ساخته می‌شود و معنای درستی ندارد. هر بار تا ۵۰۰ بند، جمله یا واژه.",
        en: "Persian text is made of common words in random order and has no real meaning. Up to 500 paragraphs, sentences, or words at a time.",
    },
    guide: {
        steps: [
            { fa: "زبان و گونه را برگزینید.", en: "Choose the language and the unit." },
            { fa: "شمار را بنویسید.", en: "Enter the count." },
            {
                fa: "متن را کپی کنید، یا «ساخت دوباره» را بزنید.",
                en: "Copy the text, or select Generate again.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "چرا لورم ایپسوم فارسی؟",
                    en: "Why Persian placeholder text?",
                },
                answer: {
                    fa: "طرحی که برای فارسی ساخته می‌شود باید با نوشته راست‌به‌چپ و درازای واژه‌های فارسی آزموده شود. متن لاتین این را نشان نمی‌دهد.",
                    en: "A design for Persian must be tested with right-to-left text and the length of Persian words. Latin text does not show that.",
                },
            },
        ],
    },
    example: "2",
};
