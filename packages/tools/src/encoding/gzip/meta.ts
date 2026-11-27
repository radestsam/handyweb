import type { ToolDefinition } from "@handyweb/core";

export const gzipMeta: ToolDefinition = {
    id: "gzip",
    slug: "gzip",
    aliases: ["deflate", "gzip-compress", "gunzip", "zlib"],
    category: "encoding",
    alsoIn: ["developer"],
    related: ["base64", "base64-file"],
    tags: ["gzip", "deflate", "compression"],
    title: {
        fa: "فشرده‌سازی و باز کردن Gzip و Deflate",
        en: "Gzip and Deflate Compressor",
    },
    description: {
        fa: "نوشته یا فایل را با gzip، deflate (zlib) یا deflate-raw فشرده کنید یا داده فشرده را باز کنید. کار با توان خود مرورگر انجام می‌شود.",
        en: "Compress text or a file with gzip, deflate (zlib), or deflate-raw, or decompress compressed data. The browser does the work itself.",
    },
    keywords: {
        fa: ["gzip", "فشرده سازی", "باز کردن gz", "deflate", "zlib"],
        en: ["gzip", "gunzip", "deflate", "zlib", "compress text", "decompress gzip"],
    },
    presets: [
        {
            id: "decompress",
            title: { fa: "باز کردن Gzip", en: "Gzip Decompressor" },
            keywords: { fa: ["باز کردن gz"], en: ["gunzip", "decompress gzip"] },
            options: { mode: "decompress" },
        },
    ],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["text", "file"],
    outputKinds: ["text", "file"],
    limits: { maxInputBytes: 10_000_000, maxFileBytes: 50_000_000 },
    limitations: {
        fa: "تنها یک جریان gzip یا deflate، نه بایگانی‌های چندفایلی مانند ZIP یا TAR. داده بازشده تا ۵۰ مگابایت؛ بیش از آن کار می‌ایستد تا دستگاه گیر نکند.",
        en: "One gzip or deflate stream only, not archives with many files such as ZIP or TAR. Decompressed data up to 50 MB; above that the work stops so the device does not freeze.",
    },
    guide: {
        steps: [
            { fa: "فشرده‌سازی یا باز کردن را برگزینید.", en: "Choose Compress or Decompress." },
            {
                fa: "نوشته یا Base64 را بچسبانید، یا فایلی را برگزینید.",
                en: "Paste text or Base64, or choose a file.",
            },
            { fa: "خروجی را کپی یا دانلود کنید.", en: "Copy or download the output." },
        ],
        faq: [
            {
                question: {
                    fa: "gzip، deflate و deflate-raw چه فرقی دارند؟",
                    en: "What is the difference between gzip, deflate, and deflate-raw?",
                },
                answer: {
                    fa: "هر سه یک روش فشرده‌سازی‌اند. gzip سربرگ و checksum دارد و در فایل‌های .gz و HTTP به کار می‌رود. deflate همان شکل zlib است و deflate-raw بی‌سربرگ است. هنگام باز کردن، gzip و zlib خودکار شناخته می‌شوند.",
                    en: "All three use the same compression. gzip adds a header and a checksum and is used in .gz files and HTTP. deflate is the zlib format, and deflate-raw has no header. When decompressing, gzip and zlib are detected for you.",
                },
            },
        ],
    },
    example: "سلام HandyWeb سلام HandyWeb سلام HandyWeb",
};
