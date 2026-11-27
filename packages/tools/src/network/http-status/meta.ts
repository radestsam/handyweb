import type { ToolDefinition } from "@handyweb/core";

export const httpStatusMeta: ToolDefinition = {
    id: "http-status",
    slug: "http-status",
    aliases: ["http-status-codes", "http-status-code-reference", "status-codes"],
    category: "network",
    alsoIn: ["developer"],
    related: ["http-header-parser", "url-parser"],
    tags: ["http", "status", "reference"],
    title: { fa: "فهرست کدهای وضعیت HTTP", en: "HTTP Status Code Reference" },
    description: {
        fa: "همه کدهای وضعیت HTTP، از 200 و 301 تا 404 و 503، با نام و توضیح کوتاه به فارسی و انگلیسی؛ با کد یا واژه جستجو کنید.",
        en: "Every HTTP status code, from 200 and 301 to 404 and 503, with its name and a short explanation; search by code or word.",
    },
    keywords: {
        fa: ["کد وضعیت http", "خطای 404", "خطای 500", "کد 301", "کدهای http"],
        en: ["http status codes", "http status code list", "404 meaning", "301 vs 302", "http 429"],
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
    limits: { maxInputBytes: 200 },
    limitations: {
        fa: "تنها کدهای ثبت‌شده در IANA آمده‌اند؛ کدهای ویژه یک سرویس، مانند 499 در nginx یا 520 در Cloudflare، در فهرست نیستند.",
        en: "Only codes in the IANA registry are listed; codes of one service, such as nginx 499 or Cloudflare 520, are not.",
    },
    guide: {
        steps: [
            {
                fa: "کد یا واژه‌ای را بنویسید، یا یک دسته را برگزینید.",
                en: "Type a code or a word, or choose a class.",
            },
            {
                fa: "نام، توضیح و RFC هر کد را بخوانید.",
                en: "Read the name, the explanation, and the RFC of each code.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "فرق 301 و 302 چیست؟",
                    en: "What is the difference between 301 and 302?",
                },
                answer: {
                    fa: "301 جابه‌جایی همیشگی است و موتورهای جستجو نشانی تازه را نگه می‌دارند؛ 302 موقت است. اگر روش درخواست نباید عوض شود، 308 و 307 را به کار ببرید.",
                    en: "301 is permanent and search engines keep the new address; 302 is temporary. If the request method must not change, use 308 and 307.",
                },
            },
        ],
    },
    example: "404",
};
