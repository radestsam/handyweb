import type { ToolDefinition } from "@handyweb/core";

export const reverseTextMeta: ToolDefinition = {
    id: "reverse-text",
    slug: "reverse-text",
    aliases: ["text-reverser", "reverse-words", "reverse-string", "backwards-text"],
    category: "text",
    alsoIn: [],
    related: ["sort-lines", "case-converter"],
    tags: ["text", "reverse"],
    title: { fa: "وارونه کردن متن", en: "Reverse Text" },
    seoTitle: {
        fa: "وارونه کردن متن، کلمات یا خط‌ها",
        en: "Reverse Text: Flip Letters, Words, or Lines",
    },
    description: {
        fa: "وارونه کردن متن: حروف هر خط، ترتیب کلمه‌ها یا ترتیب خط‌ها را برعکس کنید. حرف‌های با زیر و زبر و ایموجی‌ها نمی‌شکنند.",
        en: "Reverse the characters of each line, the order of the words, or the order of the lines. Letters with diacritics and emoji do not break.",
    },
    keywords: {
        fa: ["وارونه کردن متن", "برعکس کردن متن", "معکوس کردن متن", "وارونه کردن کلمات"],
        en: ["reverse text", "reverse string", "reverse words", "backwards text", "flip text"],
    },
    presets: [
        {
            id: "words",
            title: { fa: "وارونه کردن ترتیب واژه‌ها", en: "Reverse Word Order" },
            keywords: { fa: ["وارونه کردن کلمات"], en: ["reverse words"] },
            options: { mode: "words" },
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
        fa: "وارونه کردن نویسه‌ها در فارسی متنی ناخوانا می‌سازد، چون شکل پیوسته حرف‌ها دگرگون می‌شود. برای وارونه کردن ترتیب همه خط‌ها، «خط‌ها» را برگزینید.",
        en: "Reversing the characters of Persian text makes it hard to read, because the joined letter forms change. To reverse the order of the lines, choose Lines.",
    },
    guide: {
        steps: [
            { fa: "نوشته را بچسبانید.", en: "Paste the text." },
            {
                fa: "نویسه‌ها، واژه‌ها یا خط‌ها را برگزینید.",
                en: "Choose Characters, Words, or Lines.",
            },
            { fa: "خروجی را کپی کنید.", en: "Copy the output." },
        ],
        faq: [
            {
                question: {
                    fa: "ایموجی‌ها پس از وارونه شدن درست می‌مانند؟",
                    en: "Do emoji stay correct after reversing?",
                },
                answer: {
                    fa: "بله. هر نویسه دیدنی، حتی ایموجی چندتکه یا حرفی با زیر و زبر، یک واحد شمرده می‌شود و از هم جدا نمی‌شود.",
                    en: "Yes. Each visible character, even an emoji made of several parts or a letter with diacritics, is one unit and is not split.",
                },
            },
        ],
    },
    example: "HandyWeb ابزار",
};
