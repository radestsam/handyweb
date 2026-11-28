import type { ToolDefinition } from "@handyweb/core";

export const dateDifferenceMeta: ToolDefinition = {
    id: "date-difference",
    slug: "date-difference",
    aliases: ["days-between-dates", "date-calculator", "age-in-days", "add-days-to-date"],
    category: "calculators",
    alsoIn: ["persian"],
    related: ["jalali-converter"],
    tags: ["date", "days", "jalali", "calendar"],
    title: { fa: "محاسبه فاصله دو تاریخ", en: "Date Difference Calculator" },
    seoTitle: {
        fa: "محاسبه فاصله دو تاریخ شمسی و میلادی به روز",
        en: "Date Difference Calculator for Days Between Dates",
    },
    description: {
        fa: "فاصله دو تاریخ خورشیدی یا میلادی را به روز، هفته و سال و ماه و روز حساب کنید، و تاریخِ چند روز پس یا پیش از یک روز را پیدا کنید.",
        en: "Count the days, weeks, and years, months, and days between two Persian (Jalali) or Gregorian dates, and find the date a number of days before or after a day.",
    },
    keywords: {
        fa: [
            "فاصله دو تاریخ",
            "محاسبه روز بین دو تاریخ",
            "چند روز مانده",
            "محاسبه تاریخ",
            "اضافه کردن روز به تاریخ",
        ],
        en: [
            "days between dates",
            "date difference",
            "date calculator",
            "add days to date",
            "jalali date difference",
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
        fa: "تعطیلات رسمی شمرده نمی‌شوند؛ تنها جمعه‌ها از روزهای کاری کم می‌شوند. هر دو تاریخ در یک تقویم‌اند. ساعت و منطقه زمانی در حساب نیست.",
        en: "Public holidays are not counted; only Fridays are left out of the work days. Both dates use one calendar. Time of day and time zones are not used.",
    },
    guide: {
        steps: [
            { fa: "تقویم را برگزینید.", en: "Choose the calendar." },
            {
                fa: "دو تاریخ را به شکل سال/ماه/روز بنویسید.",
                en: "Enter the two dates as year/month/day.",
            },
            {
                fa: "فاصله را ببینید، یا روزها را به یک تاریخ بیفزایید.",
                en: "Read the difference, or add days to a date.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "از ۳۱ دی تا ۱ اسفند چند ماه است؟",
                    en: "How do months count from the 31st?",
                },
                answer: {
                    fa: "اگر روزِ ماه بعد کمتر باشد، روز آخر آن ماه به کار می‌رود. برای نمونه ۳۱ ژانویه به‌علاوه یک ماه، ۲۸ یا ۲۹ فوریه است.",
                    en: "When the next month is shorter, its last day is used. For example, 31 January plus one month is 28 or 29 February.",
                },
            },
        ],
    },
    example: "1400/01/01",
};
