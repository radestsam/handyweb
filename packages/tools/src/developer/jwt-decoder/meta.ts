import type { ToolDefinition } from "@handyweb/core";

export const jwtDecoderMeta: ToolDefinition = {
    id: "jwt-decoder",
    slug: "jwt-decoder",
    aliases: ["jwt-parser", "decode-jwt", "jwt-reader"],
    category: "developer",
    alsoIn: ["crypto"],
    related: ["base64", "json-formatter"],
    tags: ["jwt", "token", "decode"],
    title: {
        fa: "رمزگشایی توکن JWT",
        en: "JWT Decoder",
    },
    description: {
        fa: "سربرگ و بدنه یک توکن JWT را بخوانید و زمان‌های exp، nbf و iat را به تاریخ شمسی یا میلادی ببینید. امضا بررسی نمی‌شود و توکن روی دستگاه شما می‌ماند.",
        en: "Read the header and payload of a JWT, and see the exp, nbf, and iat times as dates. The signature is not checked, and the token stays on your device.",
    },
    keywords: {
        fa: ["jwt", "رمزگشایی jwt", "توکن", "خواندن توکن", "بررسی توکن"],
        en: ["jwt decoder", "decode jwt", "jwt parser", "json web token", "jwt payload", "jwt exp"],
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
    limits: { maxInputBytes: 1_000_000 },
    limitations: {
        fa: "امضای توکن بررسی نمی‌شود، پس این ابزار هرگز نمی‌گوید توکنی درست یا معتبر است. بدنه JWE (توکن رمزنگاری‌شده) خوانده نمی‌شود. شماره‌های بسیار بزرگ در بدنه شاید گرد شوند.",
        en: "The signature is not checked, so this tool never says that a token is genuine or valid. The payload of a JWE (an encrypted token) cannot be read. Very large numbers in the payload can be rounded.",
    },
    guide: {
        steps: [
            {
                fa: "توکن را در کادر بچسبانید. پیشوند Bearer و خط‌های تازه کنار گذاشته می‌شوند.",
                en: "Paste the token into the box. A Bearer prefix and line breaks are ignored.",
            },
            {
                fa: "سربرگ، بدنه و زمان‌های توکن را بخوانید.",
                en: "Read the header, the payload, and the times of the token.",
            },
            {
                fa: "برای پذیرفتن یک توکن، امضای آن را در سرور با کلید درست بررسی کنید.",
                en: "To accept a token, check its signature on your server with the correct key.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "چرا ابزار نمی‌گوید توکن معتبر است؟",
                    en: "Why does the tool not say that the token is valid?",
                },
                answer: {
                    fa: "سربرگ و بدنه JWT تنها با Base64url کدگذاری شده‌اند و هر کسی می‌تواند آن‌ها را بنویسد. تنها بررسی امضا با کلید درست نشان می‌دهد توکن را چه کسی ساخته است، و این کار باید در سرور شما انجام شود.",
                    en: "The header and payload of a JWT are only Base64url-encoded, and anyone can write them. Only a signature check with the correct key shows who made the token, and your server must do that check.",
                },
            },
            {
                question: {
                    fa: "چسباندن توکن در اینجا ایمن است؟",
                    en: "Is it safe to paste a token here?",
                },
                answer: {
                    fa: "توکن از مرورگر شما بیرون نمی‌رود و جایی نگه داشته نمی‌شود. با این همه، توکن یک کلید ورود است: آن را با کسی هم‌رسانی نکنید و پس از کار، کادر را پاک کنید.",
                    en: "The token does not leave your browser and is not stored. Still, a token is a key to an account: do not share it, and clear the box when you finish.",
                },
            },
            {
                question: {
                    fa: "exp، nbf و iat چیستند؟",
                    en: "What are exp, nbf, and iat?",
                },
                answer: {
                    fa: "زمان‌هایی به ثانیه از سال ۱۹۷۰. exp زمان پایان اعتبار، nbf زمانی که توکن پیش از آن نباید پذیرفته شود، و iat زمان ساخت توکن است. ابزار آن‌ها را با ساعت دستگاه شما می‌سنجد.",
                    en: "Times in seconds since 1970. exp is when the token expires, nbf is the time before which the token must not be accepted, and iat is when the token was made. The tool compares them with the clock of your device.",
                },
            },
        ],
    },
    example:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Itiz2KfYsdinIiwiaWF0IjoxNzMyNjYwMDAwfQ.c2lnbmF0dXJl",
};
