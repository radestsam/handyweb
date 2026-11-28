import type { ToolDefinition } from "@handyweb/core";

export const directionFixerMeta: ToolDefinition = {
    id: "direction-fixer",
    slug: "direction-fixer",
    aliases: ["persian-text-direction-fixer", "rtl-fixer", "bidi-fixer", "rlm-lrm"],
    category: "persian",
    alsoIn: ["text"],
    related: ["text-cleaner", "unicode-explorer"],
    tags: ["persian", "rtl", "bidi", "direction"],
    title: {
        fa: "درست کردن جهت متن فارسی و انگلیسی درهم",
        en: "Persian Text Direction Fixer",
    },
    description: {
        fa: "وقتی «C++» یا «Windows 11!» در نوشته فارسی به هم می‌ریزد، با افزودن نشانه LRM یا جداسازی، آن را درست نشان دهید. نشانه‌های جهت را می‌توانید پاک هم کنید.",
        en: "When «C++» or «Windows 11!» looks scrambled inside Persian text, add an LRM mark or an isolate to show it correctly. You can also remove direction marks.",
    },
    keywords: {
        fa: ["جهت متن", "به هم ریختگی متن", "rtl", "متن انگلیسی در فارسی", "lrm"],
        en: ["rtl fix", "bidi", "mixed direction text", "lrm", "rlm", "persian english text"],
    },
    presets: [
        {
            id: "remove",
            title: { fa: "پاک کردن نشانه‌های جهت", en: "Remove Direction Marks" },
            keywords: { fa: ["پاک کردن rlm"], en: ["remove rlm", "remove lrm"] },
            options: { mode: "remove" },
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
        fa: "نشانه‌ها نادیدنی‌اند و نوشته را دگرگون نمی‌کنند، اما برخی برنامه‌ها آن‌ها را درست نشان نمی‌دهند. جداسازی (LRI…PDI) درست‌تر است، اما برنامه‌های کهنه آن را نمی‌شناسند.",
        en: "The marks are invisible and do not change the text, but some apps do not show them correctly. Isolates (LRI…PDI) are more correct, but old apps do not know them.",
    },
    guide: {
        steps: [
            { fa: "نوشته را بچسبانید.", en: "Paste the text." },
            {
                fa: "LRM (افزودن نشانه)، جداسازی (LRI…PDI) یا پاک کردن را برگزینید.",
                en: "Choose LRM (add a mark), Isolate (LRI…PDI), or Remove.",
            },
            {
                fa: "پیش‌نمایش را بسنجید و خروجی را کپی کنید.",
                en: "Compare the previews and copy the output.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "چرا C++ در نوشته فارسی ++C دیده می‌شود؟",
                    en: "Why does C++ show as ++C in Persian text?",
                },
                answer: {
                    fa: "نشانه‌هایی مانند + و ! جهت ندارند و جهت بند فارسی، یعنی راست‌به‌چپ، را می‌گیرند. نشانه LRM پس از بخش انگلیسی به مرورگر می‌گوید آن نشانه‌ها بخشی از نوشته چپ‌به‌راست‌اند.",
                    en: "Marks such as + and ! have no direction of their own, so they take the right-to-left direction of the Persian paragraph. An LRM after the English part tells the browser that those marks belong to the left-to-right text.",
                },
            },
        ],
    },
    example: "من C++ و C# بلدم",
};
