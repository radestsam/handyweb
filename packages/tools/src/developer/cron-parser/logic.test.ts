import { describe as group, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { describe, nextRuns, parseCron } from "./logic";

function detail(fn: () => unknown): string | undefined {
    try {
        fn();
    } catch (error) {
        if (error instanceof ToolFailure) return error.detail;
        throw error;
    }
    throw new Error("expected a ToolFailure");
}

group("parseCron", () => {
    it("reads lists, ranges, steps, and names", () => {
        const cron = parseCron("*/15 9-17/4 1,15 jan-mar mon-fri");
        expect(cron.minute.values).toEqual([0, 15, 30, 45]);
        expect(cron.hour.values).toEqual([9, 13, 17]);
        expect(cron.dayOfMonth.values).toEqual([1, 15]);
        expect(cron.month.values).toEqual([1, 2, 3]);
        expect(cron.dayOfWeek.values).toEqual([1, 2, 3, 4, 5]);
    });

    it("reads 7 as Sunday, a start with a step, and macros", () => {
        expect(parseCron("0 0 * * 7").dayOfWeek.values).toEqual([0]);
        expect(parseCron("5/20 * * * *").minute.values).toEqual([5, 25, 45]);
        expect(parseCron("@daily").hour.values).toEqual([0]);
    });

    it("rejects bad expressions", () => {
        expect(detail(() => parseCron("* * * *"))).toBe("fields");
        expect(detail(() => parseCron("60 * * * *"))).toBe("minute range");
        expect(detail(() => parseCron("* * * * foo"))).toBe("dayOfWeek foo");
        expect(detail(() => parseCron("*/0 * * * *"))).toBe("minute step");
        expect(detail(() => parseCron("* 5-1 * * *"))).toBe("hour range order");
    });
});

group("nextRuns", () => {
    const from = new Date(2026, 0, 1, 10, 7); // Thursday 1 January 2026, 10:07 local time

    it("finds the next minutes", () => {
        const runs = nextRuns(parseCron("*/15 * * * *"), from, 3);
        expect(runs.map((d) => `${d.getHours()}:${d.getMinutes()}`)).toEqual([
            "10:15",
            "10:30",
            "10:45",
        ]);
    });

    it("uses OR when both day fields are set", () => {
        const runs = nextRuns(parseCron("0 9 15 * mon"), from, 3);
        expect(runs.map((d) => d.getDate())).toEqual([5, 12, 15]);
    });

    it("finds February 29", () => {
        const runs = nextRuns(parseCron("0 0 29 2 *"), from, 1);
        expect(runs[0]?.getFullYear()).toBe(2028);
    });

    it("returns nothing for a day that never comes", () => {
        expect(nextRuns(parseCron("0 0 31 2 *"), from, 1)).toEqual([]);
    });
});

group("describe", () => {
    it("describes in English and Persian", () => {
        expect(describe(parseCron("30 9 * * 1-5"), "en")).toBe(
            "At 09:30, on Monday, Tuesday, Wednesday, Thursday and Friday.",
        );
        expect(describe(parseCron("*/10 * * * *"), "fa")).toBe("هر ۱۰ دقیقه.");
        expect(describe(parseCron("0 0 1 1 *"), "en")).toBe(
            "At 00:00, on day 1 of the month, in January.",
        );
        expect(describe(parseCron("* * * * *"), "en")).toBe("Every minute.");
    });
});
