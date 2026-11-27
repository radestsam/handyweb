import type { ToolDefinition } from "@handyweb/core";

export const textCleanerMeta: ToolDefinition = {
    id: "text-cleaner",
    slug: "text-cleaner",
    aliases: [
        "persian-text-cleaner",
        "remove-extra-spaces",
        "remove-invisible-characters",
        "whitespace-remover",
    ],
    category: "text",
    alsoIn: ["persian"],
    related: ["persian-normalizer", "remove-duplicate-lines"],
    tags: ["text", "clean", "whitespace", "invisible"],
    title: {
        fa: "پاک‌سازی متن و حذف فاصله‌های اضافه",
        en: "Text Cleaner",
    },
    description: {
        fa: "اسپیس‌های زیادی، خط‌های خالی و نویسه‌های نامرئی متن کپی‌شده را پاک کنید. نیم‌فاصله‌های فارسی دست‌نخورده می‌مانند.",
        en: "Remove extra spaces, empty lines, and invisible characters from copied text. Persian ZWNJ characters always stay.",
    },
    keywords: {
        fa: [
            "حذف فاصله اضافه",
            "پاک کردن متن",
            "حذف خطوط خالی",
            "نویسه نامرئی",
            "کاراکتر مخفی",
            "پاک‌سازی متن فارسی",
        ],
        en: [
            "remove extra spaces",
            "text cleaner",
            "remove empty lines",
            "invisible characters",
            "zero width space",
            "non-breaking space",
            "remove whitespace",
        ],
    },
    presets: [
        {
            id: "persian",
            title: { fa: "پاک‌سازی متن فارسی", en: "Persian Text Cleaner" },
            keywords: {
                fa: ["پاک‌سازی متن فارسی", "حذف RLM"],
                en: ["persian text cleaner", "remove rlm"],
            },
            options: { preset: "persian" },
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
        fa: "برداشتن تب‌ها و اسپیس‌های آغاز خط، تورفتگی کد و شعر را هم پاک می‌کند. برای کد، این دو گزینه را خاموش کنید. ی و ک عربی و شماره‌ها را ابزار یکسان‌سازی متن فارسی درست می‌کند.",
        en: "Removing tabs and leading spaces also removes the indentation of code and poetry. Turn those two rules off for code. To fix Arabic yeh, kaf, and digits, use the Persian text normalizer.",
    },
    guide: {
        steps: [
            {
                fa: "نوشته را در کادر ورودی بچسبانید.",
                en: "Paste your text into the input box.",
            },
            {
                fa: "گزینه‌هایی را که می‌خواهید روشن یا خاموش کنید.",
                en: "Turn the rules you want on or off.",
            },
            {
                fa: "شمار ویرایش‌های هر گزینه را ببینید و خروجی را کپی کنید.",
                en: "Check the number of changes for each rule, then copy the output.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "نیم‌فاصله‌ها پاک می‌شوند؟",
                    en: "Are ZWNJ characters removed?",
                },
                answer: {
                    fa: "نه. نیم‌فاصله (ZWNJ) و ZWJ هیچ‌گاه پاک نمی‌شوند، چون واژه‌های فارسی و ایموجی‌ها به آن‌ها نیاز دارند. برای درست کردن نیم‌فاصله‌های نادرست، ابزار یکسان‌سازی متن فارسی را به کار ببرید.",
                    en: "No. ZWNJ and ZWJ are never removed, because Persian words and emoji need them. To fix wrong ZWNJ characters, use the Persian text normalizer.",
                },
            },
            {
                question: {
                    fa: "نویسه‌های نامرئی از کجا می‌آیند؟",
                    en: "Where do invisible characters come from?",
                },
                answer: {
                    fa: "از کپی کردن از وب‌سایت‌ها، Word و PDF. اسپیس بی‌شکست (NBSP)، اسپیس بی‌پهنا (ZWSP)، BOM و نشانه‌های جهت (RLM و LRM) دیده نمی‌شوند، اما جستجو، شمارش و کد را خراب می‌کنند.",
                    en: "From text copied from websites, Word, and PDF files. No-break spaces (NBSP), zero-width spaces (ZWSP), the BOM, and direction marks (RLM, LRM) are not visible, but they break search, counts, and code.",
                },
            },
            {
                question: {
                    fa: "پیش‌تنظیم فارسی چه می‌کند؟",
                    en: "What does the Persian preset do?",
                },
                answer: {
                    fa: "همان گزینه‌های پیش‌فرض را دارد و نشانه‌های جهت (RLM، LRM و ALM) را هم پاک می‌کند. Word و برخی وب‌سایت‌ها این نشانه‌ها را به نوشته فارسی می‌افزایند.",
                    en: "It uses the default rules, and it also removes the direction marks (RLM, LRM, and ALM) that Word and some websites add to Persian text.",
                },
            },
        ],
    },
    example: "  این   متن   فاصله‌های   زیادی   دارد.  \n\n\n\nخط دوم  ",
};
