import { describe, expect, it } from "vitest";
import { DATASET, searchStatus } from "./logic";

describe("HTTP status data", () => {
    it("is sorted, unique, and complete in both languages", () => {
        const codes = DATASET.entries.map((entry) => entry.code);
        expect(codes).toEqual([...codes].sort((a, b) => a - b));
        expect(new Set(codes).size).toBe(codes.length);
        for (const entry of DATASET.entries) {
            expect(entry.code).toBeGreaterThanOrEqual(100);
            expect(entry.code).toBeLessThan(600);
            expect(
                entry.name.fa && entry.name.en && entry.description.fa && entry.description.en,
            ).toBeTruthy();
            expect(entry.reference).toMatch(/^RFC \d+$/);
        }
        expect(DATASET.version).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("finds by code, prefix, and words", () => {
        expect(searchStatus("404").map((s) => s.code)).toEqual([404]);
        expect(searchStatus("۴۰").every((s) => String(s.code).startsWith("40"))).toBe(true);
        expect(searchStatus("rate limit").map((s) => s.code)).toEqual([429]);
        expect(searchStatus("پیدا نشد").map((s) => s.code)).toContain(404);
        expect(searchStatus("")).toHaveLength(DATASET.entries.length);
    });
});
