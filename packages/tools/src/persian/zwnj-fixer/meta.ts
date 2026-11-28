import type { ToolDefinition } from "@handyweb/core";

export const zwnjFixerMeta: ToolDefinition = {
    id: "zwnj-fixer",
    slug: "zwnj-fixer",
    aliases: ["persian-half-space-fixer", "half-space-fixer", "nim-fasele"],
    category: "persian",
    alsoIn: ["text"],
    related: ["persian-normalizer", "text-cleaner"],
    tags: ["persian", "zwnj", "half-space"],
    title: { fa: "درست کردن نیم‌فاصله در متن فارسی", en: "Persian Half-Space (ZWNJ) Fixer" },
    seoTitle: {
        fa: "درست کردن نیم‌فاصله در متن فارسی آنلاین",
        en: "Persian Half-Space (ZWNJ) Fixer Online",
    },
    description: {
        fa: "اسپیس‌های نادرست را در «می روم»، «کتاب ها»، «بزرگ تر» و «خانه ای» به نیم‌فاصله برگردانید. هر قاعده جداست و هر ویرایش را می‌بینید.",
        en: "Change the wrong spaces in «می روم», «کتاب ها», «بزرگ تر», and «خانه ای» into a ZWNJ (half-space). Each rule is separate, and you see each change.",
    },
    keywords: {
        fa: ["نیم فاصله", "نیم‌فاصله", "اصلاح نیم فاصله", "فاصله مجازی", "zwnj"],
        en: ["zwnj", "half space", "persian half space", "zero width non-joiner", "nim fasele"],
    },
    presets: [],
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
        fa: "قاعده‌ها تنها اسپیس میان دو واژه را به نیم‌فاصله برمی‌گردانند. واژه‌های چسبیده مانند «میروم» یا «کتابها» دست نمی‌خورند، چون جدا کردن آن‌ها با واژه‌هایی مانند «میز» و «تنها» اشتباه می‌شود. پیش از کپی، ویرایش‌ها را ببینید.",
        en: "The rules only change a space between two words. Joined words such as «میروم» or «کتابها» do not change, because splitting them would be confused with words such as «میز» and «تنها». Review the changes before you copy.",
    },
    guide: {
        steps: [
            { fa: "نوشته فارسی را بچسبانید.", en: "Paste the Persian text." },
            {
                fa: "قاعده‌هایی را که نمی‌خواهید خاموش کنید.",
                en: "Turn off any rule you do not want.",
            },
            {
                fa: "ویرایش‌ها را ببینید و خروجی را کپی کنید.",
                en: "Review the changes and copy the output.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "نیم‌فاصله چیست؟",
                    en: "What is a half-space?",
                },
                answer: {
                    fa: "نویسه‌ای نادیدنی (ZWNJ، U+200C) که دو بخش یک واژه را بی‌آنکه به هم بچسبند، کنار هم نگه می‌دارد، مانند «می‌روم». با اسپیس، واژه دو تکه می‌شود و شمارش واژه و جستجو درست کار نمی‌کند.",
                    en: "An invisible character (ZWNJ, U+200C) that keeps two parts of a word together without joining their letters, as in «می‌روم». With a space, the word splits in two, and word counts and search do not work correctly.",
                },
            },
        ],
    },
    example: "بچه ها به خانه ای بزرگ تر می روند",
};
