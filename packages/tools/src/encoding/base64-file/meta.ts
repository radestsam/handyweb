import type { ToolDefinition } from "@handyweb/core";

export const base64FileMeta: ToolDefinition = {
    id: "base64-file",
    slug: "base64-file",
    aliases: ["data-uri", "file-to-base64", "image-to-base64", "base64-to-file", "base64-to-image"],
    category: "encoding",
    alsoIn: ["developer", "image"],
    related: ["base64"],
    tags: ["base64", "file", "data uri"],
    title: {
        fa: "تبدیل فایل به Base64 و Data URI",
        en: "File to Base64 and Data URI",
    },
    description: {
        fa: "یک فایل یا تصویر را به Base64 یا Data URI برگردانید، یا Base64 را دوباره به فایل درآورید و دانلود کنید. فایل از دستگاه شما بیرون نمی‌رود.",
        en: "Turn a file or image into Base64 or a Data URI, or turn Base64 back into a file and download it. The file never leaves your device.",
    },
    keywords: {
        fa: ["تبدیل فایل به base64", "تصویر به base64", "data uri", "base64 به فایل"],
        en: ["file to base64", "image to base64", "data uri", "base64 to file", "base64 to image"],
    },
    presets: [
        {
            id: "decode",
            title: { fa: "تبدیل Base64 به فایل", en: "Base64 to File" },
            keywords: { fa: ["base64 به فایل"], en: ["base64 to file", "base64 to image"] },
            options: { mode: "decode" },
        },
    ],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["file", "text"],
    outputKinds: ["text", "file"],
    limits: { maxInputBytes: 15_000_000, maxFileBytes: 10_000_000 },
    limitations: {
        fa: "فایل تا ۱۰ مگابایت. گونه فایل از بایت‌های آغاز آن شناخته می‌شود (PNG، JPEG، GIF، WebP، PDF، ZIP و چند گونه دیگر). گونه‌های دیگر .bin ذخیره می‌شوند.",
        en: "Files up to 10 MB. The file type is detected from its first bytes (PNG, JPEG, GIF, WebP, PDF, ZIP, and a few more). Other types are saved as .bin.",
    },
    guide: {
        steps: [
            { fa: "کار را برگزینید.", en: "Choose the action." },
            {
                fa: "فایل را برگزینید، یا Base64 را بچسبانید.",
                en: "Choose a file, or paste the Base64.",
            },
            {
                fa: "خروجی را کپی یا فایل را دانلود کنید.",
                en: "Copy the output or download the file.",
            },
        ],
        faq: [
            {
                question: { fa: "Data URI به چه کار می‌آید؟", en: "What is a Data URI for?" },
                answer: {
                    fa: "برای گذاشتن یک تصویر کوچک مستقیم در HTML یا CSS، بی فایل جدا. برای فایل‌های بزرگ بهتر نیست، چون صفحه را سنگین می‌کند.",
                    en: "To put a small image straight into HTML or CSS, without a separate file. It is not good for large files, because it makes the page heavy.",
                },
            },
        ],
    },
    example: "سلام",
};
