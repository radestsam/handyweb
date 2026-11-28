import type { ToolDefinition } from "@handyweb/core";

export const hashMeta: ToolDefinition = {
    id: "hash",
    slug: "hash",
    aliases: [
        "sha256",
        "sha-256",
        "sha384",
        "sha512",
        "sha-512",
        "file-hash",
        "checksum",
        "md5",
        "sha1",
    ],
    category: "crypto",
    alsoIn: ["developer"],
    related: ["base64", "hmac"],
    tags: ["hash", "sha256", "sha512", "checksum"],
    title: {
        fa: "تولید هش SHA-256 و SHA-512 برای متن و فایل",
        en: "SHA-256 and SHA-512 Hash Generator for Text and Files",
    },
    description: {
        fa: "هش SHA-256، SHA-384 یا SHA-512 نوشته یا فایل را بسازید و با هشی که دارید بسنجید. فایل روی دستگاه خودتان خوانده می‌شود و جایی فرستاده نمی‌شود.",
        en: "Create the SHA-256, SHA-384, or SHA-512 hash of text or a file and compare it with an expected value. The file is read on your device and never uploaded.",
    },
    keywords: {
        fa: ["هش", "sha256", "sha512", "چک‌سام", "اثر انگشت فایل", "بررسی فایل", "درهم‌سازی"],
        en: [
            "sha256",
            "sha-256",
            "sha384",
            "sha512",
            "sha-512",
            "hash",
            "checksum",
            "file hash",
            "digest",
            "verify download",
            "md5",
            "sha1",
        ],
    },
    presets: [
        {
            id: "file",
            title: { fa: "هش فایل", en: "File Hash" },
            keywords: { fa: ["فایل"], en: ["file"] },
            options: { source: "file" },
        },
        {
            id: "sha384",
            title: { fa: "تولید هش SHA-384", en: "SHA-384 Hash Generator" },
            keywords: { fa: ["sha384"], en: ["sha384", "sha-384"] },
            options: { algorithm: "SHA-384" },
        },
        {
            id: "md5",
            title: { fa: "تولید هش MD5", en: "MD5 Hash Generator" },
            keywords: { fa: ["md5"], en: ["md5", "md5 checksum"] },
            options: { algorithm: "MD5" },
        },
        {
            id: "sha1",
            title: { fa: "تولید هش SHA-1", en: "SHA-1 Hash Generator" },
            keywords: { fa: ["sha1"], en: ["sha1", "sha-1"] },
            options: { algorithm: "SHA-1" },
        },
        {
            id: "sha512",
            title: { fa: "تولید هش SHA-512", en: "SHA-512 Hash Generator" },
            keywords: { fa: ["sha512"], en: ["sha512", "sha-512"] },
            options: { algorithm: "SHA-512" },
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
        fa: "هش‌های SHA-2 برای بررسی درستی فایل خوب‌اند، اما برای نگه‌داری گذرواژه نه. فایل‌های بزرگ تکه‌تکه خوانده می‌شوند و اندازه‌شان مرزی ندارد، اما زمان کار به توان دستگاه بستگی دارد.",
        en: "SHA-2 hashes are right for checking file integrity, but not for storing passwords. Large files are read in chunks with no size limit, but the time depends on your device.",
    },
    guide: {
        steps: [
            { fa: "«نوشته» یا «فایل» را برگزینید.", en: "Choose Text or File." },
            {
                fa: "الگوریتم را برگزینید، سپس نوشته را بنویسید یا فایل را برگزینید. هش روی دستگاه خودتان ساخته می‌شود.",
                en: "Choose the algorithm, then type the text or choose the file. The hash is created on your device.",
            },
            {
                fa: "برای بررسی یک دانلود، هشی را که سازنده فایل داده است در کادر سنجش بچسبانید.",
                en: "To check a download, paste the hash its publisher gave into the compare box.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "کدام الگوریتم را برگزینم؟",
                    en: "Which algorithm do I need?",
                },
                answer: {
                    fa: "همان الگوریتمی که سازنده فایل هش آن را منتشر کرده است. SHA-256 رایج‌ترین است. SHA-384 و SHA-512 هش درازتری می‌سازند و هر سه امروز ایمن‌اند.",
                    en: "The algorithm that the publisher of the file used for its hash. SHA-256 is the most common. SHA-384 and SHA-512 make longer hashes, and all three are secure today.",
                },
            },
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
