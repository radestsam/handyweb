import type { ToolDefinition } from "@handyweb/core";

export const jalaliConverterMeta: ToolDefinition = {
    id: "jalali-converter",
    slug: "jalali-converter",
    aliases: [
        "persian-date-converter",
        "shamsi-to-miladi",
        "miladi-to-shamsi",
        "jalali-to-gregorian",
        "gregorian-to-jalali",
    ],
    category: "persian",
    alsoIn: ["calculators"],
    related: ["persian-normalizer"],
    tags: ["date", "calendar", "jalali"],
    title: { fa: "تبدیل تاریخ شمسی و میلادی", en: "Jalali and Gregorian Date Converter" },
    description: {
        fa: "تاریخ شمسی را به میلادی و میلادی را به شمسی برگردانید، همراه با روز هفته و سال‌های ۳۶۶ روزه (کبیسه).",
        en: "Convert a Jalali (Persian) date to Gregorian and back, with the day of the week and leap years.",
    },
    keywords: {
        fa: [
            "تبدیل تاریخ",
            "شمسی به میلادی",
            "میلادی به شمسی",
            "تاریخ جلالی",
            "تقویم",
            "امروز چندم است",
            "کبیسه",
        ],
        en: [
            "jalali",
            "shamsi",
            "persian date",
            "solar hijri",
            "gregorian",
            "date converter",
            "persian calendar",
        ],
    },
    presets: [
        {
            id: "to-jalali",
            title: { fa: "تبدیل میلادی به شمسی", en: "Gregorian to Jalali" },
            keywords: { fa: ["میلادی به شمسی"], en: ["gregorian to jalali"] },
            options: { direction: "to-jalali" },
        },
    ],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: true,
    inputKinds: ["text"],
    outputKinds: ["text"],
    limitations: {
        fa: "این ابزار روش شمارشی بورکوفسکی را به کار می‌برد که برای سال‌های ۱ تا ۳۱۷۷ خورشیدی بی‌کم‌وکاست است. گاه‌شمار کشوری ایران بر پایه گردش زمین به دور خورشید است و در سال‌های بسیار دور شاید یک روز جدا شود.",
        en: "The conversion uses the arithmetic algorithm of K. M. Borkowski, exact for Jalali years 1 to 3177. The official Iranian calendar is based on astronomical calculation and may differ by one day in distant years.",
    },
    guide: {
        steps: [
            {
                fa: "«شمسی به میلادی» یا «میلادی به شمسی» را برگزینید.",
                en: "Choose Jalali to Gregorian or Gregorian to Jalali.",
            },
            {
                fa: "روز را به شکل سال/ماه/روز بنویسید، برای نمونه ۱۴۰۴/۰۹/۰۵. شماره‌های فارسی هم پذیرفته می‌شوند.",
                en: "Type the date as year/month/day, for example 2025/11/26. Persian digits also work.",
            },
            {
                fa: "پاسخ همراه با نام روز هفته نشان داده می‌شود. برای امروز، دکمه «امروز» را بزنید.",
                en: "The result appears with the day of the week. Press Today for the current date.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "کدام سال‌های شمسی ۳۶۶ روزه‌اند؟",
                    en: "Which Jalali years are leap years?",
                },
                answer: {
                    fa: "در سال‌های ۳۶۶ روزه (کبیسه) اسفند ۳۰ روز دارد، برای نمونه ۱۴۰۳. ابزار سال‌های کبیسه را خودش می‌شناسد و روز نادرستی مانند ۱۴۰۴/۱۲/۳۰ را نمی‌پذیرد.",
                    en: "In a Jalali leap year, Esfand has 30 days, for example in 1403. The tool knows the leap years and rejects a date such as 1404/12/30.",
                },
            },
            {
                question: { fa: "نوروز ۱۴۰۴ چه روزی بود؟", en: "When was Nowruz 1404?" },
                answer: {
                    fa: "۱ فروردین ۱۴۰۴ برابر با جمعه ۲۱ مارس ۲۰۲۵ بود.",
                    en: "1 Farvardin 1404 was Friday, 21 March 2025.",
                },
            },
        ],
    },
    example: "1404/09/05",
};
