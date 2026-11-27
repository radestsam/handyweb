import type { ToolDefinition } from "@handyweb/core";

export const yamlFormatterMeta: ToolDefinition = {
    id: "yaml-formatter",
    slug: "yaml-formatter",
    aliases: ["yaml-validator", "yaml-beautifier", "yml-formatter", "yaml-lint"],
    category: "developer",
    alsoIn: [],
    related: ["json-yaml", "json-formatter", "xml-formatter"],
    tags: ["yaml", "format", "validate"],
    title: {
        fa: "آراستن و بررسی درستی YAML",
        en: "YAML Formatter and Validator",
    },
    description: {
        fa: "YAML را با تورفتگی یکسان بیارایید یا درستی آن را بسنجید. توضیح‌ها می‌مانند و خطا با شماره خط و ستون نشان داده می‌شود.",
        en: "Format YAML with even indentation or check that it is valid. Comments stay, and an error shows its line and column.",
    },
    keywords: {
        fa: ["yaml", "آراستن yaml", "بررسی yaml", "فایل yml"],
        en: ["yaml formatter", "yaml validator", "yaml lint", "yml formatter", "yaml beautifier"],
    },
    presets: [
        {
            id: "validate",
            title: { fa: "بررسی درستی YAML", en: "YAML Validator" },
            keywords: { fa: ["بررسی yaml"], en: ["yaml validator", "yaml lint"] },
            options: { action: "validate" },
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
        fa: "YAML 1.2 با شمای پایه خوانده می‌شود. برچسب‌های ویژه، مانند !!python یا !!js، به شکل نوشته ساده خوانده می‌شوند. کلید تکراری خطاست.",
        en: "YAML 1.2 is read with the core schema. Special tags, such as !!python or !!js, are read as plain text. A duplicate key is an error.",
    },
    guide: {
        steps: [
            { fa: "آراستن یا بررسی درستی را برگزینید.", en: "Choose Format or Validate." },
            { fa: "YAML را بچسبانید.", en: "Paste the YAML." },
            {
                fa: "خروجی را کپی کنید، یا خطا را در خط و ستون نشان‌داده درست کنید.",
                en: "Copy the output, or fix the error at the line and column shown.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "توضیح‌ها (#) پاک می‌شوند؟",
                    en: "Are comments (#) removed?",
                },
                answer: {
                    fa: "نه. آراستن توضیح‌ها را نگه می‌دارد و تنها تورفتگی و فاصله‌ها را یکسان می‌کند.",
                    en: "No. Formatting keeps comments and only evens out the indentation and spacing.",
                },
            },
            {
                question: {
                    fa: "فایل YAML ناشناس ایمن است؟",
                    en: "Is an untrusted YAML file safe here?",
                },
                answer: {
                    fa: "بله. هیچ برچسبی کد اجرا نمی‌کند و شمار aliasها مرز دارد، پس فایلی که خود را بی‌پایان بزرگ می‌کند (billion laughs) ایستانده می‌شود.",
                    en: "Yes. No tag runs code, and the number of aliases is limited, so a file that grows itself without end (billion laughs) is stopped.",
                },
            },
        ],
    },
    example: "# تنظیم\nname:   HandyWeb\nlanguages: [fa,  en]\n",
};
