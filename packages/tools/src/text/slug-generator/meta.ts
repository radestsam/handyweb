import type { ToolDefinition } from "@handyweb/core";

export const slugGeneratorMeta: ToolDefinition = {
    id: "slug-generator",
    slug: "slug-generator",
    aliases: ["slugify", "url-slug", "persian-slug", "permalink-generator"],
    category: "text",
    alsoIn: ["developer", "persian"],
    related: ["url-encoding", "case-converter"],
    tags: ["slug", "url", "seo"],
    title: { fa: "ساخت Slug برای آدرس صفحه", en: "Slug Generator" },
    seoTitle: {
        fa: "ساخت Slug برای آدرس صفحه با حروف فارسی",
        en: "Slug Generator for SEO-Friendly URLs",
    },
    description: {
        fa: "از عنوان یک نوشته، slug تمیز برای نشانی صفحه بسازید: با حروف لاتین یا با حروف فارسی، با خط تیره یا زیرخط.",
        en: "Make a clean URL slug from a title: in Latin letters or with Persian letters, with hyphens or underscores.",
    },
    keywords: {
        fa: ["اسلاگ", "slug فارسی", "نشانی صفحه", "پیوند یکتا", "url فارسی"],
        en: ["slug generator", "slugify", "url slug", "permalink", "seo url"],
    },
    presets: [
        {
            id: "persian",
            title: { fa: "ساخت Slug فارسی", en: "Persian Slug Generator" },
            keywords: { fa: ["slug فارسی"], en: ["persian slug"] },
            options: { script: "persian" },
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
    limits: { maxInputBytes: 1_000_000 },
    limitations: {
        fa: "برگرداندن فارسی به لاتین حرف به حرف است و چون زیر و زبر نوشته نمی‌شود، تقریبی است: «کتاب» می‌شود ktab. برای slug خواناتر، آن را با دست ویرایش کنید.",
        en: "Persian to Latin is letter by letter and approximate, because short vowels are not written: «کتاب» becomes ktab. Edit it by hand for a more readable slug.",
    },
    guide: {
        steps: [
            {
                fa: "عنوان را بنویسید. هر خط یک slug می‌شود.",
                en: "Type the title. Each line becomes a slug.",
            },
            {
                fa: "حروف لاتین یا فارسی و جداکننده را برگزینید.",
                en: "Choose Latin or Persian letters and the separator.",
            },
            { fa: "slug را کپی کنید.", en: "Copy the slug." },
        ],
        faq: [
            {
                question: {
                    fa: "slug فارسی بهتر است یا لاتین؟",
                    en: "Is a Persian or a Latin slug better?",
                },
                answer: {
                    fa: "slug فارسی برای خواننده فارسی‌زبان خواناتر است و گوگل آن را می‌فهمد، اما هنگام کپی به شکل %D8… درمی‌آید. slug لاتین کوتاه‌تر و در همه جا یکسان است.",
                    en: "A Persian slug is easier for Persian readers, and Google understands it, but it turns into %D8… when copied. A Latin slug is shorter and the same everywhere.",
                },
            },
        ],
    },
    example: "راهنمای خرید کتاب ۱۴۰۴",
};
