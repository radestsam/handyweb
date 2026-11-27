import type { LocalizedText } from "@handyweb/core";

export const strings = {
    calendar: { fa: "تقویم", en: "Calendar" },
    jalali: { fa: "خورشیدی", en: "Persian (Jalali)" },
    gregorian: { fa: "میلادی", en: "Gregorian" },
    start: { fa: "از تاریخ", en: "From" },
    end: { fa: "تا تاریخ", en: "To" },
    today: { fa: "امروز", en: "Today" },
    days: { fa: "روز", en: "days" },
    total: { fa: "فاصله", en: "Difference" },
    ymd: { fa: "سال، ماه، روز", en: "Years, months, days" },
    years: { fa: "سال", en: "years" },
    months: { fa: "ماه", en: "months" },
    weeks: { fa: "هفته", en: "weeks" },
    and: { fa: "و", en: "and" },
    nonFridays: {
        fa: "روزهای غیرجمعه (با هر دو سر)",
        en: "Days that are not Fridays (both ends counted)",
    },
    earlier: { fa: "تاریخ دوم پیش از تاریخ اول است.", en: "The second date is before the first." },
    addTitle: { fa: "افزودن یا کم کردن روز", en: "Add or take away days" },
    date: { fa: "تاریخ", en: "Date" },
    count: { fa: "شمار روز (منفی برای پیش)", en: "Days (negative for before)" },
    format: { fa: "سال/ماه/روز", en: "year/month/day" },
} as const satisfies Record<string, LocalizedText>;
