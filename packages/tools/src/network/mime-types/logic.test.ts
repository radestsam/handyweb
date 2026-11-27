import { describe, expect, it } from "vitest";
import { DATASET, searchMime } from "./logic";

describe("MIME data", () => {
    it("has unique, well-formed types in both languages", () => {
        const types = DATASET.entries.map((entry) => entry.type);
        expect(new Set(types).size).toBe(types.length);
        for (const entry of DATASET.entries) {
            expect(entry.type).toMatch(/^[a-z]+\/[a-z0-9.+-]+$/);
            expect(entry.description.fa && entry.description.en).toBeTruthy();
            for (const extension of entry.extensions) expect(extension).toMatch(/^[a-z0-9]+$/);
        }
    });

    it("finds by extension, file name, type, and words", () => {
        expect(searchMime(".jpg").map((e) => e.type)).toEqual(["image/jpeg"]);
        expect(searchMime("report.DOCX")[0]?.type).toBe(
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        );
        expect(searchMime("font/").map((e) => e.type)).toContain("font/woff2");
        expect(searchMime("ورد").length).toBeGreaterThan(0);
        expect(searchMime("xml").map((e) => e.type)).toEqual(["text/xml", "application/xml"]);
    });
});
