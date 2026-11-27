import type { ToolDefinition } from "@handyweb/core";

export const urlEncodingMeta: ToolDefinition = {
    id: "url-encoding",
    slug: "url-encoding",
    aliases: ["url-encoder", "url-decoder", "percent-encoding", "urlencode"],
    category: "encoding",
    alsoIn: ["developer"],
    related: ["base64"],
    tags: ["url", "encoding", "percent"],
    title: {
        fa: "رمزگذاری و رمزگشایی URL",
        en: "URL Encoder and Decoder",
    },
    description: {
        fa: "نشانی‌ها و نوشته فارسی را به شکل درصدی (%D8%A7) رمزگذاری کنید یا آن‌ها را به نوشته خوانا برگردانید. یک بخش از URL یا یک URL کامل.",
        en: "Percent-encode text and URLs (%D8%A7), or decode them back to readable text. Encode one part of a URL or a complete URL.",
    },
    keywords: {
        fa: [
            "رمزگذاری url",
            "رمزگشایی url",
            "لینک فارسی",
            "تبدیل لینک فارسی",
            "درصدی",
            "url encode",
        ],
        en: [
            "url encode",
            "url decode",
            "percent encoding",
            "urlencode",
            "encodeURIComponent",
            "decode persian url",
        ],
    },
    presets: [
        {
            id: "decode",
            title: { fa: "رمزگشایی URL", en: "URL Decoder" },
            keywords: {
                fa: ["خواندن لینک فارسی", "رمزگشایی لینک"],
                en: ["url decode", "decode url"],
            },
            options: { mode: "decode", scope: "full" },
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
        fa: "نام دامنه فارسی به شکل Punycode (xn--) درنمی‌آید و دست‌نخورده می‌ماند. ابزار تنها UTF-8 را می‌شناسد، پس نشانی‌های کهنه با رمزگذاری Windows-1256 رمزگشایی نمی‌شوند.",
        en: "A Persian domain name is not converted to Punycode (xn--): it stays as it is. Only UTF-8 is supported, so old URLs encoded as Windows-1256 do not decode.",
    },
    guide: {
        steps: [
            {
                fa: "رمزگذاری یا رمزگشایی را برگزینید.",
                en: "Choose Encode or Decode.",
            },
            {
                fa: "بگویید ورودی بخشی از URL است (مانند مقدار یک پارامتر) یا یک URL کامل.",
                en: "Choose whether the input is one part of a URL (such as a query value) or a full URL.",
            },
            {
                fa: "نوشته یا URL را بچسبانید و خروجی را کپی کنید.",
                en: "Paste the text or the URL, then copy the output.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "«بخشی از URL» با «URL کامل» چه فرقی دارد؟",
                    en: "What is the difference between “URL part” and “Full URL”?",
                },
                answer: {
                    fa: "«بخشی از URL» همه نویسه‌های ویژه را رمزگذاری می‌کند، مانند encodeURIComponent در JavaScript. آن را برای مقدار یک پارامتر به کار ببرید، تا & یا = درون آن URL را نشکند. «URL کامل» ساختار نشانی را نگه می‌دارد، مانند encodeURI، و %های درست را دوباره رمزگذاری نمی‌کند.",
                    en: "“URL part” encodes every special character, like encodeURIComponent in JavaScript. Use it for a query value, so a & or = inside it does not break the URL. “Full URL” keeps the structure of the address, like encodeURI, and does not encode valid % escapes a second time.",
                },
            },
            {
                question: {
                    fa: "چرا لینک فارسی پس از کپی پر از % می‌شود؟",
                    en: "Why does a Persian link turn into % signs when I copy it?",
                },
                answer: {
                    fa: "URL تنها نویسه‌های لاتین را می‌پذیرد، پس مرورگر هر حرف فارسی را به بایت‌های UTF-8 و سپس به شکل %XX درمی‌آورد. با رمزگشایی، نشانی دوباره خوانا می‌شود.",
                    en: "A URL can hold only a limited set of ASCII characters, so the browser converts each Persian letter to UTF-8 bytes and writes them as %XX. Decode the link to read it again.",
                },
            },
            {
                question: {
                    fa: "گزینه + برای اسپیس کی به کار می‌آید؟",
                    en: "When do I need “+ as space”?",
                },
                answer: {
                    fa: "فرم‌های HTML اسپیس را به شکل + می‌فرستند (application/x-www-form-urlencoded). در جاهای دیگر اسپیس %20 است و + همان + می‌ماند.",
                    en: "HTML forms send a space as + (application/x-www-form-urlencoded). Everywhere else, a space is %20 and + stays +.",
                },
            },
        ],
    },
    example: "https://fa.wikipedia.org/wiki/ایران?q=سلام دنیا",
};
