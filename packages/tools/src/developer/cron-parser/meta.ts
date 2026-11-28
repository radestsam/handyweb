import type { ToolDefinition } from "@handyweb/core";

export const cronParserMeta: ToolDefinition = {
    id: "cron-parser",
    slug: "cron-parser",
    aliases: ["cron-expression", "crontab", "cron-explainer", "crontab-guru"],
    category: "developer",
    alsoIn: [],
    related: ["unix-timestamp", "regex-tester"],
    tags: ["cron", "crontab", "schedule"],
    title: { fa: "خواندن عبارت cron", en: "Cron Expression Parser" },
    seoTitle: {
        fa: "خواندن عبارت cron و زمان اجراهای بعدی",
        en: "Cron Expression Parser with Next Run Times",
    },
    description: {
        fa: "یک عبارت cron را به زبان ساده فارسی یا انگلیسی بخوانید و ده اجرای بعدی آن را با تاریخ شمسی ببینید.",
        en: "Read a cron expression in plain words and see its next ten run times.",
    },
    keywords: {
        fa: ["کرون", "cron", "زمان‌بندی", "کرون جاب", "crontab"],
        en: ["cron expression", "cron parser", "crontab", "cron schedule", "next cron run"],
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
    limits: { maxInputBytes: 1_000 },
    limitations: {
        fa: "تنها cron استاندارد پنج‌بخشی (Vixie cron). بخش ثانیه، سال و نشانه‌های ویژه Quartz مانند L، W و ? پذیرفته نمی‌شوند. زمان‌ها به وقت این دستگاه‌اند، نه سرور.",
        en: "Only standard 5-field cron (Vixie cron). Seconds, years, and Quartz signs such as L, W, and ? are not accepted. Times are in the time zone of this device, not the server.",
    },
    guide: {
        steps: [
            { fa: "عبارت cron را بنویسید.", en: "Type the cron expression." },
            { fa: "معنای آن را بخوانید.", en: "Read what it means." },
            { fa: "اجراهای بعدی را بسنجید.", en: "Check the next run times." },
        ],
        faq: [
            {
                question: {
                    fa: "اگر روز ماه و روز هفته هر دو داده شوند؟",
                    en: "What if both day of month and day of week are set?",
                },
                answer: {
                    fa: "cron روزی را اجرا می‌کند که یکی از آن دو جور باشد، نه هر دو. برای نمونه، 0 9 15 * 1 روز پانزدهم و همه دوشنبه‌ها اجرا می‌شود.",
                    en: "cron runs on a day that matches either one, not both. For example, 0 9 15 * 1 runs on the 15th and on every Monday.",
                },
            },
        ],
    },
    example: "*/15 9-17 * * 1-5",
};
