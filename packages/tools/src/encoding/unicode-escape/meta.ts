import type { ToolDefinition } from "@handyweb/core";

export const unicodeEscapeMeta: ToolDefinition = {
    id: "unicode-escape",
    slug: "unicode-escape",
    aliases: ["unicode-encoder", "unicode-decoder", "unicode-escape-decoder", "unescape-unicode"],
    category: "encoding",
    alsoIn: ["developer"],
    related: ["unicode-explorer", "html-entities", "url-encoding"],
    tags: ["unicode", "escape", "encoding"],
    title: { fa: "تبدیل متن به کد یونیکد و برعکس", en: "Unicode Escape and Unescape" },
    seoTitle: {
        fa: "تبدیل متن به کد یونیکد و برعکس (\\u و U+)",
        en: "Unicode Escape and Unescape (\\u and U+)",
    },
    description: {
        fa: "نوشته فارسی را به کدهای یونیکد مانند \\u0633 یا U+0633 درآورید، یا رشته‌هایی مانند \\u0633\\u0644\\u0627\\u0645 را به نوشته خوانا برگردانید.",
        en: "Convert text to Unicode escapes such as \\u0633 or U+0633, or decode strings such as \\u0633\\u0644\\u0627\\u0645 back to readable text.",
    },
    keywords: {
        fa: [
            "کد یونیکد",
            "یونیکد فارسی",
            "تبدیل یونیکد",
            "رمزگشایی یونیکد",
            "\\u",
            "کاراکتر یونیکد",
        ],
        en: [
            "unicode escape",
            "unicode unescape",
            "unicode decoder",
            "unicode encoder",
            "\\u escape",
            "json unicode",
            "decode \\u0633",
        ],
    },
    presets: [
        {
            id: "decode",
            title: { fa: "رمزگشایی کدهای یونیکد", en: "Unicode Unescape" },
            keywords: { fa: ["رمزگشایی یونیکد"], en: ["unicode unescape", "unicode decoder"] },
            options: { mode: "decode" },
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
        fa: "رمزگشایی تنها کدهای یونیکد را برمی‌گرداند. دنباله‌های دیگر مانند \\n یا \\t دست‌نخورده می‌مانند.",
        en: "Unescape decodes only Unicode escapes. Other sequences, such as \\n or \\t, stay as they are.",
    },
    guide: {
        steps: [
            {
                fa: "رمزگذاری یا رمزگشایی را برگزینید.",
                en: "Choose Escape or Unescape.",
            },
            {
                fa: "برای رمزگذاری، شکل خروجی را برگزینید: JS / JSON، ES6، Python یا U+XXXX.",
                en: "To escape, choose the output format: JS / JSON, ES6, Python, or U+XXXX.",
            },
            {
                fa: "نوشته را بچسبانید و خروجی را کپی کنید.",
                en: "Paste the text, then copy the output.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "چرا یک ایموجی دو کد \\u دارد؟",
                    en: "Why does one emoji have two \\u escapes?",
                },
                answer: {
                    fa: "JavaScript و JSON نوشته را با UTF-16 نگه می‌دارند. نویسه‌های بالای U+FFFF، مانند بیشتر ایموجی‌ها، در UTF-16 دو تکه (یک جفت surrogate) دارند. شکل ES6 و Python هر نویسه را با یک کد می‌نویسند.",
                    en: "JavaScript and JSON store text as UTF-16. Characters above U+FFFF, such as most emoji, take two units (a surrogate pair) in UTF-16. The ES6 and Python formats write each character as one escape.",
                },
            },
            {
                question: {
                    fa: "کدام شکل را برگزینم؟",
                    en: "Which format do I need?",
                },
                answer: {
                    fa: "برای JSON، JavaScript، Java و C#، شکل JS / JSON. برای کد Python، شکل Python. برای نوشتن در یک سند یا جستجوی یک نویسه، U+XXXX.",
                    en: "JS / JSON for JSON, JavaScript, Java, and C#. Python for Python code. U+XXXX to write about a character or to look it up.",
                },
            },
        ],
    },
    example: "سلام 😀",
};
