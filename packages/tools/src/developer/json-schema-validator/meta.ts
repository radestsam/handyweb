import type { ToolDefinition } from "@handyweb/core";

export const jsonSchemaValidatorMeta: ToolDefinition = {
    id: "json-schema-validator",
    slug: "json-schema-validator",
    aliases: ["json-schema", "validate-json-schema", "json-schema-checker"],
    category: "developer",
    alsoIn: [],
    related: ["json-formatter", "json-diff"],
    tags: ["json", "schema", "validate"],
    title: {
        fa: "بررسی JSON با JSON Schema",
        en: "JSON Schema Validator",
    },
    description: {
        fa: "یک داده JSON را با یک JSON Schema (نسخه‌های 4، 7، 2019-09 و 2020-12) بسنجید و هر خطا را با مسیر آن در داده ببینید.",
        en: "Check JSON data against a JSON Schema (drafts 4, 7, 2019-09, and 2020-12) and see each error with its path in the data.",
    },
    keywords: {
        fa: ["json schema", "بررسی json", "اعتبارسنجی json"],
        en: ["json schema validator", "validate json schema", "json schema", "ajv online"],
    },
    presets: [],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["text"],
    outputKinds: ["structured"],
    limits: { maxInputBytes: 5_000_000 },
    limitations: {
        fa: "$ref به نشانی‌های بیرونی بارگیری نمی‌شود، چون ابزار هیچ درخواستی به شبکه نمی‌فرستد. $ref درون همان شِما کار می‌کند. پیام خطاها انگلیسی‌اند.",
        en: "A $ref to another URL is not loaded, because the tool sends no network request. A $ref inside the same schema works. Error messages are in English.",
    },
    guide: {
        steps: [
            {
                fa: "داده JSON را در کادر نخست بچسبانید.",
                en: "Paste the JSON data into the first box.",
            },
            {
                fa: "JSON Schema را در کادر دوم بچسبانید.",
                en: "Paste the JSON Schema into the second box.",
            },
            { fa: "خطاها را با مسیر هر یک ببینید.", en: "Read each error with its path." },
        ],
        faq: [
            {
                question: {
                    fa: "کدام نسخه JSON Schema به کار می‌رود؟",
                    en: "Which JSON Schema draft is used?",
                },
                answer: {
                    fa: "با «خودکار»، نسخه از $schema درون شِما خوانده می‌شود. اگر $schema نباشد، 2020-12 به کار می‌رود.",
                    en: "With Auto, the draft comes from the $schema of the schema. Without $schema, 2020-12 is used.",
                },
            },
        ],
    },
    example: '{"name":"HandyWeb","tools":12}',
};
