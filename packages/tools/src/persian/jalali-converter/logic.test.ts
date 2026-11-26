import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { convert, gregorianToJalali, jalaliToGregorian, parseDate, weekday } from "./logic";

const failure = (run: () => unknown): ToolFailure => {
    try {
        run();
    } catch (error) {
        if (error instanceof ToolFailure) return error;
        throw error;
    }
    throw new Error("Expected a ToolFailure");
};

describe("known dates", () => {
    it.each([
        // Nowruz 1404 was on 21 March 2025. Esfand 1403 had 30 days.
        [
            { year: 1404, month: 1, day: 1 },
            { year: 2025, month: 3, day: 21 },
        ],
        [
            { year: 1403, month: 12, day: 30 },
            { year: 2025, month: 3, day: 20 },
        ],
        [
            { year: 1403, month: 1, day: 1 },
            { year: 2024, month: 3, day: 20 },
        ],
        [
            { year: 1404, month: 9, day: 5 },
            { year: 2025, month: 11, day: 26 },
        ],
        [
            { year: 1357, month: 11, day: 22 },
            { year: 1979, month: 2, day: 11 },
        ],
        [
            { year: 1, month: 1, day: 1 },
            { year: 622, month: 3, day: 22 },
        ],
    ])("%j is %j", (jalali, gregorian) => {
        expect(jalaliToGregorian(jalali)).toEqual(gregorian);
        expect(gregorianToJalali(gregorian)).toEqual(jalali);
    });
});

describe("leap years", () => {
    it("accepts Esfand 30 in a Jalali leap year only", () => {
        expect(jalaliToGregorian({ year: 1399, month: 12, day: 30 })).toEqual({
            year: 2021,
            month: 3,
            day: 20,
        });
        expect(
            failure(() => jalaliToGregorian({ year: 1404, month: 12, day: 30 })).localized.en,
        ).toBe("Esfand 1404 has 29 days.");
    });

    it("follows the Gregorian century rule", () => {
        expect(gregorianToJalali({ year: 2024, month: 2, day: 29 })).toEqual({
            year: 1402,
            month: 12,
            day: 10,
        });
        expect(gregorianToJalali({ year: 2000, month: 2, day: 29 })).toEqual({
            year: 1378,
            month: 12,
            day: 10,
        });
        expect(
            failure(() => gregorianToJalali({ year: 2025, month: 2, day: 29 })).localized.en,
        ).toBe("February 2025 has 28 days.");
        expect(failure(() => gregorianToJalali({ year: 1900, month: 2, day: 29 })).code).toBe(
            "invalid-input",
        );
    });

    it("agrees with the Intl Persian calendar every day for 200 years", () => {
        const format = new Intl.DateTimeFormat("en-u-ca-persian-nu-latn", {
            timeZone: "UTC",
            year: "numeric",
            month: "numeric",
            day: "numeric",
        });
        const day = 86_400_000;
        for (let t = Date.UTC(1900, 0, 1); t < Date.UTC(2100, 0, 1); t += day) {
            const date = new Date(t);
            const gregorian = {
                year: date.getUTCFullYear(),
                month: date.getUTCMonth() + 1,
                day: date.getUTCDate(),
            };
            const parts = Object.fromEntries(
                format.formatToParts(date).map((p) => [p.type, p.value]),
            );
            const expected = {
                year: Number(parts["year"]),
                month: Number(parts["month"]),
                day: Number(parts["day"]),
            };
            const jalali = gregorianToJalali(gregorian);
            if (
                jalali.year !== expected.year ||
                jalali.month !== expected.month ||
                jalali.day !== expected.day
            ) {
                throw new Error(
                    `${JSON.stringify(gregorian)}: ${JSON.stringify(jalali)} != ${JSON.stringify(expected)}`,
                );
            }
            expect(jalaliToGregorian(jalali)).toEqual(gregorian);
        }
    });
});

describe("parseDate", () => {
    it("reads Persian, Arabic-Indic, and Latin digits with several separators", () => {
        expect(parseDate("۱۴۰۴/۰۹/۰۵")).toEqual({ year: 1404, month: 9, day: 5 });
        expect(parseDate("١٤٠٤-٩-٥")).toEqual({ year: 1404, month: 9, day: 5 });
        expect(parseDate(" 2025.11.26 ")).toEqual({ year: 2025, month: 11, day: 26 });
        expect(parseDate("2025 11 26")).toEqual({ year: 2025, month: 11, day: 26 });
    });

    it("rejects other shapes", () => {
        expect(failure(() => parseDate("26/11")).code).toBe("invalid-input");
        expect(failure(() => parseDate("tomorrow")).code).toBe("invalid-input");
    });
});

describe("ranges and weekdays", () => {
    it("rejects years outside the supported range and bad months", () => {
        expect(
            failure(() => jalaliToGregorian({ year: 3178, month: 1, day: 1 })).localized.en,
        ).toContain("1 to 3177");
        expect(failure(() => gregorianToJalali({ year: 600, month: 1, day: 1 })).code).toBe(
            "invalid-input",
        );
        expect(
            failure(() => jalaliToGregorian({ year: 1404, month: 13, day: 1 })).localized.en,
        ).toContain("1 to 12");
    });

    it("gives the weekday", () => {
        expect(weekday({ year: 2025, month: 11, day: 26 })).toBe(3); // Wednesday
        expect(convert("1404/1/1", "to-gregorian").weekday).toBe(5); // Friday, 21 March 2025
    });
});
