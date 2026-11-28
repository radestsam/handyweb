import type { ToolDefinition } from "@handyweb/core";

export const imageResolutionMeta: ToolDefinition = {
    id: "image-resolution",
    slug: "image-resolution",
    aliases: ["dpi-calculator", "print-size-calculator", "pixels-to-cm", "ppi-calculator"],
    category: "calculators",
    alsoIn: ["image"],
    related: ["aspect-ratio", "image-resize"],
    tags: ["dpi", "print", "pixels", "resolution"],
    title: { fa: "محاسبه رزولوشن و اندازه چاپ", en: "Print Size and DPI Calculator" },
    seoTitle: {
        fa: "محاسبه رزولوشن و اندازه چاپ عکس (DPI)",
        en: "Print Size and DPI Calculator for Photos",
    },
    description: {
        fa: "تبدیل پیکسل به سانتی‌متر و محاسبه DPI: اندازه چاپ عکس را از پیکسل و DPI حساب کنید، یا ببینید برای چاپ A4، A5 یا عکس ۱۰×۱۵ با ۳۰۰ DPI چند پیکسل لازم است.",
        en: "Work out the print size of a photo from its pixels and DPI, or see how many pixels you need to print A4, A5, or a 10×15 photo at 300 DPI.",
    },
    keywords: {
        fa: [
            "تبدیل پیکسل به سانتی متر",
            "محاسبه dpi",
            "اندازه چاپ عکس",
            "رزولوشن چاپ",
            "ابعاد a4 به پیکسل",
        ],
        en: [
            "dpi calculator",
            "pixels to cm",
            "print size calculator",
            "a4 in pixels",
            "image resolution calculator",
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
        fa: "اندازه چاپ تنها از پیکسل و DPI حساب می‌شود؛ حاشیه چاپگر و برش در حساب نیست.",
        en: "The print size comes only from the pixels and the DPI; printer margins and trimming are not counted.",
    },
    guide: {
        steps: [
            {
                fa: "پهنا و بلندای عکس به پیکسل و DPI را بنویسید.",
                en: "Enter the photo width and height in pixels, and the DPI.",
            },
            { fa: "اندازه چاپ را ببینید.", en: "Read the print size." },
            {
                fa: "یا یک کاغذ و DPI را برگزینید تا پیکسل لازم را ببینید.",
                en: "Or choose a paper and a DPI to see the pixels you need.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "A4 با ۳۰۰ DPI چند پیکسل است؟",
                    en: "How many pixels is A4 at 300 DPI?",
                },
                answer: {
                    fa: "۲۴۸۰ در ۳۵۰۸ پیکسل، یعنی نزدیک ۸٫۷ مگاپیکسل.",
                    en: "2480 by 3508 pixels, about 8.7 megapixels.",
                },
            },
        ],
    },
    example: "6000",
};
