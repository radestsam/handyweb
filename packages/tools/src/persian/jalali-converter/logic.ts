import { isValidJalaaliDate, jalaaliMonthLength, toGregorian, toJalaali } from "jalaali-js";
import { ToolFailure } from "@handyweb/core/runtime";

/**
 * Jalali (Solar Hijri) and Gregorian conversion with jalaali-js, which uses
 * the arithmetic algorithm of K. M. Borkowski. It is exact for Jalali years
 * -61 to 3177. The tool accepts Jalali years 1 to 3177.
 */

export interface SimpleDate {
    year: number;
    month: number;
    day: number;
}

export type Direction = "to-gregorian" | "to-jalali";

export const JALALI_MIN_YEAR = 1;
export const JALALI_MAX_YEAR = 3177;
export const GREGORIAN_MIN_YEAR = 622;
export const GREGORIAN_MAX_YEAR = 3798;

export const JALALI_MONTHS = {
    fa: [
        "فروردین",
        "اردیبهشت",
        "خرداد",
        "تیر",
        "مرداد",
        "شهریور",
        "مهر",
        "آبان",
        "آذر",
        "دی",
        "بهمن",
        "اسفند",
    ],
    en: [
        "Farvardin",
        "Ordibehesht",
        "Khordad",
        "Tir",
        "Mordad",
        "Shahrivar",
        "Mehr",
        "Aban",
        "Azar",
        "Dey",
        "Bahman",
        "Esfand",
    ],
} as const;

export const GREGORIAN_MONTHS = {
    fa: [
        "ژانویه",
        "فوریه",
        "مارس",
        "آوریل",
        "مه",
        "ژوئن",
        "ژوئیه",
        "اوت",
        "سپتامبر",
        "اکتبر",
        "نوامبر",
        "دسامبر",
    ],
    en: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ],
} as const;

/** Index 0 is Sunday, as in Date.getUTCDay(). */
export const WEEKDAYS = {
    fa: ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"],
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
} as const;

/**
 * Reads "1404/09/05", "1404-9-5", "۱۴۰۴/۰۹/۰۵", or "2025 11 26". Persian and
 * Arabic-Indic digits are accepted. The order is always year, month, day.
 */
export function parseDate(text: string): SimpleDate {
    const latin = text
        .trim()
        .replace(/[۰-۹]/g, (d) => String((d.codePointAt(0) as number) - 0x06f0))
        .replace(/[٠-٩]/g, (d) => String((d.codePointAt(0) as number) - 0x0660));
    const match = /^(\d{1,4})\s*[/\-.\s]\s*(\d{1,2})\s*[/\-.\s]\s*(\d{1,2})$/.exec(latin);
    if (!match) {
        throw new ToolFailure("invalid-input", {
            fa: "روز را به شکل سال/ماه/روز بنویسید، برای نمونه ۱۴۰۴/۰۹/۰۵.",
            en: "Write the date as year/month/day, for example 2025/11/26.",
        });
    }
    return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}

export function isGregorianLeap(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function gregorianMonthLength(year: number, month: number): number {
    return (
        [31, isGregorianLeap(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] ??
        0
    );
}

function checkMonth(month: number) {
    if (month < 1 || month > 12) {
        throw new ToolFailure("invalid-input", {
            fa: `ماه باید بین ۱ و ۱۲ باشد، نه ${month}.`,
            en: `The month must be from 1 to 12, not ${month}.`,
        });
    }
}

function outOfRange(min: number, max: number): ToolFailure {
    return new ToolFailure("invalid-input", {
        fa: `سال باید بین ${min} و ${max} باشد.`,
        en: `The year must be from ${min} to ${max}.`,
    });
}

export function jalaliToGregorian({ year, month, day }: SimpleDate): SimpleDate {
    if (year < JALALI_MIN_YEAR || year > JALALI_MAX_YEAR)
        throw outOfRange(JALALI_MIN_YEAR, JALALI_MAX_YEAR);
    checkMonth(month);
    if (!isValidJalaaliDate(year, month, day)) {
        const length = jalaaliMonthLength(year, month);
        throw new ToolFailure("invalid-input", {
            fa: `${JALALI_MONTHS.fa[month - 1]} ${year} ${length} روز دارد.`,
            en: `${JALALI_MONTHS.en[month - 1]} ${year} has ${length} days.`,
        });
    }
    const { gy, gm, gd } = toGregorian(year, month, day);
    return { year: gy, month: gm, day: gd };
}

export function gregorianToJalali({ year, month, day }: SimpleDate): SimpleDate {
    if (year < GREGORIAN_MIN_YEAR || year > GREGORIAN_MAX_YEAR) {
        throw outOfRange(GREGORIAN_MIN_YEAR, GREGORIAN_MAX_YEAR);
    }
    checkMonth(month);
    const length = gregorianMonthLength(year, month);
    if (day < 1 || day > length) {
        throw new ToolFailure("invalid-input", {
            fa: `${GREGORIAN_MONTHS.fa[month - 1]} ${year} ${length} روز دارد.`,
            en: `${GREGORIAN_MONTHS.en[month - 1]} ${year} has ${length} days.`,
        });
    }
    const { jy, jm, jd } = toJalaali(year, month, day);
    return { year: jy, month: jm, day: jd };
}

/** Day of the week of a Gregorian date. 0 is Sunday. */
export function weekday({ year, month, day }: SimpleDate): number {
    const date = new Date(Date.UTC(2000, month - 1, day));
    // setUTCFullYear keeps years below 100 as written; Date.UTC would add 1900.
    date.setUTCFullYear(year, month - 1, day);
    return date.getUTCDay();
}

export interface Conversion {
    jalali: SimpleDate;
    gregorian: SimpleDate;
    weekday: number;
}

export function convert(text: string, direction: Direction): Conversion {
    const input = parseDate(text);
    if (direction === "to-gregorian") {
        const gregorian = jalaliToGregorian(input);
        return { jalali: input, gregorian, weekday: weekday(gregorian) };
    }
    const jalali = gregorianToJalali(input);
    return { jalali, gregorian: input, weekday: weekday(input) };
}

const pad = (n: number, width: number) => String(n).padStart(width, "0");

/** "1404/09/05" with Latin digits. */
export function formatNumeric({ year, month, day }: SimpleDate): string {
    return `${pad(year, 4)}/${pad(month, 2)}/${pad(day, 2)}`;
}

/** Today in the time zone of the device. */
export function todayGregorian(now = new Date()): SimpleDate {
    return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}
