import type { ToolDefinition } from "@handyweb/core";

export const findReplaceMeta: ToolDefinition = {
    id: "find-replace",
    slug: "find-replace",
    aliases: ["find-and-replace", "search-and-replace", "replace-text", "regex-replace"],
    category: "text",
    alsoIn: ["developer"],
    related: ["regex-tester", "text-cleaner"],
    tags: ["text", "find", "replace", "regex"],
    title: { fa: "جستجو و جایگزینی در متن", en: "Find and Replace Text" },
    seoTitle: {
        fa: "جستجو و جایگزینی در متن، ساده یا با Regex",
        en: "Find and Replace Text Online with Regex",
    },
    description: {
        fa: "جستجو و جایگزینی یک کلمه یا عبارت در سراسر متن، به شکل ساده یا با regex. شمار جایگزینی‌ها را هم می‌بینید.",
        en: "Find a word or phrase in a text and replace it everywhere, as plain text or with a regex. You also see how many replacements were made.",
    },
    keywords: {
        fa: ["جستجو و جایگزینی", "جایگزینی متن", "جایگزین کردن کلمه", "replace"],
        en: ["find and replace", "replace text", "search and replace", "regex replace"],
    },
    presets: [
        {
            id: "regex",
            title: { fa: "جایگزینی با Regex", en: "Regex Replace" },
            keywords: { fa: ["جایگزینی با regex"], en: ["regex replace"] },
            options: { mode: "regex" },
        },
    ],
    execution: "worker",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["text"],
    outputKinds: ["text"],
    limits: { maxInputBytes: 5_000_000 },
    limitations: {
        fa: "Regex با موتور جاوااسکریپت مرورگر و همیشه با پرچم u اجرا می‌شود. هر اجرا پس از ۲ ثانیه می‌ایستد.",
        en: "Regex runs with the JavaScript engine of the browser, always with the u flag. Each run stops after 2 seconds.",
    },
    guide: {
        steps: [
            { fa: "نوشته را بچسبانید.", en: "Paste the text." },
            {
                fa: "آنچه را می‌جویید و جایگزین آن را بنویسید.",
                en: "Type what to find and what to put in its place.",
            },
            {
                fa: "گزینه‌ها را برگزینید و خروجی را کپی کنید.",
                en: "Choose the options and copy the output.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "«تنها واژه کامل» با فارسی کار می‌کند؟",
                    en: "Does “Whole words only” work with Persian?",
                },
                answer: {
                    fa: "بله. برای نمونه، «کتاب» در «کتابخانه» جایگزین نمی‌شود، اما در «کتاب.» جایگزین می‌شود.",
                    en: "Yes. For example, “کتاب” is not replaced inside “کتابخانه”, but it is replaced in “کتاب.”.",
                },
            },
            {
                question: {
                    fa: "چگونه بخشی از یافته را در جایگزین نگه دارم؟",
                    en: "How do I keep part of the match in the replacement?",
                },
                answer: {
                    fa: "Regex را برگزینید، بخش را درون پرانتز بگذارید و در جایگزین $1 بنویسید. برای نمونه، (\\d+)-(\\d+) با $2-$1 جای دو شماره را عوض می‌کند.",
                    en: "Choose Regex, put the part in parentheses, and write $1 in the replacement. For example, (\\d+)-(\\d+) with $2-$1 swaps two numbers.",
                },
            },
        ],
    },
    example: "سلام دنیا، سلام دوست",
};
