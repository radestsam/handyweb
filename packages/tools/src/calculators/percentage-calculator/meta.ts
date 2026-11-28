import type { ToolDefinition } from "@handyweb/core";

export const percentageCalculatorMeta: ToolDefinition = {
    id: "percentage-calculator",
    slug: "percentage-calculator",
    aliases: ["percent-calculator", "percentage-change", "percent-of-number"],
    category: "calculators",
    alsoIn: [],
    related: ["discount-calculator", "unit-converter"],
    tags: ["percent", "calculator"],
    title: { fa: "محاسبه درصد", en: "Percentage Calculator" },
    description: {
        fa: "درصد یک عدد، درصدِ یک عدد از عدد دیگر، درصد افزایش یا کاهش، و افزودن یا کم کردن درصد را با اعداد فارسی یا انگلیسی حساب کنید.",
        en: "Work out a percent of a number, one number as a percent of another, a percent increase or decrease, and adding or taking away a percent.",
    },
    keywords: {
        fa: ["محاسبه درصد", "درصد گیری", "درصد افزایش", "درصد تغییر", "چند درصد"],
        en: [
            "percentage calculator",
            "percent of a number",
            "percent change",
            "percentage increase",
            "what percent",
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
    limits: { maxInputBytes: 100 },
    limitations: {
        fa: "نتیجه‌ها تا ۱۰ رقم معنادار گرد می‌شوند. درصد تغییر نسبت به اندازه مقدار پیشین حساب می‌شود.",
        en: "Results are rounded to 10 significant digits. Percent change is measured against the size of the old value.",
    },
    guide: {
        steps: [
            { fa: "کارت پرسش خود را پیدا کنید.", en: "Find the card for your question." },
            {
                fa: "دو عدد را بنویسید؛ اعداد فارسی هم پذیرفته می‌شوند.",
                en: "Enter the two numbers; Persian digits work too.",
            },
            { fa: "پاسخ را ببینید و کپی کنید.", en: "Read and copy the answer." },
        ],
        faq: [
            {
                question: {
                    fa: "درصد تغییر چگونه حساب می‌شود؟",
                    en: "How is percent change worked out?",
                },
                answer: {
                    fa: "(مقدار تازه − مقدار پیشین) ÷ مقدار پیشین × ۱۰۰. از ۸۰ به ۱۰۰، ۲۵٪ افزایش است، اما از ۱۰۰ به ۸۰، ۲۰٪ کاهش.",
                    en: "(new − old) ÷ old × 100. From 80 to 100 is a 25% increase, but from 100 to 80 is a 20% decrease.",
                },
            },
        ],
    },
    example: "20",
};
