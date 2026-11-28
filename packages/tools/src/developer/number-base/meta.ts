import type { ToolDefinition } from "@handyweb/core";

export const numberBaseMeta: ToolDefinition = {
    id: "number-base",
    slug: "number-base",
    aliases: [
        "number-base-converter",
        "binary-to-decimal",
        "decimal-to-binary",
        "hex-to-decimal",
        "decimal-to-hex",
    ],
    category: "developer",
    alsoIn: ["calculators"],
    related: ["unix-timestamp", "unicode-escape"],
    tags: ["binary", "hex", "octal", "base"],
    title: {
        fa: "تبدیل مبنای اعداد (دودویی، هگز، دهدهی)",
        en: "Number Base Converter",
    },
    description: {
        fa: "یک عدد را میان دودویی، هشت‌هشتی، دهدهی، هگز و هر پایه از ۲ تا ۳۶ برگردانید. عددهای بسیار بزرگ بی‌کم‌وکاست می‌مانند.",
        en: "Convert a number between binary, octal, decimal, hex, and any base from 2 to 36. Very large numbers stay exact.",
    },
    keywords: {
        fa: ["تبدیل مبنا", "دودویی", "باینری", "هگز", "هگزادسیمال", "مبنای ۲", "مبنای ۱۶"],
        en: [
            "number base converter",
            "binary to decimal",
            "decimal to binary",
            "hex to decimal",
            "decimal to hex",
            "octal",
            "base 36",
        ],
    },
    presets: [
        {
            id: "binary",
            title: { fa: "تبدیل دودویی به دهدهی", en: "Binary to Decimal Converter" },
            keywords: { fa: ["باینری به دهدهی"], en: ["binary to decimal"] },
            options: { from: "2" },
        },
        {
            id: "hex",
            title: { fa: "تبدیل هگز به دهدهی", en: "Hex to Decimal Converter" },
            keywords: { fa: ["هگز به دهدهی"], en: ["hex to decimal"] },
            options: { from: "16" },
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
    limits: { maxInputBytes: 10_000 },
    limitations: {
        fa: "تنها عدد صحیح پذیرفته می‌شود، نه اعشار. عدد منفی با نشانه منفی نوشته می‌شود، نه به شکل مکمل دو.",
        en: "Only whole numbers are accepted, not fractions. A negative number is written with a minus sign, not as two's complement.",
    },
    guide: {
        steps: [
            {
                fa: "عدد را بنویسید. پیشوندهای 0x، 0o و 0b و شماره‌های فارسی پذیرفته می‌شوند.",
                en: "Enter the number. The 0x, 0o, and 0b prefixes and Persian digits are accepted.",
            },
            {
                fa: "اگر پایه ورودی پیشوند ندارد، آن را برگزینید.",
                en: "If the input has no prefix, choose its base.",
            },
            {
                fa: "هر پایه را با دکمه کنار آن کپی کنید.",
                en: "Copy each base with the button next to it.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "تا چه اندازه عدد بزرگ را می‌پذیرد؟",
                    en: "How large can the number be?",
                },
                answer: {
                    fa: "تا ۱۰٬۰۰۰ رقم. ابزار با BigInt کار می‌کند، پس برخلاف ماشین‌حساب‌های معمولی، رقم‌های پایانی عددهای بزرگ گرد نمی‌شوند.",
                    en: "Up to 10,000 digits. The tool uses BigInt, so unlike many calculators, it does not round the last digits of large numbers.",
                },
            },
            {
                question: {
                    fa: "پایه ۳۶ چیست؟",
                    en: "What is base 36?",
                },
                answer: {
                    fa: "پایه‌ای که رقم‌های 0 تا 9 و حروف a تا z را به کار می‌برد. برای شناسه‌های کوتاه، مانند لینک‌های کوتاه‌شده، به کار می‌رود.",
                    en: "A base that uses the digits 0 to 9 and the letters a to z. It is used for short IDs, such as in short links.",
                },
            },
        ],
    },
    example: "255",
};
