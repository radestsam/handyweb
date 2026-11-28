import type { ToolDefinition } from "@handyweb/core";

export const removeDuplicateLinesMeta: ToolDefinition = {
    id: "remove-duplicate-lines",
    slug: "remove-duplicate-lines",
    aliases: ["remove-duplicates", "unique-lines", "dedupe-lines"],
    category: "text",
    alsoIn: [],
    related: ["sort-lines", "text-counter"],
    tags: ["text", "lines", "duplicates"],
    title: { fa: "حذف خطوط تکراری", en: "Remove Duplicate Lines" },
    seoTitle: {
        fa: "حذف خطوط تکراری و موارد تکراری از فهرست",
        en: "Remove Duplicate Lines from a List Online",
    },
    description: {
        fa: "حذف خطوط تکراری یک فهرست، با نگه داشتن نخستین نمونه هر خط به همان ترتیب. می‌توانید اسپیس آغاز و پایان خط و بزرگی و کوچکی حروف را نادیده بگیرید.",
        en: "Remove repeated lines from a list and keep the first copy of each line in its original order. You can ignore spaces at the start and end of a line, and letter case.",
    },
    keywords: {
        fa: ["حذف تکراری", "حذف خطوط تکراری", "خط تکراری", "یکتا کردن فهرست", "حذف موارد تکراری"],
        en: [
            "remove duplicate lines",
            "remove duplicates",
            "unique lines",
            "dedupe",
            "deduplicate list",
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
    outputKinds: ["text"],
    limits: { maxInputBytes: 5_000_000 },
    limitations: {
        fa: "خط‌ها نویسه به نویسه سنجیده می‌شوند. «علي» با ی عربی و «علی» با ی فارسی دو خط جدا شمرده می‌شوند. برای یکی کردن آن‌ها، نخست نوشته را با ابزار یکسان‌سازی متن فارسی درست کنید.",
        en: "Lines are compared character by character. “علي” with Arabic yeh and “علی” with Persian yeh are different lines. To match them, first fix the text with the Persian text normalizer.",
    },
    guide: {
        steps: [
            {
                fa: "فهرست را در کادر ورودی بچسبانید. هر مورد در یک خط.",
                en: "Paste your list into the input box, one item per line.",
            },
            {
                fa: "گزینه‌های سنجش را برگزینید.",
                en: "Choose how lines are compared.",
            },
            {
                fa: "شمار خط‌های برداشته‌شده را ببینید و خروجی را کپی کنید.",
                en: "Check how many lines were removed, then copy the output.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "کدام نمونه از خط تکراری می‌ماند؟",
                    en: "Which copy of a repeated line stays?",
                },
                answer: {
                    fa: "نخستین نمونه، همان‌گونه که نوشته شده است. ترتیب خط‌ها دگرگون نمی‌شود.",
                    en: "The first copy, exactly as you wrote it. The order of the lines does not change.",
                },
            },
            {
                question: {
                    fa: "با خط‌های خالی چه می‌شود؟",
                    en: "What happens to empty lines?",
                },
                answer: {
                    fa: "خط خالی هم مانند هر خط دیگری است: نخستین خط خالی می‌ماند و بقیه برداشته می‌شوند. با گزینه «پاک کردن همه خط‌های خالی» همه آن‌ها برداشته می‌شوند.",
                    en: "An empty line is like any other line: the first one stays and the others are removed. The “Remove all empty lines” option removes all of them.",
                },
            },
        ],
    },
    example: "سیب\nپرتقال\nسیب\napple\napple",
};
