import type { ToolDefinition } from "@handyweb/core";

export const mimeTypesMeta: ToolDefinition = {
    id: "mime-types",
    slug: "mime-types",
    aliases: ["mime-type-lookup", "file-extension-lookup", "content-type-lookup", "media-types"],
    category: "network",
    alsoIn: ["developer"],
    related: ["file-signature", "http-header-parser"],
    tags: ["mime", "content-type", "extension", "reference"],
    title: { fa: "جستجوی نوع MIME و پسوند فایل", en: "MIME Type and File Extension Lookup" },
    description: {
        fa: "نوع MIME (Content-Type) یک پسوند یا نام فایل را پیدا کنید، یا پسوندهای یک نوع MIME را ببینید؛ برای وب، ایمیل و تنظیم سرور.",
        en: "Find the MIME type (Content-Type) of an extension or a file name, or the extensions of a MIME type; for the web, email, and server settings.",
    },
    keywords: {
        fa: ["نوع mime", "content type", "پسوند فایل", "mime type چیست"],
        en: [
            "mime type lookup",
            "file extension lookup",
            "content type",
            "mime type of webp",
            "mime types list",
        ],
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
    limits: { maxInputBytes: 300 },
    limitations: {
        fa: "تنها نوع‌های رایج (نزدیک ۷۰) آمده‌اند، نه همه فهرست IANA. پسوند نوع واقعی فایل را ثابت نمی‌کند.",
        en: "Only common types (about 70) are listed, not the whole IANA registry. An extension does not prove the real type of a file.",
    },
    guide: {
        steps: [
            {
                fa: "پسوند، نام فایل یا نوع MIME را بنویسید.",
                en: "Type an extension, a file name, or a MIME type.",
            },
            { fa: "نوع یا پسوندها را کپی کنید.", en: "Copy the type or the extensions." },
        ],
        faq: [
            {
                question: {
                    fa: "نوع MIME فایل ناشناخته چیست؟",
                    en: "What is the MIME type of an unknown file?",
                },
                answer: {
                    fa: "application/octet-stream، یعنی داده دودویی با نوع نامعلوم. مرورگر چنین فایلی را دانلود می‌کند و باز نمی‌کند.",
                    en: "application/octet-stream, which means binary data of an unknown type. A browser downloads such a file and does not open it.",
                },
            },
        ],
    },
    example: ".webp",
};
