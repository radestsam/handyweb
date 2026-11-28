import { ToolFailure } from "@handyweb/core/runtime";
import {
    gregorianMonthLength,
    gregorianToJalali,
    jalaliToGregorian,
    parseDate,
    type SimpleDate,
} from "../../persian/jalali-converter/logic";

export type Calendar = "jalali" | "gregorian";

const DAY = 86_400_000;

/** The number of days since 1970-01-01 for a Gregorian date. */
function dayNumber(date: SimpleDate): number {
    return Math.round(Date.UTC(date.year, date.month - 1, date.day) / DAY);
}

function fromDayNumber(days: number): SimpleDate {
    const date = new Date(days * DAY);
    return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

function toGregorian(date: SimpleDate, calendar: Calendar): SimpleDate {
    return calendar === "jalali" ? jalaliToGregorian(date) : date;
}

function fromGregorian(date: SimpleDate, calendar: Calendar): SimpleDate {
    return calendar === "jalali" ? gregorianToJalali(date) : date;
}

function monthLength(year: number, month: number, calendar: Calendar): number {
    if (calendar === "gregorian") return gregorianMonthLength(year, month);
    const next =
        month === 12 ? { year: year + 1, month: 1, day: 1 } : { year, month: month + 1, day: 1 };
    return (
        dayNumber(jalaliToGregorian(next)) - dayNumber(jalaliToGregorian({ year, month, day: 1 }))
    );
}

/** Reads a date and checks that the day exists in its month. */
export function readDate(text: string, calendar: Calendar): SimpleDate {
    const date = parseDate(text);
    if (
        date.month < 1 ||
        date.month > 12 ||
        date.day < 1 ||
        date.day > monthLength(date.year, date.month, calendar)
    ) {
        throw new ToolFailure(
            "invalid-input",
            { fa: "این روز در این ماه نیست.", en: "This day is not in this month." },
            "day",
        );
    }
    return date;
}

export interface Difference {
    /** Positive when the second date is later. */
    days: number;
    years: number;
    months: number;
    remainingDays: number;
    weeks: number;
    weekDays: number;
    /** Days that are not a Friday, counting both ends (the Iranian work week). */
    nonFridays: number;
}

/** The difference between two dates of the same calendar. */
export function difference(a: SimpleDate, b: SimpleDate, calendar: Calendar): Difference {
    const start = dayNumber(toGregorian(a, calendar));
    const end = dayNumber(toGregorian(b, calendar));
    const days = end - start;
    const [early, late] = days >= 0 ? [a, b] : [b, a];
    // Add whole months to the early date (a day past the end of a month is
    // moved to its last day, so 31 January + 1 month is 28 or 29 February),
    // then count the days that are left.
    const addMonths = (date: SimpleDate, count: number): SimpleDate => {
        const index = date.year * 12 + (date.month - 1) + count;
        const year = Math.floor(index / 12);
        const month = (index % 12) + 1;
        return { year, month, day: Math.min(date.day, monthLength(year, month, calendar)) };
    };
    const lateDay = dayNumber(toGregorian(late, calendar));
    let totalMonths = (late.year - early.year) * 12 + (late.month - early.month);
    if (dayNumber(toGregorian(addMonths(early, totalMonths), calendar)) > lateDay) totalMonths -= 1;
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    const remaining = lateDay - dayNumber(toGregorian(addMonths(early, totalMonths), calendar));
    const total = Math.abs(days);
    // 1970-01-02 was a Friday, so day number n is a Friday when (n - 1) % 7 === 0.
    let fridays = 0;
    const first = Math.min(start, end);
    for (let n = first; n <= first + total; n++) if ((((n - 1) % 7) + 7) % 7 === 0) fridays++;
    return {
        days,
        years,
        months,
        remainingDays: remaining,
        weeks: Math.floor(total / 7),
        weekDays: total % 7,
        nonFridays: total + 1 - fridays,
    };
}

/** The date that is a number of days after (or before, when negative) a date. */
export function addDays(date: SimpleDate, days: number, calendar: Calendar): SimpleDate {
    return fromGregorian(fromDayNumber(dayNumber(toGregorian(date, calendar)) + days), calendar);
}
