import type { ToolDefinition } from "@handyweb/core";

export const base64Meta: ToolDefinition = {
    id: "base64",
    slug: "base64",
    aliases: ["base64-encoder", "base64-decoder", "base64-encode", "base64-decode"],
    category: "encoding",
    alsoIn: ["developer"],
    related: ["json-formatter", "url-encoding"],
    tags: ["base64", "encoding"],
    title: { fa: "رمزگذاری و رمزگشایی Base64", en: "Base64 Encoder and Decoder" },
    seoTitle: {
        fa: "رمزگذاری و رمزگشایی Base64 متن فارسی",
        en: "Base64 Encoder and Decoder Online (UTF-8)",
    },
    description: {
        fa: "نوشته را به Base64 برگردانید یا Base64 را دوباره به نوشته درآورید. با UTF-8، نویسه‌های ایمن برای URL و نوشته فارسی کار می‌کند.",
        en: "Encode text as Base64 or decode Base64 back to text. Supports UTF-8, the URL-safe alphabet, and Persian text.",
    },
    keywords: {
        fa: ["بیس۶۴", "بیس 64", "base64", "کدگذاری", "رمزگذاری", "رمزگشایی", "تبدیل متن"],
        en: ["base64", "encode", "decode", "base64url", "url safe", "utf-8", "btoa", "atob"],
    },
    presets: [
        {
            id: "decode",
            title: { fa: "رمزگشایی Base64", en: "Base64 Decoder" },
            keywords: { fa: ["رمزگشایی"], en: ["decode"] },
            options: { mode: "decode" },
        },
    ],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: true,
    inputKinds: ["text"],
    outputKinds: ["text"],
    limits: { maxInputBytes: 5_000_000 },
    limitations: {
        fa: "این ابزار نوشته می‌پذیرد. برای برگرداندن یک فایل به Base64، ابزار ویژه آن را به کار ببرید.",
        en: "This tool works on text. Use the separate file tool to convert a file to Base64.",
    },
    guide: {
        steps: [
            { fa: "«رمزگذاری» یا «رمزگشایی» را برگزینید.", en: "Choose Encode or Decode." },
            {
                fa: "نوشته یا Base64 را در کادر ورودی بنویسید یا بچسبانید. خروجی همان دم ساخته می‌شود.",
                en: "Type or paste your text or Base64 into the input box. The output appears as you type.",
            },
            {
                fa: "با دکمه «کپی» خروجی را بردارید، یا با «جابه‌جایی» آن را دوباره به ورودی بفرستید.",
                en: "Copy the output, or use Swap to send it back to the input.",
            },
        ],
        faq: [
            {
                question: { fa: "آیا Base64 رمزنگاری است؟", en: "Is Base64 encryption?" },
                answer: {
                    fa: "نه. Base64 تنها داده را به نویسه‌های ساده برمی‌گرداند و هر کسی می‌تواند آن را بازگرداند. برای پنهان کردن داده، رمزنگاری به کار ببرید.",
                    en: "No. Base64 only rewrites data as plain characters, and anyone can decode it. Use encryption to keep data secret.",
                },
            },
            {
                question: {
                    fa: "نوشته فارسی درست برمی‌گردد؟",
                    en: "Does Persian text decode correctly?",
                },
                answer: {
                    fa: "بله. ابزار نوشته را با UTF-8 کدگذاری می‌کند، پس حروف فارسی، نیم‌فاصله و ایموجی بی‌کم‌وکاست برمی‌گردند.",
                    en: "Yes. The tool encodes text as UTF-8, so Persian letters, ZWNJ, and emoji come back exactly.",
                },
            },
            {
                question: { fa: "Base64 ایمن برای URL چیست؟", en: "What is URL-safe Base64?" },
                answer: {
                    fa: "گونه‌ای از Base64 که به جای + و / نویسه‌های - و _ را به کار می‌برد تا در نشانی‌های وب دردسر نسازد. رمزگشایی هر دو گونه را می‌پذیرد.",
                    en: "A Base64 variant that uses - and _ instead of + and /, so it is safe in web addresses. Decoding accepts both variants.",
                },
            },
        ],
    },
    example: "سلام دنیا! Hello, world!",
};
