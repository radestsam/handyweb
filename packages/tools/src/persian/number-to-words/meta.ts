import type { ToolDefinition } from "@handyweb/core";

export const numberToWordsMeta: ToolDefinition = {
    id: "number-to-words",
    slug: "number-to-words",
    aliases: ["persian-number-to-words", "number-to-persian-words", "amount-in-words"],
    category: "persian",
    alsoIn: ["calculators"],
    related: ["persian-normalizer", "number-base"],
    tags: ["persian", "number", "words"],
    title: {
        fa: "تبدیل عدد به حروف فارسی",
        en: "Number to Persian Words",
    },
    description: {
        fa: "عدد را به حروف فارسی بنویسید، برای چک، فاکتور و قرارداد: با اعشار، عدد ترتیبی و یکای ریال یا تومان. عددهای بسیار بزرگ هم بی‌کم‌وکاست خوانده می‌شوند.",
        en: "Write a number in Persian words for cheques, invoices, and contracts, with decimals, ordinals, and Rial or Toman. Very large numbers stay exact.",
    },
    keywords: {
        fa: [
            "عدد به حروف",
            "تبدیل عدد به حروف",
            "نوشتن عدد به حروف",
            "مبلغ به حروف",
            "عدد به حروف چک",
        ],
        en: ["number to words", "persian number to words", "amount in words", "number to persian"],
    },
    presets: [
        {
            id: "toman",
            title: { fa: "مبلغ به حروف (تومان)", en: "Amount in Words (Toman)" },
            keywords: { fa: ["مبلغ به حروف", "تومان به حروف"], en: ["toman in words"] },
            options: { unit: "toman" },
        },
        {
            id: "rial",
            title: { fa: "مبلغ به حروف (ریال)", en: "Amount in Words (Rial)" },
            keywords: { fa: ["ریال به حروف", "عدد به حروف چک"], en: ["rial in words"] },
            options: { unit: "rial" },
        },
    ],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: true,
    inputKinds: ["text"],
    outputKinds: ["text"],
    limits: { maxInputBytes: 200 },
    limitations: {
        fa: "بخش درست تا ۲۷ رقم و بخش اعشار تا ۶ رقم. ۱۰۰۰ به شکل «هزار» نوشته می‌شود، نه «یک هزار». پیش از نوشتن روی چک، خروجی را بازبینی کنید.",
        en: "Up to 27 digits in the whole part and 6 decimal places. 1000 is written «هزار», not «یک هزار». Check the result before you write it on a cheque.",
    },
    guide: {
        steps: [
            { fa: "عدد را بنویسید.", en: "Type the number." },
            {
                fa: "اگر مبلغ است، ریال یا تومان را برگزینید.",
                en: "If it is an amount, choose Rial or Toman.",
            },
            { fa: "نوشته را کپی کنید.", en: "Copy the words." },
        ],
        faq: [
            {
                question: {
                    fa: "اعشار چگونه خوانده می‌شود؟",
                    en: "How are decimals written?",
                },
                answer: {
                    fa: "با «و» و نام بخش، مانند ۳٫۲۵: «سه و بیست و پنج صدم». صفرهای پایانی اعشار کنار گذاشته می‌شوند.",
                    en: "With «و» and the name of the fraction, such as 3.25: «سه و بیست و پنج صدم». Trailing zeros after the point are dropped.",
                },
            },
            {
                question: {
                    fa: "میلیارد یا بیلیون؟",
                    en: "Milliard or billion?",
                },
                answer: {
                    fa: "این ابزار نام‌های رایج در ایران را به کار می‌برد: هزار، میلیون، میلیارد (۱۰ به توان ۹)، تریلیون (۱۰ به توان ۱۲) و پس از آن.",
                    en: "The tool uses the names common in Iran: هزار, میلیون, میلیارد (10 to the 9th), تریلیون (10 to the 12th), and so on.",
                },
            },
        ],
    },
    example: "1250000",
};
