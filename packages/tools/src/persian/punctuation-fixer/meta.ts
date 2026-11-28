import type { ToolDefinition } from "@handyweb/core";

export const punctuationFixerMeta: ToolDefinition = {
    id: "punctuation-fixer",
    slug: "punctuation-fixer",
    aliases: ["persian-punctuation-fixer", "persian-comma", "persian-quotes"],
    category: "persian",
    alsoIn: ["text"],
    related: ["zwnj-fixer", "persian-normalizer"],
    tags: ["persian", "punctuation"],
    title: { fa: "درست کردن نشانه‌گذاری متن فارسی", en: "Persian Punctuation Fixer" },
    seoTitle: {
        fa: "درست کردن نشانه‌گذاری متن فارسی (، ؟ «»)",
        en: "Persian Punctuation Fixer for Commas and Quotes",
    },
    description: {
        fa: 'درست کردن نشانه گذاری فارسی: کامای لاتین را به «،»، علامت سؤال را به «؟» و گیومه "…" را به «…» برگردانید و اسپیس پیرامون نشانه‌ها را درست کنید.',
        en: 'Change Latin commas to «،», question marks to «؟», and "…" quotes to «…», and fix the spaces around marks. English text and numbers stay as they are.',
    },
    keywords: {
        fa: ["نشانه گذاری", "ویرگول فارسی", "علامت سوال فارسی", "گیومه فارسی", "ویراستاری"],
        en: ["persian punctuation", "persian comma", "persian question mark", "guillemets"],
    },
    presets: [],
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
        fa: "قاعده‌ها تنها نشانه‌هایی را دگرگون می‌کنند که کنار حروف فارسی آمده‌اند. نوشته‌ای که فارسی و انگلیسی درهم دارد را پیش از کپی بازبینی کنید.",
        en: "The rules change only marks next to Persian letters. Review text that mixes Persian and English before you copy it.",
    },
    guide: {
        steps: [
            { fa: "نوشته فارسی را بچسبانید.", en: "Paste the Persian text." },
            { fa: "قاعده‌ها را برگزینید.", en: "Choose the rules." },
            {
                fa: "ویرایش‌ها را ببینید و خروجی را کپی کنید.",
                en: "Review the changes and copy the output.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "چرا «،» و نه «,»؟",
                    en: "Why «،» and not «,»?",
                },
                answer: {
                    fa: "ویرگول، نقطه‌ویرگول و علامت سؤال فارسی وارونه‌اند و در نوشته راست‌به‌چپ درست دیده می‌شوند. نشانه‌های لاتین در نوشته فارسی ناجور و گاهی در جای نادرست دیده می‌شوند.",
                    en: "The Persian comma, semicolon, and question mark are turned the other way and look right in right-to-left text. Latin marks look odd in Persian text and sometimes show in the wrong place.",
                },
            },
        ],
    },
    example: 'او پرسید : "کجا می‌روی ?"',
};
