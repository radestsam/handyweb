import type { ToolDefinition } from "@handyweb/core";

export const persianNormalizerMeta: ToolDefinition = {
    id: "persian-normalizer",
    slug: "persian-normalizer",
    aliases: [
        "persian-digit-converter",
        "arabic-indic-digit-converter",
        "persian-text-normalizer",
        "fix-arabic-yeh-kaf",
    ],
    category: "persian",
    alsoIn: ["text"],
    related: ["jalali-converter"],
    tags: ["persian", "normalize", "digits"],
    title: {
        fa: "یکسان‌سازی متن فارسی و تبدیل اعداد",
        en: "Persian Text Normalizer and Digit Converter",
    },
    description: {
        fa: "ی و ک عربی را فارسی کنید، کشیده و نیم‌فاصله‌های زیادی را بردارید و شماره‌ها را فارسی یا لاتین کنید. هر ویرایش را پیش از کپی می‌بینید.",
        en: "Change Arabic yeh and kaf to Persian, remove tatweel and extra ZWNJ, and convert digits to Persian or Latin. You see every change before you copy.",
    },
    keywords: {
        fa: [
            "یکسان‌سازی",
            "ی عربی",
            "ک عربی",
            "اعداد فارسی",
            "تبدیل عدد",
            "نیم‌فاصله",
            "کشیده",
            "اصلاح متن فارسی",
        ],
        en: [
            "persian",
            "farsi",
            "normalize",
            "arabic yeh",
            "arabic kaf",
            "persian digits",
            "zwnj",
            "tatweel",
        ],
    },
    presets: [
        {
            id: "digits-to-persian",
            title: { fa: "تبدیل اعداد به فارسی", en: "Convert Digits to Persian" },
            keywords: { fa: ["اعداد فارسی"], en: ["persian digits"] },
            options: { digits: "to-persian" },
        },
        {
            id: "digits-to-latin",
            title: { fa: "تبدیل اعداد به لاتین", en: "Convert Digits to Latin" },
            keywords: { fa: ["اعداد انگلیسی"], en: ["latin digits", "english digits"] },
            options: { digits: "to-latin" },
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
    limits: { maxInputBytes: 5_000_000 },
    limitations: {
        fa: "برگرداندن ة به ه واژه‌های عربی را دگرگون می‌کند، پس در آغاز خاموش است. فارسی کردن همه شماره‌ها، شماره‌های درون کد و نشانی‌ها را هم دگرگون می‌کند.",
        en: "Changing ة to ه alters Arabic words, so it is off by default. Converting all digits to Persian also changes digits inside code and URLs.",
    },
    guide: {
        steps: [
            {
                fa: "نوشته فارسی را در کادر ورودی بچسبانید.",
                en: "Paste your Persian text into the input box.",
            },
            {
                fa: "گزینه‌هایی را که می‌خواهید روشن یا خاموش کنید و روش برگرداندن شماره‌ها را برگزینید.",
                en: "Turn the rules you want on or off, and choose how to convert digits.",
            },
            {
                fa: "ویرایش‌ها را در بخش پایین ببینید و اگر درست بودند، خروجی را کپی کنید.",
                en: "Review each change in the section below, then copy the output.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "چرا ی و ک عربی دردسر می‌سازند؟",
                    en: "Why do Arabic yeh and kaf cause problems?",
                },
                answer: {
                    fa: "ی و ک عربی در چشم شبیه نمونه فارسی‌اند، اما نویسه‌های دیگری هستند. برای همین جستجو، چیدن الفبایی و شمردن واژه‌ها با آن‌ها درست کار نمی‌کند.",
                    en: "They look like the Persian letters but are different characters, so search, sorting, and word counts fail on them.",
                },
            },
            {
                question: {
                    fa: "نیم‌فاصله‌های درست پاک می‌شوند؟",
                    en: "Are correct ZWNJ characters removed?",
                },
                answer: {
                    fa: "نه. تنها نیم‌فاصله‌های تکراری یا آن‌هایی که کنار اسپیس آمده‌اند و کاری نمی‌کنند برداشته می‌شوند.",
                    en: "No. Only repeated ZWNJ characters, or ones next to a space where they do nothing, are removed.",
                },
            },
        ],
    },
    example: "كتابـــهاي ١٢ ساله",
};
