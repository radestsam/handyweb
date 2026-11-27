import type { ToolDefinition } from "@handyweb/core";

export const jsFormatterMeta: ToolDefinition = {
    id: "js-formatter",
    slug: "js-formatter",
    aliases: ["javascript-formatter", "js-beautifier", "unminify-js"],
    category: "developer",
    alsoIn: [],
    related: ["html-formatter", "css-formatter"],
    tags: ["js", "format"],
    title: {
        fa: "آراستن کد JavaScript",
        en: "JavaScript Formatter",
    },
    description: {
        fa: "کد JavaScript فشرده یا درهم را با تورفتگی خوانا بیارایید. JSON هم پذیرفته می‌شود.",
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
        faq: [
            {
                question: {
                    fa: "کد من جایی فرستاده می‌شود؟",
                    en: "Is my code sent anywhere?",
                },
                answer: {
                    fa: "نه. آراستن با کتابخانه js-beautify در مرورگر شما انجام می‌شود.",
                    en: "No. Formatting runs in your browser with the js-beautify library.",
                },
            },
        ],
    },
    example: 'function hello(name){if(name){return "سلام "+name}return "سلام"}',
};
