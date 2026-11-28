import type { ToolDefinition } from "@handyweb/core";

export const hexMeta: ToolDefinition = {
    id: "hex",
    slug: "hex",
    aliases: ["hex-encoder", "hex-decoder", "text-to-hex", "hex-to-text"],
    category: "encoding",
    alsoIn: ["developer"],
    related: ["binary", "base64", "number-base"],
    tags: ["hex", "bytes", "encoding"],
    title: {
        fa: "تبدیل متن به هگز و برعکس",
        en: "Text to Hex Converter",
    },
    description: {
        fa: "نوشته را به بایت‌های هگز (UTF-8) برگردانید یا هگز را به نوشته خوانا درآورید. 0x، \\x، اسپیس و دونقطه پذیرفته می‌شوند.",
        en: "Convert text to hex bytes (UTF-8) or hex back to readable text. 0x, \\x, spaces, and colons are accepted.",
    },
    keywords: {
        fa: ["تبدیل به هگز", "هگز به متن", "هگزادسیمال", "hex"],
        en: ["text to hex", "hex to text", "hex encoder", "hex decoder", "string to hex"],
    },
    presets: [
        {
            id: "decode",
            title: { fa: "تبدیل هگز به نوشته", en: "Hex to Text" },
            keywords: { fa: ["هگز به متن"], en: ["hex to text"] },
            options: { mode: "decode" },
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
        fa: "نوشته به شکل UTF-8 خوانده می‌شود، پس هر حرف فارسی دو بایت است. بایت‌هایی که UTF-8 درستی نیستند، به نوشته برگردانده نمی‌شوند.",
        en: "Text is read as UTF-8, so each Persian letter is two bytes. Bytes that are not valid UTF-8 are not turned back into text.",
    },
    guide: {
        steps: [
            { fa: "کار را برگزینید.", en: "Choose the action." },
            { fa: "نوشته یا بایت‌ها را بچسبانید.", en: "Paste the text or the bytes." },
            { fa: "خروجی را کپی کنید.", en: "Copy the output." },
        ],
        faq: [
            {
                question: {
                    fa: "چرا یک حرف فارسی دو بایت دارد؟",
                    en: "Why does one Persian letter have two bytes?",
                },
                answer: {
                    fa: "در UTF-8 حروف لاتین یک بایت، حروف فارسی دو بایت و بیشتر ایموجی‌ها چهار بایت دارند.",
                    en: "In UTF-8, Latin letters take one byte, Persian letters two bytes, and most emoji four bytes.",
                },
            },
        ],
    },
    example: "سلام HandyWeb",
};
