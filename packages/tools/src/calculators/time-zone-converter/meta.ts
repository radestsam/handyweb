import type { ToolDefinition } from "@handyweb/core";

export const timeZoneConverterMeta: ToolDefinition = {
    id: "time-zone-converter",
    slug: "time-zone-converter",
    aliases: ["timezone-converter", "time-difference", "world-clock", "tehran-time"],
    category: "calculators",
    alsoIn: ["developer"],
    related: ["date-difference", "unix-timestamp"],
    tags: ["time zone", "time", "utc", "tehran"],
    title: { fa: "تبدیل منطقه زمانی", en: "Time Zone Converter" },
    description: {
        fa: "یک ساعت را از یک منطقه زمانی به چند منطقه دیگر، مانند تهران، استانبول، دبی، لندن و نیویورک، تبدیل کنید و اختلاف ساعت را ببینید.",
        en: "Convert a time from one time zone to many others, such as Tehran, Istanbul, Dubai, London, and New York, and see the offsets.",
    },
    keywords: {
        fa: ["تبدیل ساعت", "اختلاف ساعت", "ساعت تهران", "منطقه زمانی", "ساعت کشورها"],
        en: [
            "time zone converter",
            "time difference",
            "tehran time",
            "utc converter",
            "world clock",
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
        fa: "داده منطقه‌های زمانی از مرورگر شماست، پس مرورگر کهنه ممکن است قاعده‌های کهنه داشته باشد. ساعتی که در تغییر ساعت تابستانی دو بار تکرار می‌شود، با نخستین بار حساب می‌شود.",
        en: "Time zone data comes from your browser, so an old browser can have old rules. A time that repeats when daylight saving ends uses its first instance.",
    },
    guide: {
        steps: [
            {
                fa: "منطقه زمانی مبدأ و ساعت را برگزینید.",
                en: "Choose the source time zone and the time.",
            },
            { fa: "ساعت را در منطقه‌های دیگر ببینید.", en: "Read the time in the other zones." },
            { fa: "منطقه‌ای را بیفزایید یا بردارید.", en: "Add or remove a zone." },
        ],
        faq: [
            {
                question: {
                    fa: "ایران ساعت تابستانی دارد؟",
                    en: "Does Iran use daylight saving time?",
                },
                answer: {
                    fa: "نه. ایران از سال ۱۴۰۱ ساعت تابستانی را کنار گذاشت و همه سال UTC+۰۳:۳۰ است.",
                    en: "No. Iran stopped daylight saving time in 2022 and stays at UTC+03:30 all year.",
                },
            },
        ],
    },
    example: "2026-03-21T12:00",
};
