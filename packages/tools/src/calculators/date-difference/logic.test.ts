import { describe, expect, it } from "vitest";
import { addDays, difference, readDate } from "./logic";

describe("date difference", () => {
    it("counts days, years, months, and days in the Gregorian calendar", () => {
        const d = difference(
            { year: 2024, month: 1, day: 31 },
            { year: 2025, month: 3, day: 1 },
            "gregorian",
        );
        expect(d.days).toBe(395);
        expect([d.years, d.months, d.remainingDays]).toEqual([1, 1, 1]);
        expect([d.weeks, d.weekDays]).toEqual([56, 3]);
    });

    it("works in the Jalali calendar, including Esfand of a leap year", () => {
        // 1403 is a leap year: Esfand has 30 days.
        expect(
            difference(
                { year: 1403, month: 12, day: 1 },
                { year: 1404, month: 1, day: 1 },
                "jalali",
            ).days,
        ).toBe(30);
        const d = difference(
            { year: 1400, month: 1, day: 1 },
            { year: 1404, month: 9, day: 5 },
            "jalali",
        );
        expect([d.years, d.months, d.remainingDays]).toEqual([4, 8, 4]);
    });

    it("gives a negative count when the second date is earlier", () => {
        const d = difference(
            { year: 2025, month: 1, day: 10 },
            { year: 2025, month: 1, day: 1 },
            "gregorian",
        );
        expect(d.days).toBe(-9);
        expect(d.remainingDays).toBe(9);
    });

    it("counts days that are not Fridays", () => {
        // 2025-11-21 is a Friday. From Thursday 20 to Saturday 22: 3 days, 1 Friday.
        expect(
            difference(
                { year: 2025, month: 11, day: 20 },
                { year: 2025, month: 11, day: 22 },
                "gregorian",
            ).nonFridays,
        ).toBe(2);
    });

    it("adds days and checks dates", () => {
        expect(addDays({ year: 1404, month: 12, day: 29 }, 1, "jalali")).toEqual({
            year: 1405,
            month: 1,
            day: 1,
        });
        expect(addDays({ year: 2024, month: 3, day: 1 }, -1, "gregorian")).toEqual({
            year: 2024,
            month: 2,
            day: 29,
        });
        expect(() => readDate("1404/07/31", "jalali")).toThrow(/not in this month/);
        expect(readDate("۱۴۰۴/۰۶/۳۱", "jalali")).toEqual({ year: 1404, month: 6, day: 31 });
    });
});
