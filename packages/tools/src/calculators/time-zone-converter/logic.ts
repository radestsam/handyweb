import { ToolFailure } from "@handyweb/core/runtime";

/*
 * Time zones with the browser's Intl API. The offsets and the daylight
 * saving rules come from the time zone data inside the browser (IANA tzdata),
 * so an old browser can have old rules. For example, Iran stopped daylight
 * saving in 2022; a browser with older data still moves Tehran by an hour in
 * summer.
 */

export interface WallTime {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
}

const formatters = new Map<string, Intl.DateTimeFormat>();

function partsIn(utc: number, zone: string): WallTime {
    let format = formatters.get(zone);
    if (!format) {
        format = new Intl.DateTimeFormat("en-US", {
            timeZone: zone,
            hourCycle: "h23",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
        formatters.set(zone, format);
    }
    const parts = Object.fromEntries(
        format.formatToParts(new Date(utc)).map((part) => [part.type, part.value]),
    );
    return {
        year: Number(parts.year),
        month: Number(parts.month),
        day: Number(parts.day),
        hour: Number(parts.hour) % 24,
        minute: Number(parts.minute),
    };
}

const asUtc = (time: WallTime) =>
    Date.UTC(time.year, time.month - 1, time.day, time.hour, time.minute);

/** The offset of a zone from UTC at an instant, in minutes (Tehran is +210). */
export function offsetMinutes(utc: number, zone: string): number {
    return Math.round((asUtc(partsIn(utc, zone)) - Math.floor(utc / 60000) * 60000) / 60000);
}

export function checkZone(zone: string): void {
    try {
        new Intl.DateTimeFormat("en", { timeZone: zone });
    } catch {
        throw new ToolFailure(
            "invalid-input",
            { fa: "این منطقه زمانی شناخته نشد.", en: "This time zone is not known." },
            "zone",
        );
    }
}

export interface Instant {
    utc: number;
    /** The wall time does not exist in the zone (a daylight saving gap); the next valid time is used. */
    skipped: boolean;
}

/** The instant of a wall-clock time in a zone. */
export function zonedToUtc(time: WallTime, zone: string): Instant {
    checkZone(zone);
    const guess = asUtc(time);
    let utc = guess - offsetMinutes(guess, zone) * 60000;
    const second = guess - offsetMinutes(utc, zone) * 60000;
    if (second !== utc) utc = second;
    const back = partsIn(utc, zone);
    return { utc, skipped: back.hour !== time.hour || back.minute !== time.minute };
}

/** "UTC+03:30" */
export function formatOffset(minutes: number): string {
    const sign = minutes < 0 ? "-" : "+";
    const abs = Math.abs(minutes);
    return `UTC${sign}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
}

/** Reads "2026-03-20T12:30" from a datetime-local field. */
export function parseWallTime(text: string): WallTime {
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(text.trim());
    if (!match)
        throw new ToolFailure(
            "invalid-input",
            { fa: "تاریخ و ساعت را برگزینید.", en: "Choose a date and time." },
            "time",
        );
    return {
        year: Number(match[1]),
        month: Number(match[2]),
        day: Number(match[3]),
        hour: Number(match[4]),
        minute: Number(match[5]),
    };
}

export const DEFAULT_ZONES = [
    "Asia/Tehran",
    "UTC",
    "Europe/London",
    "Europe/Berlin",
    "Europe/Istanbul",
    "Asia/Dubai",
    "America/New_York",
    "America/Los_Angeles",
    "Asia/Tokyo",
    "Australia/Sydney",
];
