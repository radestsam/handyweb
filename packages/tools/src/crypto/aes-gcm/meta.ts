import type { ToolDefinition } from "@handyweb/core";

export const aesGcmMeta: ToolDefinition = {
    id: "aes-gcm",
    slug: "aes-gcm",
    aliases: ["encrypt-text", "decrypt-text", "aes-encryption", "text-encryption"],
    category: "crypto",
    alsoIn: [],
    related: ["password-generator", "hmac"],
    tags: ["aes", "encrypt", "decrypt"],
    title: { fa: "رمزنگاری متن با رمز عبور", en: "Text Encryption with a Password" },
    seoTitle: {
        fa: "رمزنگاری متن با رمز عبور (AES) و رمزگشایی",
        en: "Text Encryption with a Password (AES-256-GCM)",
    },
    description: {
        fa: "یک نوشته را با عبارت عبور به شکل AES-256-GCM رمزنگاری کنید و دوباره رمزگشایی کنید. این ابزار Web Crypto مرورگر را به کار می‌برد.",
        en: "Encrypt text with a passphrase using AES-256-GCM, and decrypt it again. It uses the Web Crypto API of the browser.",
    },
    keywords: {
        fa: ["رمزنگاری متن", "رمزگذاری متن با رمز", "aes", "رمزگشایی متن"],
        en: ["encrypt text", "decrypt text", "aes encryption", "aes-gcm", "password encrypt"],
    },
    presets: [
        {
            id: "decrypt",
            title: { fa: "رمزگشایی متن", en: "Decrypt Text" },
            keywords: { fa: ["رمزگشایی متن"], en: ["decrypt text"] },
            options: { mode: "decrypt" },
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
        fa: "تنها نوشته‌ای را رمزگشایی می‌کند که با همین ابزار رمزنگاری شده است. توان رمز به عبارت عبور بستگی دارد: عبارت کوتاه یا آشنا را می‌توان حدس زد.",
        en: "It decrypts only text that this tool encrypted. The strength depends on the passphrase: a short or common one can be guessed.",
    },
    guide: {
        steps: [
            { fa: "رمزنگاری یا رمزگشایی را برگزینید.", en: "Choose Encrypt or Decrypt." },
            { fa: "عبارت عبور را بنویسید.", en: "Enter the passphrase." },
            {
                fa: "نوشته را بچسبانید و خروجی را کپی کنید.",
                en: "Paste the text and copy the output.",
            },
        ],
        faq: [
            {
                question: { fa: "شکل خروجی چیست؟", en: "What is the output format?" },
                answer: {
                    fa: "Base64 از این بایت‌ها: یک بایت نسخه (۱)، ۱۶ بایت salt، ۱۲ بایت IV، سپس متن رمزی و ۱۶ بایت برچسب GCM. کلید با PBKDF2-SHA256، ۶۰۰٬۰۰۰ دور و کلید ۲۵۶ بیتی ساخته می‌شود.",
                    en: "Base64 of these bytes: one version byte (1), a 16-byte salt, a 12-byte IV, then the ciphertext and the 16-byte GCM tag. The key comes from PBKDF2-SHA256 with 600,000 iterations and a 256-bit length.",
                },
            },
        ],
    },
    example: "my secret passphrase",
};
