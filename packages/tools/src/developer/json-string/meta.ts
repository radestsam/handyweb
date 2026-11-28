import type { ToolDefinition } from "@handyweb/core";

export const jsonStringMeta: ToolDefinition = {
    id: "json-string",
    slug: "json-string",
    aliases: ["json-string-escaper", "json-string-unescaper", "json-escape", "json-unescape"],
    category: "developer",
    alsoIn: ["encoding"],
    related: ["json-formatter", "unicode-escape"],
    tags: ["json", "escape", "string"],
    title: {
        fa: "رمزگذاری و رمزگشایی رشته JSON",
        en: "JSON String Escaper and Unescaper",
    },
    description: {
        fa: 'نوشته را برای گذاشتن درون یک رشته JSON رمزگذاری کنید، با \\n و \\" و دیگر دنباله‌ها، یا یک رشته JSON را به نوشته خوانا برگردانید.',
        en: 'Escape text to put it inside a JSON string, with \\n, \\", and other escapes, or turn a JSON string back into readable text.',
    },
    keywords: {
        fa: ["رشته json", "escape json", "رمزگذاری json", "\\n"],
        en: ["json escape", "json unescape", "json string", "escape quotes", "stringify"],
    },
    presets: [
        {
            id: "unescape",
            title: { fa: "رمزگشایی رشته JSON", en: "JSON String Unescaper" },
            keywords: { fa: ["رمزگشایی json"], en: ["json unescape"] },
            options: { mode: "unescape" },
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
        fa: "تنها یک رشته را رمزگذاری یا رمزگشایی می‌کند، نه یک سند JSON کامل. برای سند کامل، آراستن JSON را به کار ببرید.",
        en: "It escapes or unescapes one string, not a whole JSON document. For a whole document, use the JSON formatter.",
    },
    guide: {
        steps: [
            { fa: "رمزگذاری یا رمزگشایی را برگزینید.", en: "Choose Escape or Unescape." },
            { fa: "نوشته یا رشته JSON را بچسبانید.", en: "Paste the text or the JSON string." },
            { fa: "خروجی را کپی کنید.", en: "Copy the output." },
        ],
        faq: [
            {
                question: {
                    fa: "گیومه‌های پیرامون رشته را هم بچسبانم؟",
                    en: "Do I paste the quotes around the string too?",
                },
                answer: {
                    fa: "فرقی نمی‌کند. رمزگشایی رشته را با یا بی گیومه می‌پذیرد.",
                    en: "Either way works. Unescape accepts the string with or without the quotes.",
                },
            },
        ],
    },
    example: 'سلام "دنیا"\nخط دوم',
};
