import { describe, expect, it } from "vitest";
import { formatOffset, offsetMinutes, parseWallTime, zonedToUtc } from "./logic";

describe("time zones", () => {
    it("reads the Tehran offset (no daylight saving since 2022)", () => {
        expect(offsetMinutes(Date.UTC(2026, 6, 1), "Asia/Tehran")).toBe(210);
        expect(offsetMinutes(Date.UTC(2026, 0, 1), "Asia/Tehran")).toBe(210);
        expect(formatOffset(210)).toBe("UTC+03:30");
        expect(formatOffset(-300)).toBe("UTC-05:00");
    });

    it("turns a wall time in a zone into UTC", () => {
        const noon = zonedToUtc(
            { year: 2026, month: 3, day: 21, hour: 12, minute: 0 },
            "Asia/Tehran",
        );
        expect(new Date(noon.utc).toISOString()).toBe("2026-03-21T08:30:00.000Z");
        expect(noon.skipped).toBe(false);
        // New York in summer is UTC-4.
        const ny = zonedToUtc(
            { year: 2026, month: 7, day: 1, hour: 9, minute: 0 },
            "America/New_York",
        );
        expect(new Date(ny.utc).toISOString()).toBe("2026-07-01T13:00:00.000Z");
    });

    it("marks a time that a daylight saving change skips", () => {
        // In 2026, clocks in New York jump from 02:00 to 03:00 on 8 March.
        expect(
            zonedToUtc({ year: 2026, month: 3, day: 8, hour: 2, minute: 30 }, "America/New_York")
                .skipped,
        ).toBe(true);
    });

    it("reads a datetime-local value and refuses an unknown zone", () => {
        expect(parseWallTime("2026-03-20T12:30")).toEqual({
            year: 2026,
            month: 3,
            day: 20,
            hour: 12,
            minute: 30,
        });
        expect(() =>
            zonedToUtc({ year: 2026, month: 1, day: 1, hour: 0, minute: 0 }, "Mars/Base"),
        ).toThrow(/not known/);
    });
});
