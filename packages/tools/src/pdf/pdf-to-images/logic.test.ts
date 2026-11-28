import { describe, expect, it } from "vitest";
import { pageName, parsePages, zipName } from "./logic";

describe("pdf to images", () => {
    it("reads page lists", () => {
        expect(parsePages("", 3)).toEqual([1, 2, 3]);
        expect(parsePages("1-3, 5", 6)).toEqual([1, 2, 3, 5]);
        expect(parsePages("8-", 10)).toEqual([8, 9, 10]);
        expect(parsePages("-2", 10)).toEqual([1, 2]);
        expect(parsePages("3, 1, 3", 5)).toEqual([1, 3]);
        expect(parsePages("۲–۴، ۶", 6)).toEqual([2, 3, 4, 6]);
    });

    it("rejects bad page lists", () => {
        expect(() => parsePages("0", 3)).toThrow();
        expect(() => parsePages("4", 3)).toThrow();
        expect(() => parsePages("3-1", 3)).toThrow();
        expect(() => parsePages("a", 3)).toThrow();
        expect(() => parsePages("-", 3)).toThrow();
        expect(() => parsePages(",", 3)).toThrow();
    });

    it("names the files", () => {
        expect(pageName("Report.pdf", 3, 120, "png")).toBe("Report-page-003.png");
        expect(pageName("a.PDF", 1, 1, "jpg")).toBe("a-page-1.jpg");
        expect(zipName("Report.pdf")).toBe("Report-pages.zip");
        expect(zipName("")).toBe("document-pages.zip");
    });
});
