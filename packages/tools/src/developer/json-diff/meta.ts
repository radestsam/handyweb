import type { ToolDefinition } from "@handyweb/core";

export const jsonDiffMeta: ToolDefinition = {
    id: "json-diff",
    slug: "json-diff",
    aliases: ["json-compare", "compare-json", "json-difference"],
    category: "developer",
    alsoIn: [],
    related: ["text-diff", "json-formatter"],
    tags: ["json", "diff", "compare"],
    title: { fa: "مقایسه دو JSON", en: "JSON Diff" },
    seoTitle: {
        fa: "مقایسه دو JSON و نمایش تفاوت‌ها",
        en: "JSON Diff: Compare Two JSON Files Online",
    },
    description: {
        fa: "مقایسه JSON از نظر ساختار، بی‌توجه به ترتیب کلیدها و فاصله‌ها، و دیدن هر تفاوت با مسیر آن در سند.",
        en: "Compare two JSON documents by structure, whatever the key order and spacing, and see each difference with its path.",
    },
    keywords: {
        fa: ["مقایسه json", "تفاوت json", "json diff"],
        en: ["json diff", "compare json", "json compare", "json difference"],
    },
    presets: [],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["text"],
    outputKinds: ["structured"],
    limits: { maxInputBytes: 10_000_000 },
    limitations: {
        fa: "آرایه‌ها جایگاه به جایگاه سنجیده می‌شوند، پس افزودن یک مورد در آغاز آرایه همه موردهای پس از آن را دگرگون نشان می‌دهد، مگر آنکه «ترتیب آرایه‌ها مهم نیست» روشن باشد. شماره‌های بزرگ‌تر از ۲ به توان ۵۳ گرد می‌شوند.",
        en: "Arrays are compared position by position, so an item added at the start shows every later item as changed, unless “Ignore array order” is on. Numbers larger than 2 to the 53rd are rounded.",
    },
    guide: {
        steps: [
            {
                fa: "دو JSON را در دو کادر بچسبانید.",
                en: "Paste the two JSON documents into the two boxes.",
            },
            { fa: "تفاوت‌ها را با مسیر هر یک ببینید.", en: "Read each difference with its path." },
            { fa: "فهرست را کپی کنید.", en: "Copy the list." },
        ],
        faq: [
            {
                question: {
                    fa: "فرق آن با مقایسه متن چیست؟",
                    en: "How is this different from a text diff?",
                },
                answer: {
                    fa: "مقایسه متن، جابه‌جایی کلیدها یا تورفتگی دیگر را هم تفاوت می‌شمارد. این ابزار ارزش‌ها را می‌سنجد، پس تنها تفاوت‌های واقعی داده را نشان می‌دهد.",
                    en: "A text diff also counts moved keys or other indentation as differences. This tool compares the values, so it shows only real changes in the data.",
                },
            },
        ],
    },
    example: '{"name":"HandyWeb","tools":12}',
};
