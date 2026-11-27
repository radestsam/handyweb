import { ToolFailure } from "@handyweb/core/runtime";

/*
 * Standard 5-field cron (minute hour day-of-month month day-of-week), as Vixie
 * cron reads it: *, lists (1,2), ranges (1-5), steps (*\/15, 1-10/2), month
 * and weekday names, and the @yearly, @monthly, @weekly, @daily, and @hourly
 * shortcuts. When both day fields are restricted, a day matches if either
 * one matches.
 */

export type FieldName = "minute" | "hour" | "dayOfMonth" | "month" | "dayOfWeek";
export const FIELDS: readonly FieldName[] = ["minute", "hour", "dayOfMonth", "month", "dayOfWeek"];

const RANGES: Record<FieldName, [number, number]> = {
    minute: [0, 59],
    hour: [0, 23],
    dayOfMonth: [1, 31],
    month: [1, 12],
    dayOfWeek: [0, 7],
};
const MONTH_NAMES = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
];
const DAY_NAMES = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const MACROS: Record<string, string> = {
    "@yearly": "0 0 1 1 *",
    "@annually": "0 0 1 1 *",
    "@monthly": "0 0 1 * *",
    "@weekly": "0 0 * * 0",
    "@daily": "0 0 * * *",
    "@midnight": "0 0 * * *",
    "@hourly": "0 * * * *",
};

export interface CronField {
    values: number[];
    /** The field was "*" (or "*\/1"), so it does not restrict. */
    any: boolean;
    source: string;
}

export type Cron = Record<FieldName, CronField>;

function fail(fa: string, en: string, detail: string): ToolFailure {
    return new ToolFailure("invalid-input", { fa, en }, detail);
}

function value(text: string, field: FieldName): number {
    const lower = text.toLowerCase();
    if (field === "month" && MONTH_NAMES.includes(lower)) return MONTH_NAMES.indexOf(lower) + 1;
    if (field === "dayOfWeek" && DAY_NAMES.includes(lower)) return DAY_NAMES.indexOf(lower);
    if (!/^\d+$/.test(text)) {
        throw fail(
            `«${text}» در این بخش درست نیست.`,
            `"${text}" is not valid in this field.`,
            `${field} ${text}`,
        );
    }
    const n = Number(text);
    const [min, max] = RANGES[field];
    if (n < min || n > max) {
        throw fail(
            `${n} بیرون از بازه ${min} تا ${max} است.`,
            `${n} is outside the range ${min} to ${max}.`,
            `${field} range`,
        );
    }
    return n;
}

function parseField(source: string, field: FieldName): CronField {
    const [min, max] = RANGES[field];
    const set = new Set<number>();
    for (const part of source.split(",")) {
        const [range = "", stepText] = part.split("/");
        const step = stepText === undefined ? 1 : Number(stepText);
        if (!Number.isInteger(step) || step < 1) {
            throw fail(
                `گام «${stepText}» درست نیست.`,
                `The step "${stepText}" is not valid.`,
                `${field} step`,
            );
        }
        let start: number;
        let end: number;
        if (range === "*") {
            [start, end] = [min, max];
        } else if (range.includes("-")) {
            const [a = "", b = ""] = range.split("-");
            [start, end] = [value(a, field), value(b, field)];
            if (start > end) {
                throw fail(
                    `بازه ${range} وارونه است.`,
                    `The range ${range} is backwards.`,
                    `${field} range order`,
                );
            }
        } else {
            start = value(range, field);
            end = stepText === undefined ? start : max;
        }
        for (let n = start; n <= end; n += step) set.add(field === "dayOfWeek" && n === 7 ? 0 : n);
    }
    const values = [...set].sort((a, b) => a - b);
    const any = /^\*(?:\/1)?$/.test(source);
    return { values, any, source };
}

export function parseCron(expression: string): Cron {
    const text = expression.trim().replace(/\s+/g, " ");
    const expanded = MACROS[text.toLowerCase()] ?? text;
    const parts = expanded.split(" ");
    if (parts.length !== 5) {
        throw fail(
            `عبارت cron پنج بخش دارد (دقیقه، ساعت، روز ماه، ماه، روز هفته)، نه ${parts.length}.`,
            `A cron expression has five fields (minute, hour, day of month, month, day of week), not ${parts.length}.`,
            "fields",
        );
    }
    const cron = {} as Cron;
    FIELDS.forEach((field, index) => {
        cron[field] = parseField(parts[index] as string, field);
    });
    return cron;
}

function dayMatches(cron: Cron, date: Date): boolean {
    const dom = cron.dayOfMonth.values.includes(date.getDate());
    const dow = cron.dayOfWeek.values.includes(date.getDay());
    if (cron.dayOfMonth.any && cron.dayOfWeek.any) return true;
    if (cron.dayOfMonth.any) return dow;
    if (cron.dayOfWeek.any) return dom;
    return dom || dow;
}

/** The next run times after `from`, in the time zone of this device. Looks up to 5 years ahead. */
export function nextRuns(cron: Cron, from: Date, count: number): Date[] {
    const runs: Date[] = [];
    const day = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    const limit = new Date(day.getFullYear() + 5, day.getMonth(), day.getDate());
    for (; day < limit && runs.length < count; day.setDate(day.getDate() + 1)) {
        if (!cron.month.values.includes(day.getMonth() + 1) || !dayMatches(cron, day)) continue;
        for (const hour of cron.hour.values) {
            for (const minute of cron.minute.values) {
                const run = new Date(
                    day.getFullYear(),
                    day.getMonth(),
                    day.getDate(),
                    hour,
                    minute,
                );
                // A clock change can skip an hour; the Date then moves to another hour.
                if (run.getHours() !== hour || run <= from) continue;
                runs.push(run);
                if (runs.length === count) return runs;
            }
        }
    }
    return runs;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** A short description of the schedule in Persian or English. */
export function describe(cron: Cron, locale: "fa" | "en"): string {
    const fa = locale === "fa";
    const list = (values: string[]) =>
        values.length <= 1
            ? (values[0] ?? "")
            : `${values.slice(0, -1).join(fa ? "، " : ", ")} ${fa ? "و" : "and"} ${values[values.length - 1]}`;
    const num = (n: number) => (fa ? new Intl.NumberFormat("fa-IR").format(n) : String(n));
    const step = (source: string) => /^\*\/(\d+)$/.exec(source)?.[1];
    const parts: string[] = [];

    const { minute, hour } = cron;
    if (minute.values.length === 1 && hour.values.length === 1) {
        const time = `${pad(hour.values[0] as number)}:${pad(minute.values[0] as number)}`;
        parts.push(fa ? `ساعت ${time}` : `at ${time}`);
    } else {
        const minuteStep = step(minute.source);
        if (minute.any) parts.push(fa ? "هر دقیقه" : "every minute");
        else if (minuteStep)
            parts.push(fa ? `هر ${num(Number(minuteStep))} دقیقه` : `every ${minuteStep} minutes`);
        else
            parts.push(
                fa
                    ? `در دقیقه ${list(minute.values.map(num))}`
                    : `at minute ${list(minute.values.map(String))}`,
            );
        const hourStep = step(hour.source);
        if (hourStep)
            parts.push(fa ? `هر ${num(Number(hourStep))} ساعت` : `every ${hourStep} hours`);
        else if (!hour.any) {
            parts.push(
                fa
                    ? `در ساعت ${list(hour.values.map(num))}`
                    : `during hour ${list(hour.values.map(String))}`,
            );
        }
    }
    const weekdays = fa
        ? ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"]
        : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = fa
        ? [
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
          ]
        : [
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
          ];
    const days: string[] = [];
    if (!cron.dayOfMonth.any) {
        days.push(
            fa
                ? `روز ${list(cron.dayOfMonth.values.map(num))} ماه`
                : `on day ${list(cron.dayOfMonth.values.map(String))} of the month`,
        );
    }
    if (!cron.dayOfWeek.any) {
        days.push(
            fa
                ? `روزهای ${list(cron.dayOfWeek.values.map((d) => weekdays[d] as string))}`
                : `on ${list(cron.dayOfWeek.values.map((d) => weekdays[d] as string))}`,
        );
    }
    if (days.length) parts.push(days.join(fa ? " یا " : " or "));
    if (!cron.month.any) {
        parts.push(
            fa
                ? `در ${list(cron.month.values.map((m) => months[m - 1] as string))}`
                : `in ${list(cron.month.values.map((m) => months[m - 1] as string))}`,
        );
    }
    const text = parts.join(fa ? "، " : ", ");
    return fa ? `${text}.` : `${text.charAt(0).toUpperCase()}${text.slice(1)}.`;
}
