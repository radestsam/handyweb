import type { ToolDefinition } from "@handyweb/core";

export const binaryMeta: ToolDefinition = {
    id: "binary",
    slug: "binary",
    aliases: ["binary-encoder", "binary-decoder", "text-to-binary", "binary-to-text"],
    category: "encoding",
    alsoIn: ["developer"],
    related: ["hex", "base64", "number-base"],
    tags: ["binary", "bytes", "encoding"],
    title: {
        fa: "تبدیل متن به باینری و برعکس",
        en: "Text to Binary Converter",
    },
    description: {
        fa: "نوشته را به بایت‌های دودویی (صفر و یک، UTF-8) برگردانید یا رشته دودویی را به نوشته خوانا درآورید.",
        en: "Convert text to binary bytes (zeros and ones, UTF-8) or binary back to readable text.",
    },
    keywords: {
        fa: ["تبدیل به باینری", "باینری به متن", "صفر و یک", "کد باینری"],
        en: ["text to binary", "binary to text", "binary encoder", "binary decoder"],
    },
    presets: [
        {
            id: "decode",
            title: { fa: "تبدیل دودویی به نوشته", en: "Binary to Text" },
            keywords: { fa: ["دودویی به متن"], en: ["binary to text"] },
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
