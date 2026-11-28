import type { ToolDefinition } from "@handyweb/core";

export const splitJoinMeta: ToolDefinition = {
    id: "split-join",
    slug: "split-join",
    aliases: ["text-splitter", "text-joiner", "join-lines", "comma-separator", "split-text"],
    category: "text",
    alsoIn: ["developer"],
    related: ["remove-duplicate-lines", "sort-lines", "text-repeater"],
    tags: ["text", "split", "join", "lines"],
    title: { fa: "جدا کردن و به هم پیوستن متن", en: "Text Splitter and Joiner" },
    seoTitle: {
        fa: "جدا کردن و به هم پیوستن متن با کاما",
        en: "Text Splitter and Joiner for Comma Lists",
    },
    description: {
        fa: "جدا کردن متن با کاما و تبدیل آن به یک مورد در هر خط، یا پیوستن خطوط با کاما، اسپیس یا هر جداکننده دیگر.",
        en: "Turn a comma-separated list into one item per line, or join lines with a comma, a space, or any other delimiter.",
    },
    keywords: {
        fa: ["جدا کردن متن", "تبدیل خط به کاما", "پیوستن خطوط", "فهرست با کاما"],
        en: [
            "text splitter",
            "join lines",
            "lines to comma",
            "comma separated to lines",
            "split text",
        ],
    },
    presets: [
        {
            id: "join",
            title: { fa: "به هم پیوستن خط‌ها", en: "Join Lines" },
            keywords: { fa: ["پیوستن خطوط"], en: ["join lines", "lines to comma"] },
            options: { direction: "join" },
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
        fa: "جداکننده یک نوشته ساده است، نه regex. نویسه جداکننده درون گیومه هم جدا می‌شود، پس برای فایل CSV مناسب نیست.",
        en: "The delimiter is plain text, not a regex. A delimiter inside quotes also splits, so it is not a CSV parser.",
    },
    guide: {
        steps: [
            { fa: "جدا کردن یا به هم پیوستن را برگزینید.", en: "Choose Split or Join." },
            {
                fa: "جداکننده را بنویسید، مانند کاما یا ،",
                en: "Type the delimiter, such as a comma or ،",
            },
            {
                fa: "نوشته را بچسبانید و خروجی را کپی کنید.",
                en: "Paste the text and copy the output.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "چگونه هر مورد را درون گیومه بگذارم؟",
                    en: "How do I put each item in quotes?",
                },
                answer: {
                    fa: "«به هم پیوستن» را برگزینید و در «پیرامون هر مورد» یک گیومه بنویسید، مانند ' یا \". برای نمونه، خروجی 'a','b' برای SQL آماده است.",
                    en: "Choose Join and type a quote in “Around each item”, such as ' or \". For example, the output 'a','b' is ready for SQL.",
                },
            },
        ],
    },
    example: "سیب, پرتقال, موز",
};
