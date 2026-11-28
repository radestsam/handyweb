import type { ToolDefinition } from "@handyweb/core";

export const xmlFormatterMeta: ToolDefinition = {
    id: "xml-formatter",
    slug: "xml-formatter",
    aliases: ["xml-validator", "xml-minifier", "xml-beautifier", "xml-pretty-print"],
    category: "developer",
    alsoIn: [],
    related: ["json-formatter", "html-entities"],
    tags: ["xml", "format", "validate"],
    title: { fa: "فرمت و بررسی درستی XML", en: "XML Formatter and Validator" },
    seoTitle: {
        fa: "فرمت و بررسی درستی XML (XML Formatter)",
        en: "XML Formatter and Validator Online",
    },
    description: {
        fa: "بررسی XML و مرتب کردن آن با تورفتگی خوانا، یا فشرده سازی XML. اگر خطایی باشد، شماره خط و ستون آن را می‌بینید.",
        en: "Pretty-print XML with clean indentation, minify it, or check that it is well-formed. An error shows its line and column.",
    },
    keywords: {
        fa: ["آراستن xml", "بررسی xml", "فشرده سازی xml", "xml فارسی", "خطای xml"],
        en: [
            "xml formatter",
            "xml validator",
            "xml beautifier",
            "pretty print xml",
            "xml minifier",
            "well-formed xml",
        ],
    },
    presets: [
        {
            id: "validate",
            title: { fa: "بررسی درستی XML", en: "XML Validator" },
            keywords: { fa: ["بررسی xml"], en: ["xml validator", "validate xml"] },
            options: { action: "validate" },
        },
        {
            id: "minify",
            title: { fa: "فشرده‌سازی XML", en: "XML Minifier" },
            keywords: { fa: ["فشرده سازی xml"], en: ["xml minifier", "minify xml"] },
            options: { action: "minify" },
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
        fa: "تنها درستی ساختار (well-formed) بررسی می‌شود، نه DTD یا XML Schema. متن خطا از مرورگر شماست و به زبان مرورگر نوشته می‌شود.",
        en: "Only well-formedness is checked, not a DTD or an XML Schema. The error detail comes from your browser, in the browser language.",
    },
    guide: {
        steps: [
            {
                fa: "آراستن، فشرده‌سازی یا بررسی درستی را برگزینید.",
                en: "Choose Format, Minify, or Validate.",
            },
            {
                fa: "XML را در کادر ورودی بچسبانید.",
                en: "Paste your XML into the input box.",
            },
            {
                fa: "خروجی را کپی کنید، یا اگر خطایی بود، خط و ستون آن را درست کنید.",
                en: "Copy the output, or fix the error at the line and column shown.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "آراستن، متن درون تگ‌ها را دگرگون می‌کند؟",
                    en: "Does formatting change the text inside elements?",
                },
                answer: {
                    fa: "نه. اسپیس درون متن شاید معنا داشته باشد، پس عنصری که متن دارد، همان‌گونه که هست در یک خط می‌ماند. تنها اسپیس‌ها و خط‌های تازه میان عنصرها دگرگون می‌شوند.",
                    en: "No. Whitespace in text can be meaningful, so an element that holds text stays on one line, as it is. Only the whitespace between elements changes.",
                },
            },
            {
                question: {
                    fa: "XML درست ساخته شده (well-formed) یعنی چه؟",
                    en: "What does well-formed mean?",
                },
                answer: {
                    fa: "یعنی هر تگ بسته شده است، تگ‌ها درست درون هم آمده‌اند، ارزش ویژگی‌ها درون گیومه است و سند تنها یک ریشه دارد. این ابزار درستی در برابر DTD یا Schema را نمی‌سنجد.",
                    en: "Every tag is closed, tags nest correctly, attribute values are in quotes, and the document has one root element. This tool does not check the document against a DTD or a schema.",
                },
            },
            {
                question: {
                    fa: "XML من بارگذاری فایل بیرونی دارد. ایمن است؟",
                    en: "My XML refers to external files. Is that safe?",
                },
                answer: {
                    fa: "بله. پارسر مرورگر هیچ DTD یا موجودیت بیرونی را بارگیری نمی‌کند.",
                    en: "Yes. The browser parser loads no external DTD or entity.",
                },
            },
        ],
    },
    example: '<?xml version="1.0"?><note><to>سارا</to><from>Ali</from><body>سلام!</body></note>',
};
