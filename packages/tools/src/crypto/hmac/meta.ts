import type { ToolDefinition } from "@handyweb/core";

export const hmacMeta: ToolDefinition = {
    id: "hmac",
    slug: "hmac",
    aliases: ["hmac-generator", "hmac-verifier", "hmac-sha256", "webhook-signature"],
    category: "crypto",
    alsoIn: ["developer"],
    related: ["hash", "jwt-decoder"],
    tags: ["hmac", "signature", "sha256"],
    title: {
        fa: "ساخت و بررسی HMAC",
        en: "HMAC Generator and Verifier",
    },
    description: {
        fa: "HMAC-SHA256، HMAC-SHA384 یا HMAC-SHA512 یک پیام را با کلید پنهان بسازید، یا امضای یک وب‌هوک را بررسی کنید. کلید و پیام روی دستگاه شما می‌مانند.",
        en: "Create the HMAC-SHA256, HMAC-SHA384, or HMAC-SHA512 of a message with a secret key, or check a webhook signature. The key and the message stay on your device.",
    },
    keywords: {
        fa: ["hmac", "امضای پیام", "امضای وب‌هوک", "کلید پنهان", "hmac sha256"],
        en: [
            "hmac",
            "hmac generator",
            "hmac sha256",
            "hmac verify",
            "webhook signature",
            "message authentication code",
        ],
    },
    presets: [
        {
            id: "verify",
            title: { fa: "بررسی HMAC", en: "HMAC Verifier" },
            keywords: {
                fa: ["بررسی امضای وب‌هوک"],
                en: ["verify hmac", "verify webhook signature"],
            },
            options: { mode: "verify" },
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
    limits: { maxInputBytes: 20_000_000 },
    limitations: {
        fa: "پیام به شکل UTF-8 خوانده می‌شود. اگر سرویس شما بدنه خام درخواست را امضا می‌کند، همان بدنه را بی‌کم‌وکاست بچسبانید: یک اسپیس یا خط تازه بیشتر، HMAC را دگرگون می‌کند.",
        en: "The message is read as UTF-8. If your service signs the raw request body, paste that body exactly: one extra space or line break changes the HMAC.",
    },
    guide: {
        steps: [
            {
                fa: "الگوریتم را برگزینید و پیام را بچسبانید.",
                en: "Choose the algorithm and paste the message.",
            },
            {
                fa: "کلید پنهان را بنویسید و شکل آن را برگزینید: نوشته، هگز یا Base64.",
                en: "Enter the secret key and choose its format: text, hex, or Base64.",
            },
            {
                fa: "در «ساخت» HMAC را کپی کنید، یا در «بررسی» HMAC دریافتی را بچسبانید.",
                en: "In Generate, copy the HMAC. In Verify, paste the HMAC you received.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "HMAC با هش چه فرقی دارد؟",
                    en: "How is an HMAC different from a hash?",
                },
                answer: {
                    fa: "هر کسی می‌تواند هش یک پیام را بسازد. HMAC به کلید پنهان هم نیاز دارد، پس نشان می‌دهد پیام را کسی ساخته است که کلید را دارد و در راه دگرگون نشده است.",
                    en: "Anyone can make the hash of a message. An HMAC also needs a secret key, so it shows that the message comes from someone who has the key and that it did not change on the way.",
                },
            },
            {
                question: {
                    fa: "امضای وب‌هوک را چگونه بررسی کنم؟",
                    en: "How do I check a webhook signature?",
                },
                answer: {
                    fa: "«بررسی» را برگزینید، بدنه خام درخواست را در پیام و کلید وب‌هوک را در کلید بچسبانید. سپس سربرگ امضا، مانند sha256=…، را در کادر HMAC بچسبانید. پیشوند sha256= خودبه‌خود کنار گذاشته می‌شود.",
                    en: "Choose Verify, paste the raw request body as the message and the webhook secret as the key. Then paste the signature header, such as sha256=…, into the HMAC box. The sha256= prefix is removed for you.",
                },
            },
            {
                question: {
                    fa: "سنجش ایمن است؟",
                    en: "Is the comparison safe?",
                },
                answer: {
                    fa: "بله. «بررسی» از crypto.subtle.verify مرورگر بهره می‌برد که دو مقدار را در زمانی یکسان می‌سنجد.",
                    en: "Yes. Verify uses crypto.subtle.verify of the browser, which compares the values in constant time.",
                },
            },
        ],
    },
    example: "my-secret-key",
};
