import type { ToolDefinition } from "@handyweb/core";

export const unixTimestampMeta: ToolDefinition = {
    id: "unix-timestamp",
    slug: "unix-timestamp",
    aliases: ["epoch-converter", "timestamp-converter", "unix-time", "epoch-to-date"],
    category: "developer",
    alsoIn: ["calculators"],
    related: ["jalali-converter", "jwt-decoder", "uuid-generator"],
    tags: ["timestamp", "epoch", "unix", "date"],
    title: {
        fa: "تبدیل برچسب زمانی یونیکس به تاریخ",
        en: "Unix Timestamp Converter",
    },
    description: {
        fa: "برچسب زمانی یونیکس را به تاریخ شمسی، میلادی و ISO 8601 برگردانید، یا یک تاریخ شمسی یا میلادی را به برچسب زمانی درآورید. ثانیه و میلی‌ثانیه خودکار شناخته می‌شوند.",
        en: "Convert a Unix timestamp to a Jalali, Gregorian, or ISO 8601 date, or a Jalali or Gregorian date to a timestamp. Seconds and milliseconds are detected for you.",
    },
    keywords: {
        fa: ["تایم استمپ", "برچسب زمانی", "یونیکس", "epoch", "تبدیل timestamp به تاریخ شمسی"],
        en: [
            "unix timestamp",
            "epoch converter",
            "timestamp to date",
            "date to timestamp",
            "milliseconds to date",
            "epoch to jalali",
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
    limitations: {
        fa: "دقت تا میلی‌ثانیه است: میکروثانیه و نانوثانیه گرد می‌شوند. منطقه زمانی و ساعت تابستانی از تنظیم‌های مرورگر شما می‌آیند. سال کمتر از ۱۷۰۰ شمسی خوانده می‌شود.",
        en: "Precision is one millisecond: microseconds and nanoseconds are rounded. The time zone and daylight saving rules come from your browser. A year below 1700 is read as Jalali.",
    },
    guide: {
        steps: [
            {
                fa: "برچسب زمانی یا تاریخ را بنویسید، یا «اکنون» را بزنید.",
                en: "Enter a timestamp or a date, or select Now.",
            },
            {
                fa: "اگر یکا درست شناخته نشد، آن را دستی برگزینید.",
                en: "If the unit is not detected correctly, choose it by hand.",
            },
            {
                fa: "هر شکل را با دکمه کنار آن کپی کنید.",
                en: "Copy each form with the button next to it.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "ثانیه یا میلی‌ثانیه چگونه شناخته می‌شود؟",
                    en: "How are seconds and milliseconds detected?",
                },
                answer: {
                    fa: "از اندازه شماره. برچسب زمانی ثانیه‌ای تا سال ۵۱۳۸ از ۱۱ رقم کمتر است، پس شماره بزرگ‌تر میلی‌ثانیه، و پس از آن میکروثانیه و نانوثانیه شمرده می‌شود.",
                    en: "From the size of the number. A timestamp in seconds has fewer than 12 digits until the year 5138, so a larger number is read as milliseconds, then microseconds and nanoseconds.",
                },
            },
            {
                question: {
                    fa: "تاریخ شمسی را چگونه بنویسم؟",
                    en: "How do I enter a Jalali date?",
                },
                answer: {
                    fa: "به شکل سال/ماه/روز و در صورت نیاز ساعت، مانند ۱۴۰۴/۰۹/۰۶ ۱۰:۳۰. سال کمتر از ۱۷۰۰ شمسی شمرده می‌شود و شماره‌های فارسی پذیرفته می‌شوند.",
                    en: "As year/month/day with an optional time, such as 1404/09/06 10:30. A year below 1700 is read as Jalali, and Persian digits are accepted.",
                },
            },
        ],
    },
    example: "1732700000",
};
