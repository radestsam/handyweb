import { ToolFailure } from "@handyweb/core/runtime";
import { jalaliToGregorian } from "../../persian/jalali-converter/logic";

export type Unit = "s" | "ms" | "us" | "ns";
export type UnitChoice = Unit | "auto";
/** How a date without a time zone is read. */
export type Zone = "local" | "utc";

export interface Parsed {
    /** Milliseconds since 1970-01-01T00:00:00Z. */
    ms: number;
    kind: "timestamp" | "date";
    /** The unit of a timestamp input. */
    unit: Unit | null;
    /** The date was written in the Jalali calendar. */
    jalali: boolean;
}

/** The largest time a JavaScript Date can hold: 100,000,000 days from 1970. */
const MAX_MS = 8.64e15;
const PER_MS: Record<Unit, number> = { s: 1 / 1000, ms: 1, us: 1000, ns: 1_000_000 };

function fail(fa: string, en: string, detail: string): ToolFailure {
    return new ToolFailure("invalid-input", { fa, en }, detail);
}

function latinDigits(text: string): string {
    return text
        .replace(/[۰-۹]/g, (d) => String((d.codePointAt(0) as number) - 0x06f0))
        .replace(/[٠-٩]/g, (d) => String((d.codePointAt(0) as number) - 0x0660));
}

/**
 * Picks the unit from the size of the number. Seconds reach 10^11 in the year
 * 5138, so a larger number is milliseconds, then microseconds, then
 * nanoseconds.
 */
export function detectUnit(value: number): Unit {
    const size = Math.abs(value);
    if (size < 1e11) return "s";
    if (size < 1e14) return "ms";
    if (size < 1e17) return "us";
    return "ns";
}

function checkRange(ms: number): number {
    if (!Number.isFinite(ms) || Math.abs(ms) > MAX_MS) {
        throw fail(
            "این زمان بیرون از بازه‌ای است که مرورگر می‌شناسد (۲۷۱٬۸۲۱ سال پیش یا پس از ۱۹۷۰).",
            "This time is outside the range a browser can show (271,821 years before or after 1970).",
            "range",
        );
    }
    return ms;
}

const DATE =
    /^(\d{1,4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[\sT]+(\d{1,2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?)?$/;

/**
 * Reads a timestamp (seconds, milliseconds, microseconds, or nanoseconds) or a
 * date. A date with a year below 1700 is read as Jalali, for example
 * 1404/09/06 12:30. An ISO 8601 date with a Z or an offset keeps its zone;
 * other dates use `zone`. Persian and Arabic-Indic digits are accepted.
 */
export function parseInput(input: string, unit: UnitChoice, zone: Zone): Parsed {
    const text = latinDigits(input.trim());
    if (text === "") throw fail("ورودی خالی است.", "The input is empty.", "empty");

    if (/^[-+]?\d+(?:\.\d+)?$/.test(text)) {
        const value = Number(text);
        const used = unit === "auto" ? detectUnit(value) : unit;
        return {
            ms: checkRange(Math.round(value / PER_MS[used])),
            kind: "timestamp",
            unit: used,
            jalali: false,
        };
    }

    const date = DATE.exec(text);
    if (date) {
        let year = Number(date[1]);
        let month = Number(date[2]);
        let day = Number(date[3]);
        const jalali = year < 1700;
        if (jalali) ({ year, month, day } = jalaliToGregorian({ year, month, day }));
        const parts = [
            year,
            month - 1,
            day,
            Number(date[4] ?? 0),
            Number(date[5] ?? 0),
            Number(date[6] ?? 0),
            Number((date[7] ?? "0").padEnd(3, "0")),
        ] as const;
        if (
            month < 1 ||
            month > 12 ||
            day < 1 ||
            day > 31 ||
            parts[3] > 23 ||
            parts[4] > 59 ||
            parts[5] > 59
        ) {
            throw fail("این تاریخ یا ساعت درست نیست.", "This date or time is not valid.", "date");
        }
        const ms = zone === "utc" ? Date.UTC(...parts) : new Date(...parts).getTime();
        // Date rolls 2025-02-30 over to March. Check that the day stayed.
        const check = new Date(ms);
        const checkDay = zone === "utc" ? check.getUTCDate() : check.getDate();
        if (checkDay !== day) {
            throw fail("این روز در آن ماه نیست.", "That month does not have this day.", "day");
        }
        return { ms: checkRange(ms), kind: "date", unit: null, jalali };
    }

    // ISO 8601 with a zone, such as 2025-11-27T10:00:00Z or +03:30.
    if (/^\d{4}-\d{2}-\d{2}T[\d:.]+(?:Z|[+-]\d{2}:?\d{2})$/i.test(text)) {
        const ms = Date.parse(text);
        if (!Number.isNaN(ms))
            return { ms: checkRange(ms), kind: "date", unit: null, jalali: false };
    }

    throw fail(
        "این ورودی برچسب زمانی یا تاریخ شناخته‌شده‌ای نیست. نمونه‌ها: 1732700000، 2025-11-27 10:30، ۱۴۰۴/۰۹/۰۶.",
        "This is not a known timestamp or date. Examples: 1732700000, 2025-11-27 10:30, 1404/09/06.",
        "format",
    );
}

/** Picks a unit for "3 days ago" style text. */
export function relative(
    ms: number,
    nowMs: number,
): { value: number; unit: Intl.RelativeTimeFormatUnit } {
    const seconds = (ms - nowMs) / 1000;
    const steps: Array<[Intl.RelativeTimeFormatUnit, number]> = [
        ["year", 365.2425 * 86400],
        ["month", 30.436875 * 86400],
        ["week", 7 * 86400],
        ["day", 86400],
        ["hour", 3600],
        ["minute", 60],
    ];
    for (const [unit, size] of steps) {
        if (Math.abs(seconds) >= size) return { value: Math.round(seconds / size), unit };
    }
    return { value: Math.round(seconds), unit: "second" };
}
