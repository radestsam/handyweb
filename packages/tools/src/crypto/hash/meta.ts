import type { ToolDefinition } from "@handyweb/core";

export const hashMeta: ToolDefinition = {
    id: "hash",
    slug: "hash",
    aliases: ["sha256", "sha-256", "file-hash", "checksum"],
    category: "crypto",
    alsoIn: ["developer"],
    related: ["base64"],
    tags: ["hash", "sha256", "checksum"],
    title: {
        fa: "تولید هش SHA-256 برای متن و فایل",
        en: "SHA-256 Hash Generator for Text and Files",
    },
    description: {
        fa: "هش SHA-256 نوشته یا فایل را بسازید و با هشی که دارید بسنجید. فایل روی دستگاه خودتان خوانده می‌شود و جایی فرستاده نمی‌شود.",
        en: "Create the SHA-256 hash of text or a file and compare it with an expected value. The file is read on your device and never uploaded.",
    },
    keywords: {
        fa: ["هش", "sha256", "چک‌سام", "اثر انگشت فایل", "بررسی فایل", "درهم‌سازی"],
        en: ["sha256", "sha-256", "hash", "checksum", "file hash", "digest", "verify download"],
    },
    presets: [
        {
            id: "file",
            title: { fa: "هش فایل", en: "File Hash" },
            keywords: { fa: ["فایل"], en: ["file"] },
            options: { source: "file" },
        },
    ],
    execution: "worker",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: true,
    inputKinds: ["text", "file"],
    outputKinds: ["text"],
    limits: { maxInputBytes: 20_000_000 },
    limitations: {
        fa: "SHA-256 برای بررسی درستی فایل خوب است، اما برای نگه‌داری گذرواژه نه. فایل‌های بزرگ تکه‌تکه خوانده می‌شوند و اندازه‌شان مرزی ندارد، اما زمان کار به توان دستگاه بستگی دارد.",
        en: "SHA-256 is right for checking file integrity, but not for storing passwords. Large files are read in chunks with no size limit, but the time depends on your device.",
    },
    guide: {
        steps: [
            { fa: "«نوشته» یا «فایل» را برگزینید.", en: "Choose Text or File." },
            {
                fa: "نوشته را بنویسید یا فایل را برگزینید. هش SHA-256 روی دستگاه خودتان ساخته می‌شود.",
                en: "Type the text or choose the file. The SHA-256 hash is created on your device.",
            },
            {
                fa: "برای بررسی یک دانلود، هشی را که سازنده فایل داده است در کادر سنجش بچسبانید.",
                en: "To check a download, paste the hash its publisher gave into the compare box.",
            },
        ],
        faq: [
            {
                question: { fa: "هش SHA-256 به چه کار می‌آید؟", en: "What is a SHA-256 hash for?" },
                answer: {
                    fa: "هش اثر انگشت یک فایل است. اگر حتی یک بایت فایل دگرگون شود، هش آن هم دگرگون می‌شود. پس با آن می‌توانید ببینید فایلی که دانلود کرده‌اید دست‌نخورده است یا نه.",
                    en: "A hash is a fingerprint of a file. If even one byte changes, the hash changes too, so you can check that a downloaded file is intact.",
                },
            },
            {
                question: { fa: "فایل من بارگذاری می‌شود؟", en: "Is my file uploaded?" },
                answer: {
                    fa: "نه. فایل تکه‌تکه در مرورگر خودتان خوانده می‌شود و هیچ بخشی از آن جایی فرستاده نمی‌شود.",
                    en: "No. The file is read in chunks inside your browser, and no part of it is sent anywhere.",
                },
            },
        ],
    },
    example: "HandyWeb",
};
