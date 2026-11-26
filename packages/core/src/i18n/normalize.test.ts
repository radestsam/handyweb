import { describe, expect, it } from "vitest";
import { normalizeForSearch as n } from "./normalize";

describe("normalizeForSearch", () => {
    it("maps Arabic yeh and kaf to the Persian letters", () => {
        expect(n("تاريخ")).toBe(n("تاریخ"));
        expect(n("كلمه")).toBe(n("کلمه"));
        expect(n("ى")).toBe("ی");
    });

    it("removes ZWNJ, so a query without it still matches", () => {
        expect(n("می‌شود")).toBe("میشود");
        expect(n("نیم‌فاصله")).toBe(n("نیمفاصله"));
    });

    it("removes tatweel and diacritics", () => {
        expect(n("کـــتاب")).toBe("کتاب");
        expect(n("کِتَاب")).toBe("کتاب");
    });

    it("folds Persian and Arabic-Indic digits to Latin digits", () => {
        expect(n("بیس۶۴")).toBe("بیس64");
        expect(n("٠١٢٣٤٥٦٧٨٩")).toBe("0123456789");
        expect(n("۰۱۲۳۴۵۶۷۸۹")).toBe("0123456789");
    });

    it("folds Arabic presentation forms with NFKC", () => {
        // U+FEEA ARABIC LETTER HEH FINAL FORM
        expect(n("ﻪ")).toBe("ه");
    });

    it("lowercases Latin and collapses spaces", () => {
        expect(n("  Base64   Encoder ")).toBe("base64 encoder");
        expect(n("SHA-256")).toBe("sha-256");
    });

    it("removes bidi controls", () => {
        expect(n("⁧abc⁩‏")).toBe("abc");
    });

    it("keeps an empty string empty", () => {
        expect(n("")).toBe("");
    });
});
