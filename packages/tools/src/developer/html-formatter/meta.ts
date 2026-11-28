import type { ToolDefinition } from "@handyweb/core";

export const htmlFormatterMeta: ToolDefinition = {
    id: "html-formatter",
    slug: "html-formatter",
    aliases: ["html-beautifier", "format-html", "html-pretty-print"],
    category: "developer",
    alsoIn: [],
    related: ["css-formatter", "js-formatter"],
    tags: ["html", "format"],
    title: { fa: "فرمت و مرتب کردن کد HTML", en: "HTML Formatter" },
    seoTitle: {
        fa: "فرمت و مرتب کردن کد HTML (HTML Beautifier)",
        en: "HTML Formatter and Beautifier Online",
    },
    description: {
        fa: "مرتب کردن HTML با تورفتگی خوانا. CSS و JavaScript درون صفحه هم مرتب می‌شوند.",
        en: "Format HTML with readable indentation. Inline CSS and JavaScript are formatted too.",
    },
    keywords: {
        fa: ["آراستن html", "مرتب کردن html", "html formatter"],
        en: ["html formatter", "html beautifier", "format html", "pretty print html"],
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
    example: "<div><h1>سلام</h1><p>متن <b>نمونه</b></p></div>",
};
