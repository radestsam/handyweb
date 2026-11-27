import type { ToolDefinition } from "@handyweb/core";

export const cssFormatterMeta: ToolDefinition = {
    id: "css-formatter",
    slug: "css-formatter",
    aliases: ["css-beautifier", "format-css", "unminify-css"],
    category: "developer",
    alsoIn: [],
    related: ["html-formatter", "js-formatter"],
    tags: ["css", "format"],
    title: {
        fa: "آراستن کد CSS",
        en: "CSS Formatter",
    },
    description: {
        fa: "کد CSS فشرده یا درهم را با تورفتگی و یک ویژگی در هر خط بیارایید.",
        en: "Format minified or messy CSS with indentation and one property per line.",
    },
    keywords: {
        fa: ["آراستن css", "مرتب کردن css", "css formatter"],
        en: ["css formatter", "css beautifier", "format css", "unminify css"],
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
    example: "body{margin:0;font-family:Estedad}a{color:#bc4a3c}",
};
