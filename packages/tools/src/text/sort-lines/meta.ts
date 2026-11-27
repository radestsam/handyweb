import type { ToolDefinition } from "@handyweb/core";

export const sortLinesMeta: ToolDefinition = {
    id: "sort-lines",
    slug: "sort-lines",
    aliases: ["sort-alphabetically", "alphabetical-order", "reverse-lines", "natural-sort"],
    category: "text",
    alsoIn: ["persian"],
    related: ["remove-duplicate-lines", "text-counter"],
    tags: ["text", "lines", "sort"],
    title: {
        fa: "مرتب‌سازی خط‌ها به ترتیب الفبا",
        en: "Sort Lines Alphabetically",
    },
    description: {
        fa: "خط‌های یک فهرست را به ترتیب الفبای فارسی یا انگلیسی، از آغاز به پایان یا وارونه، بچینید. شماره‌ها به شکل عدد سنجیده می‌شوند، پس «۲» پیش از «۱۰» می‌آید.",
        en: "Sort the lines of a list in Persian or English alphabetical order, ascending or descending. Numbers sort by value, so “2” comes before “10”.",
    },
    keywords: {
        fa: [
            "مرتب سازی",
            "مرتب‌سازی الفبایی",
            "ترتیب الفبا",
            "مرتب کردن خطوط",
            "چیدن فهرست",
            "وارونه کردن خطوط",
        ],
        en: [
            "sort lines",
            "alphabetical order",
            "sort alphabetically",
            "natural sort",
            "reverse lines",
            "persian alphabetical order",
        ],
    },
    presets: [
        {
            id: "descending",
            title: { fa: "مرتب‌سازی وارونه (ی تا الف)", en: "Sort Lines in Descending Order" },
            keywords: { fa: ["ترتیب نزولی"], en: ["descending", "z to a"] },
            options: { order: "descending" },
        },
        {
            id: "reverse",
            title: { fa: "وارونه کردن ترتیب خط‌ها", en: "Reverse Line Order" },
            keywords: { fa: ["وارونه کردن خطوط"], en: ["reverse lines", "flip lines"] },
            options: { order: "reverse" },
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
        fa: "ترتیب از جدول چینش فارسی مرورگر شما می‌آید، پس در مرورگرهای کهنه شاید اندکی دگرگون باشد.",
        en: "The order comes from the Persian collation of your browser, so it can differ a little in old browsers.",
    },
    guide: {
        steps: [
            {
                fa: "فهرست را در کادر ورودی بچسبانید. هر مورد در یک خط.",
                en: "Paste your list into the input box, one item per line.",
            },
            {
                fa: "ترتیب و گزینه‌ها را برگزینید.",
                en: "Choose the order and the options.",
            },
            {
                fa: "خروجی را کپی کنید.",
                en: "Copy the output.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "ترتیب الفبای فارسی درست است؟",
                    en: "Is the Persian alphabetical order correct?",
                },
                answer: {
                    fa: "بله. پ، چ، ژ و گ سر جای خود در الفبای فارسی می‌آیند، نه پس از همه حروف عربی. واژه‌های فارسی پیش از واژه‌های لاتین می‌آیند.",
                    en: "Yes. پ, چ, ژ, and گ take their place in the Persian alphabet, not after all the Arabic letters. Persian words come before Latin words.",
                },
            },
            {
                question: {
                    fa: "«ترتیب طبیعی» چیست؟",
                    en: "What is natural sort?",
                },
                answer: {
                    fa: "شماره‌های درون خط به شکل عدد سنجیده می‌شوند، پس «فصل ۲» پیش از «فصل ۱۰» می‌آید. شماره‌های فارسی، عربی و لاتین هر سه پذیرفته می‌شوند. اگر این گزینه خاموش باشد، شماره‌ها رقم به رقم سنجیده می‌شوند.",
                    en: "Numbers in a line are compared by value, so “chapter 2” comes before “chapter 10”. Persian, Arabic-Indic, and Latin digits all work. With the option off, numbers are compared digit by digit.",
                },
            },
            {
                question: {
                    fa: "«وارونه» با «ی تا الف» چه فرقی دارد؟",
                    en: "How is “Reverse” different from “Descending”?",
                },
                answer: {
                    fa: "«ی تا الف» خط‌ها را از پایان الفبا به آغاز می‌چیند. «وارونه» خط‌ها را نمی‌چیند و تنها ترتیب کنونی را از پایین به بالا برمی‌گرداند.",
                    en: "Descending sorts the lines from the end of the alphabet to the start. Reverse does not sort: it turns the current order upside down.",
                },
            },
        ],
    },
    example: "فصل ۱۰\nفصل ۲\nگل\nپدر\napple",
};
