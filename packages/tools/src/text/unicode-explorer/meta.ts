import type { ToolDefinition } from "@handyweb/core";

export const unicodeExplorerMeta: ToolDefinition = {
    id: "unicode-explorer",
    slug: "unicode-explorer",
    aliases: ["unicode-inspector", "character-inspector", "invisible-character-detector"],
    category: "text",
    alsoIn: ["persian", "developer"],
    related: ["unicode-escape", "text-cleaner", "persian-normalizer"],
    tags: ["unicode", "characters", "inspect"],
    title: { fa: "بررسی کاراکترهای یونیکد", en: "Unicode Character Inspector" },
    seoTitle: {
        fa: "بررسی کاراکترهای یونیکد و نویسه‌های نامرئی",
        en: "Unicode Character Inspector and Lookup",
    },
    description: {
        fa: "هر نویسه نوشته را با کد یونیکد، نام، گونه، خط و بایت‌های UTF-8 ببینید. ی عربی، نیم‌فاصله و نویسه‌های نادیدنی را پیدا کنید.",
        en: "See each character of a text with its code point, name, category, script, and UTF-8 bytes. Find Arabic yeh, ZWNJ, and invisible characters.",
    },
    keywords: {
        fa: [
            "یونیکد",
            "کد یونیکد",
            "نویسه نامرئی",
            "کاراکتر مخفی",
            "پیدا کردن ی عربی",
            "نیم‌فاصله",
            "بررسی کاراکتر",
        ],
        en: [
            "unicode",
            "code point",
            "unicode lookup",
            "character inspector",
            "invisible characters",
            "zero width",
            "utf-8 bytes",
        ],
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
        fa: "نام‌ها برای الفبای لاتین، همه بلوک‌های عربی و فارسی، نشانه‌های نگارشی و جهت، و ایموجی‌های رایج آمده‌اند (یونیکد ۱۵). نویسه‌های دیگر کد، گونه و خط دارند، اما نام ندارند.",
        en: "Names cover Latin, all Arabic and Persian blocks, punctuation and direction marks, and common emoji (Unicode 15). Other characters show their code point, category, and script, but no name.",
    },
    guide: {
        steps: [
            {
                fa: "نوشته را در کادر بنویسید یا بچسبانید.",
                en: "Type or paste your text into the box.",
            },
            {
                fa: "هر نویسه را در جدول ببینید. ردیف‌های رنگی نویسه‌های نادیدنی‌اند.",
                en: "Check each character in the table. Highlighted rows are invisible characters.",
            },
            {
                fa: "برای بردن جدول به یک صفحه‌گسترده، دکمه کپی را بزنید.",
                en: "Use the copy button to paste the table into a spreadsheet.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "چگونه ی و ک عربی را پیدا کنم؟",
                    en: "How do I find Arabic yeh and kaf?",
                },
                answer: {
                    fa: "ی فارسی «ARABIC LETTER FARSI YEH» (U+06CC) است و ی عربی «ARABIC LETTER YEH» (U+064A). ک فارسی «ARABIC LETTER KEHEH» (U+06A9) است و ک عربی «ARABIC LETTER KAF» (U+0643). برای درست کردن آن‌ها، ابزار یکسان‌سازی متن فارسی را به کار ببرید.",
                    en: "Persian yeh is “ARABIC LETTER FARSI YEH” (U+06CC), and Arabic yeh is “ARABIC LETTER YEH” (U+064A). Persian kaf is “ARABIC LETTER KEHEH” (U+06A9), and Arabic kaf is “ARABIC LETTER KAF” (U+0643). To fix them, use the Persian text normalizer.",
                },
            },
            {
                question: {
                    fa: "«کد پوینت» و «نویسه دیدنی» چه فرقی دارند؟",
                    en: "What is the difference between code points and visible characters?",
                },
                answer: {
                    fa: "یک نویسه دیدنی شاید از چند کد پوینت ساخته شود: حرفی با زیر و زبر، یا ایموجی خانواده که از چند ایموجی و ZWJ ساخته شده است. جدول هر کد پوینت را جدا نشان می‌دهد.",
                    en: "One visible character can be made of several code points: a letter with a diacritic, or a family emoji made of several emoji joined with ZWJ. The table shows each code point on its own row.",
                },
            },
        ],
    },
    example: "علي می‌رود 😀",
};
