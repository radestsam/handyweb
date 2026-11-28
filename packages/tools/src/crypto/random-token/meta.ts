import type { ToolDefinition } from "@handyweb/core";

export const randomTokenMeta: ToolDefinition = {
    id: "random-token",
    slug: "random-token",
    aliases: ["random-bytes", "random-token-generator", "api-key-generator", "secret-generator"],
    category: "crypto",
    alsoIn: ["developer"],
    related: ["password-generator", "hmac"],
    tags: ["random", "token", "bytes", "secret"],
    title: {
        fa: "ساخت توکن و بایت تصادفی",
        en: "Random Token and Bytes Generator",
    },
    description: {
        fa: "توکن، کلید API یا بایت‌های تصادفی ایمن بسازید، به شکل هگز، Base64 یا Base64url. تصادف از crypto.getRandomValues مرورگر می‌آید.",
        en: "Create secure random tokens, API keys, or random bytes as hex, Base64, or Base64url. The randomness comes from crypto.getRandomValues of your browser.",
    },
    keywords: {
        fa: ["توکن تصادفی", "کلید api", "بایت تصادفی", "کلید پنهان", "رشته تصادفی"],
        en: [
            "random token",
            "random bytes",
            "api key generator",
            "secret key generator",
            "random hex",
            "random string",
        ],
    },
    presets: [
        {
            id: "bytes",
            title: { fa: "ساخت بایت تصادفی", en: "Random Bytes Generator" },
            keywords: { fa: ["بایت تصادفی"], en: ["random bytes"] },
            options: { kind: "bytes" },
        },
    ],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["structured"],
    outputKinds: ["text"],
    limitations: {
        fa: "هر توکن تا ۱٬۰۲۴ نویسه، هر خروجی بایت تا ۱٬۰۲۴ بایت، و هر بار تا ۱۰۰ مقدار.",
        en: "Up to 1,024 characters per token, 1,024 bytes per value, and 100 values at a time.",
    },
    guide: {
        steps: [
            {
                fa: "توکن یا بایت تصادفی را برگزینید.",
                en: "Choose Token or Random bytes.",
            },
            {
                fa: "نویسه‌ها یا گونه خروجی، درازا و شمار را برگزینید.",
                en: "Choose the characters or the output format, the length, and how many.",
            },
            {
                fa: "خروجی را کپی کنید، یا «ساخت دوباره» را بزنید.",
                en: "Copy the output, or select Generate again.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "توکن چقدر باید دراز باشد؟",
                    en: "How long must a token be?",
                },
                answer: {
                    fa: "برای کلید API یا توکن نشست، دست‌کم ۱۲۸ بیت تصادف: ۳۲ نویسه هگز یا ۲۲ نویسه Base64url. شمار بیت‌ها زیر خروجی آمده است.",
                    en: "For an API key or a session token, at least 128 bits of randomness: 32 hex characters or 22 Base64url characters. The bit count shows under the output.",
                },
            },
            {
                question: {
                    fa: "این مقدارها برای رمزنگاری ایمن‌اند؟",
                    en: "Are these values safe for cryptography?",
                },
                answer: {
                    fa: "بله. همه از crypto.getRandomValues می‌آیند، همان منبعی که مرورگر برای کلیدها به کار می‌برد. هر نویسه با نمونه‌برداری رد شدنی (rejection sampling) برگزیده می‌شود، پس هیچ نویسه‌ای بیش از دیگری نمی‌آید.",
                    en: "Yes. They all come from crypto.getRandomValues, the source that the browser uses for keys. Each character is picked with rejection sampling, so no character is more likely than another.",
                },
            },
        ],
    },
    example: "40",
};
