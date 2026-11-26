import type { LocalizedText } from "@handyweb/core";

export const strings = {
    direction: { fa: "از کدام به کدام", en: "Direction" },
    toGregorian: { fa: "شمسی به میلادی", en: "Jalali to Gregorian" },
    toJalali: { fa: "میلادی به شمسی", en: "Gregorian to Jalali" },
    jalaliDate: { fa: "سال/ماه/روز شمسی", en: "Jalali date (year/month/day)" },
    gregorianDate: { fa: "سال/ماه/روز میلادی", en: "Gregorian date (year/month/day)" },
    today: { fa: "امروز", en: "Today" },
    swapDirection: { fa: "جابه‌جایی سو", en: "Swap direction" },
    result: { fa: "پاسخ", en: "Result" },
    weekday: { fa: "روز هفته", en: "Day of the week" },
    leap: { fa: "سال ۳۶۶ روزه است", en: "Leap year" },
    hint: {
        fa: "شماره‌های فارسی و لاتین هر دو پذیرفته می‌شوند.",
        en: "Persian and Latin digits are both accepted.",
    },
} as const satisfies Record<string, LocalizedText>;
