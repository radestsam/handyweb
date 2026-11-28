import type { ToolDefinition } from "@handyweb/core";

export const jsonYamlMeta: ToolDefinition = {
    id: "json-yaml",
    slug: "json-yaml",
    aliases: ["json-to-yaml", "yaml-to-json", "json-yaml-converter"],
    category: "developer",
    alsoIn: [],
    related: ["yaml-formatter", "json-formatter"],
    tags: ["json", "yaml", "convert"],
    title: { fa: "تبدیل JSON به YAML", en: "JSON and YAML Converter" },
    seoTitle: {
        fa: "تبدیل JSON به YAML و YAML به JSON آنلاین",
        en: "JSON and YAML Converter: JSON to YAML and Back",
    },
    description: {
        fa: "تبدیل JSON به YAML یا تبدیل YAML به JSON. چند سند YAML به یک آرایه JSON تبدیل می‌شوند.",
        en: "Convert JSON to YAML or YAML to JSON. Several YAML documents become one JSON array.",
    },
    keywords: {
        fa: ["تبدیل json به yaml", "تبدیل yaml به json", "json yaml"],
        en: ["json to yaml", "yaml to json", "json yaml converter"],
    },
    presets: [
        {
            id: "yaml-to-json",
            title: { fa: "تبدیل YAML به JSON", en: "YAML to JSON Converter" },
            keywords: { fa: ["yaml به json"], en: ["yaml to json"] },
            options: { direction: "yaml-to-json" },
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
        fa: "توضیح‌های YAML و anchorها در JSON نمی‌مانند. شماره‌های بزرگ‌تر از ۲ به توان ۵۳ گرد می‌شوند.",
        en: "YAML comments and anchors do not survive in JSON. Numbers larger than 2 to the 53rd are rounded.",
    },
    guide: {
        steps: [
            { fa: "سو را برگزینید.", en: "Choose the direction." },
            { fa: "JSON یا YAML را بچسبانید.", en: "Paste the JSON or the YAML." },
            { fa: "خروجی را کپی کنید.", en: "Copy the output." },
        ],
        faq: [
            {
                question: {
                    fa: "چرا برخی نوشته‌ها در YAML درون گیومه‌اند؟",
                    en: "Why are some strings in quotes in the YAML?",
                },
                answer: {
                    fa: 'نوشته‌ای مانند "true" یا "1.0" بی‌گیومه بولی یا عدد خوانده می‌شود. گیومه نوع نوشته را نگه می‌دارد.',
                    en: 'A string such as "true" or "1.0" would be read as a boolean or a number without quotes. The quotes keep it a string.',
                },
            },
        ],
    },
    example: '{"name":"HandyWeb","languages":["fa","en"]}',
};
