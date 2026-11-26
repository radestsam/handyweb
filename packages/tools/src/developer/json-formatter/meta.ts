import type { ToolDefinition } from "@handyweb/core";

export const jsonFormatterMeta: ToolDefinition = {
    id: "json-formatter",
    slug: "json-formatter",
    aliases: ["json-validator", "json-minifier", "json-beautifier", "json-pretty-print"],
    category: "developer",
    alsoIn: [],
    related: ["base64"],
    tags: ["json", "format", "validate"],
    title: { fa: "قالب‌بندی و اعتبارسنجی JSON", en: "JSON Formatter and Validator" },
    description: {
        fa: "JSON را بیارایید و خوانا کنید، فشرده کنید یا نادرستی‌های آن را با شماره خط و ستون پیدا کنید. همه کار در مرورگر خودتان انجام می‌شود.",
        en: "Pretty-print or minify JSON, or find its errors with the line and column.",
    },
    keywords: {
        fa: ["جیسون", "json", "قالب‌بندی", "مرتب‌سازی", "اعتبارسنجی", "فشرده‌سازی", "زیباسازی"],
        en: ["json", "format", "pretty print", "beautify", "validate", "lint", "minify"],
    },
    presets: [
        {
            id: "validate",
            title: { fa: "اعتبارسنجی JSON", en: "JSON Validator" },
            keywords: { fa: ["اعتبارسنجی"], en: ["validator"] },
            options: { action: "validate" },
        },
        {
            id: "minify",
            title: { fa: "فشرده‌سازی JSON", en: "JSON Minifier" },
            keywords: { fa: ["فشرده‌سازی"], en: ["minifier"] },
            options: { action: "minify" },
        },
    ],
    execution: "worker",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: true,
    inputKinds: ["text"],
    outputKinds: ["text"],
    limits: { maxInputBytes: 20_000_000 },
    limitations: {
        fa: "JavaScript شماره‌های بسیار بزرگ (بزرگ‌تر از ۲ به توان ۵۳) را بی‌کم‌وکاست نگه نمی‌دارد و ابزار این شماره‌ها را نشان می‌دهد. اگر کلیدی دو بار آمده باشد، تنها واپسین ارزش آن در خروجی می‌ماند.",
        en: "JavaScript cannot keep integers larger than 2 to the power of 53 exactly. The tool marks such numbers. If a key appears twice, only the last value stays in the output.",
    },
    guide: {
        steps: [
            {
                fa: "JSON خود را در کادر ورودی بچسبانید.",
                en: "Paste your JSON into the input box.",
            },
            {
                fa: "«آراستن» برای خوانایی، «فشرده‌سازی» برای کوچک کردن، یا «بررسی درستی» را برگزینید.",
                en: "Choose Format to make it readable, Minify to make it small, or Validate to check it.",
            },
            {
                fa: "اگر JSON نادرست باشد، شماره خط و ستون نادرستی نشان داده می‌شود. آن را درست کنید و خروجی را کپی کنید.",
                en: "If the JSON is invalid, the line and column of the error appear. Fix it, then copy the output.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "JSON من به سرور فرستاده می‌شود؟",
                    en: "Is my JSON sent to a server?",
                },
                answer: {
                    fa: "نه. همه کار در مرورگر خودتان انجام می‌شود، حتی برای فایل‌های بزرگ.",
                    en: "No. All the work happens in your browser, even for large inputs.",
                },
            },
            {
                question: {
                    fa: "چرا ویرگول پایانی نادرست است؟",
                    en: "Why is a trailing comma an error?",
                },
                answer: {
                    fa: "استاندارد JSON ویرگول پس از واپسین بخش یک آرایه یا آبجکت را نمی‌پذیرد، هرچند JavaScript آن را می‌پذیرد.",
                    en: "The JSON standard does not allow a comma after the last item of an array or object, even though JavaScript does.",
                },
            },
        ],
    },
    example: '{"name":"HandyWeb","tools":["base64","json"],"local":true}',
};
