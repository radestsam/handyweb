import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { detectUnit, parseInput, relative } from "./logic";

function detail(fn: () => unknown): string | undefined {
    try {
        fn();
    } catch (error) {
        if (error instanceof ToolFailure) return error.detail;
        throw error;
    }
    throw new Error("expected a ToolFailure");
}

const ISO = (ms: number) => new Date(ms).toISOString();

describe("detectUnit", () => {
    it("tells seconds, milliseconds, microseconds, and nanoseconds apart", () => {
        expect(detectUnit(1_732_700_000)).toBe("s");
        expect(detectUnit(1_732_700_000_123)).toBe("ms");
        expect(detectUnit(1_732_700_000_123_456)).toBe("us");
        expect(detectUnit(1_732_700_000_123_456_789)).toBe("ns");
        expect(detectUnit(0)).toBe("s");
        expect(detectUnit(-86_400)).toBe("s");
    });
});

describe("parseInput timestamps", () => {
    it("reads each unit to the same time", () => {
        for (const text of [
            "1732700000",
            "1732700000000",
            "1732700000000000",
            "1732700000000000000",
        ]) {
            expect(ISO(parseInput(text, "auto", "utc").ms)).toBe("2024-11-27T09:33:20.000Z");
        }
    });

    it("accepts Persian digits, a sign, and a fraction", () => {
        expect(parseInput("۱۷۳۲۷۰۰۰۰۰", "auto", "utc").ms).toBe(1_732_700_000_000);
        expect(ISO(parseInput("-1", "auto", "utc").ms)).toBe("1969-12-31T23:59:59.000Z");
        expect(parseInput("1.5", "s", "utc").ms).toBe(1500);
    });

    it("uses a chosen unit", () => {
        expect(parseInput("1732700000", "ms", "utc")).toMatchObject({
            ms: 1_732_700_000,
            unit: "ms",
        });
    });

    it("rejects a time outside the Date range", () => {
        expect(detail(() => parseInput("9000000000000000", "ms", "utc"))).toBe("range");
    });
});

describe("parseInput dates", () => {
    it("reads Gregorian dates in UTC", () => {
        expect(ISO(parseInput("2025-11-27", "auto", "utc").ms)).toBe("2025-11-27T00:00:00.000Z");
        expect(ISO(parseInput("2025/11/27 10:30:15.5", "auto", "utc").ms)).toBe(
            "2025-11-27T10:30:15.500Z",
        );
    });

    it("reads Jalali dates with Persian digits", () => {
        expect(parseInput("۱۴۰۴/۰۹/۰۶ ۱۰:۳۰", "auto", "utc")).toMatchObject({
            ms: Date.UTC(2025, 10, 27, 10, 30),
            jalali: true,
        });
        expect(ISO(parseInput("1403/12/30", "auto", "utc").ms)).toBe("2025-03-20T00:00:00.000Z");
    });

    it("reads ISO 8601 with a zone", () => {
        expect(parseInput("2025-11-27T10:00:00+03:30", "auto", "local").ms).toBe(
            Date.UTC(2025, 10, 27, 6, 30),
        );
        expect(parseInput("2025-11-27T10:00:00Z", "auto", "local").ms).toBe(
            Date.UTC(2025, 10, 27, 10),
        );
    });

    it("reads a local date with the local zone", () => {
        expect(parseInput("2025-11-27 10:00", "auto", "local").ms).toBe(
            new Date(2025, 10, 27, 10, 0).getTime(),
        );
    });

    it("rejects impossible dates and unknown text", () => {
        expect(detail(() => parseInput("2025-02-29", "auto", "utc"))).toBe("day");
        expect(detail(() => parseInput("2025-13-01", "auto", "utc"))).toBe("date");
        expect(detail(() => parseInput("1404/12/30", "auto", "utc"))).toBeUndefined();
        expect(detail(() => parseInput("yesterday", "auto", "utc"))).toBe("format");
        expect(detail(() => parseInput("  ", "auto", "utc"))).toBe("empty");
    });
});

describe("relative", () => {
    it("picks the largest whole unit", () => {
        const now = Date.UTC(2025, 0, 10);
        expect(relative(now - 3 * 86_400_000, now)).toEqual({ value: -3, unit: "day" });
        expect(relative(now + 2 * 3_600_000, now)).toEqual({ value: 2, unit: "hour" });
        expect(relative(now - 400 * 86_400_000, now)).toEqual({ value: -1, unit: "year" });
        expect(relative(now + 5000, now)).toEqual({ value: 5, unit: "second" });
    });
});
