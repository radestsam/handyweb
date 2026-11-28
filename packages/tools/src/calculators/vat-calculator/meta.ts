import type { ToolDefinition } from "@handyweb/core";

export const vatCalculatorMeta: ToolDefinition = {
    id: "vat-calculator",
    slug: "vat-calculator",
    aliases: ["value-added-tax-calculator", "tax-calculator", "maliat-bar-arzesh-afzoode"],
    category: "calculators",
    alsoIn: [],
    related: ["discount-calculator", "percentage-calculator"],
    tags: ["vat", "tax", "invoice"],
    title: { fa: "محاسبه مالیات بر ارزش افزوده", en: "VAT Calculator" },
    seoTitle: {
        fa: "محاسبه مالیات بر ارزش افزوده فاکتور",
        en: "VAT Calculator: Add or Remove VAT from a Price",
    },
    description: {
        fa: "محاسبه مالیات بر ارزش افزوده با نرخی که می‌نویسید: آن را به مبلغ بیفزایید یا از مبلغ با مالیات جدا کنید؛ مناسب برای فاکتور و پیش‌فاکتور.",
        en: "Add VAT at the rate you enter to an amount, or take it out of an amount that includes VAT; useful for invoices and quotes.",
    },
    keywords: {
        fa: [
            "محاسبه مالیات بر ارزش افزوده",
            "محاسبه ارزش افزوده",
            "مالیات فاکتور",
            "جدا کردن مالیات از مبلغ",
        ],
        en: ["vat calculator", "add vat", "remove vat", "reverse vat", "value added tax"],
    },
    presets: [
        {
            id: "remove",
            title: { fa: "جدا کردن مالیات بر ارزش افزوده از مبلغ", en: "Reverse VAT Calculator" },
            keywords: {
                fa: ["جدا کردن ارزش افزوده"],
                en: ["reverse vat", "remove vat from price"],
            },
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
    limits: { maxInputBytes: 100 },
    limitations: {
        fa: "نرخ را خودتان می‌نویسید؛ ابزار نرخ رسمی را نمی‌داند و قانون مالیاتی را بررسی نمی‌کند. نتیجه‌ها به ریال گرد نمی‌شوند.",
        en: "You enter the rate; the tool does not know the official rate and does not check tax law. Results are not rounded to a currency unit.",
    },
    guide: {
        steps: [
            {
                fa: "بگویید مبلغ با مالیات است یا بدون آن.",
                en: "Say whether the amount includes VAT or not.",
            },
            { fa: "مبلغ و نرخ را بنویسید.", en: "Enter the amount and the rate." },
            {
                fa: "مبلغ بدون مالیات، مالیات و مبلغ با مالیات را ببینید.",
                en: "Read the amount without VAT, the VAT, and the amount with VAT.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "چگونه مالیات را از مبلغ با مالیات جدا کنم؟",
                    en: "How do I take VAT out of a price?",
                },
                answer: {
                    fa: "مبلغ را بر (۱ + نرخ ÷ ۱۰۰) بخش کنید. با نرخ ۱۰٪، مبلغ ۱٬۱۰۰٬۰۰۰ برابر ۱٬۰۰۰٬۰۰۰ بدون مالیات و ۱۰۰٬۰۰۰ مالیات است.",
                    en: "Divide the price by (1 + rate ÷ 100). At 10%, 1,100,000 is 1,000,000 without VAT and 100,000 of VAT.",
                },
            },
        ],
    },
    example: "1000000",
};
