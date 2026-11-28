import type { ToolDefinition } from "@handyweb/core";

export const jsFormatterMeta: ToolDefinition = {
    id: "js-formatter",
    slug: "js-formatter",
    aliases: ["javascript-formatter", "js-beautifier", "unminify-js"],
    category: "developer",
    alsoIn: [],
    related: ["html-formatter", "css-formatter"],
    tags: ["js", "format"],
    title: { fa: "فرمت و مرتب کردن کد JavaScript", en: "JavaScript Formatter" },
    seoTitle: {
        fa: "فرمت و مرتب کردن کد JavaScript آنلاین",
        en: "JavaScript Formatter and Beautifier Online",
    },
    description: {
        fa: "مرتب کردن کد JS فشرده یا درهم با تورفتگی خوانا. کد JSON هم پذیرفته می‌شود.",
        en: "Format minified or messy JavaScript with readable indentation. JSON works too.",
    },
    keywords: {
        fa: ["آراستن جاوااسکریپت", "مرتب کردن کد js", "js formatter"],
        en: ["javascript formatter", "js beautifier", "format javascript", "unminify js"],
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
    limits: { maxInputBytes: 2_000_000 },
    limitations: {
        fa: "ابزار کد را تنها می‌آراید و درستی آن را نمی‌سنجد. کد نادرست نادرست می‌ماند. فشرده‌سازی (minify) در این ابزار نیست.",
        en: "The tool only formats code. It does not check that the code is valid, so invalid code stays invalid. Minifying is not part of this tool.",
    },
    guide: {
        steps: [
            { fa: "کد را بچسبانید.", en: "Paste the code." },
            { fa: "تورفتگی را برگزینید.", en: "Choose the indent." },
            { fa: "خروجی را کپی کنید.", en: "Copy the output." },
        ],
        faq: [],
    },
    example: 'function hello(name){if(name){return "سلام "+name}return "سلام"}',
};
