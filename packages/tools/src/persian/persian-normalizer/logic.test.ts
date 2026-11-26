import { describe, expect, it } from "vitest";
import { convertDigits, DEFAULT_OPTIONS, normalizePersian, type NormalizeOptions } from "./logic";

const only = (rule: Partial<NormalizeOptions>): NormalizeOptions => ({
    arabicLetters: false,
    tehMarbuta: false,
    presentationForms: false,
    tatweel: false,
    diacritics: false,
    zwnj: false,
    digits: "keep",
    punctuationSpacing: false,
    ...rule,
});

describe("each rule alone", () => {
    it("arabicLetters: Arabic yeh, alef maksura, and kaf", () => {
        expect(normalizePersian("علي كتاب مستشفى", only({ arabicLetters: true }))).toEqual({
            text: "علی کتاب مستشفی",
            counts: { arabicLetters: 3 },
        });
    });

    it("tehMarbuta: off by default, converts when on", () => {
        expect(normalizePersian("مدرسة").text).toBe("مدرسة");
        expect(normalizePersian("مدرسة", only({ tehMarbuta: true })).text).toBe("مدرسه");
    });

    it("presentationForms: folds isolated and final forms, keeps the BOM", () => {
        // U+FEEA HEH FINAL FORM, U+FEF4 YEH MEDIAL FORM
        expect(normalizePersian("﻿ﻪﻴ", only({ presentationForms: true })).text).toBe("﻿هي");
    });

    it("tatweel and diacritics", () => {
        expect(normalizePersian("کـــتاب", only({ tatweel: true })).text).toBe("کتاب");
        expect(normalizePersian("کِتَاب", only({ diacritics: true })).text).toBe("کتاب");
    });

    it("zwnj: keeps a correct ZWNJ and removes useless ones", () => {
        expect(normalizePersian("می‌روم", only({ zwnj: true }))).toEqual({
            text: "می‌روم",
            counts: {},
        });
        expect(normalizePersian("می‌‌روم", only({ zwnj: true })).text).toBe("می‌روم");
        expect(normalizePersian("کتاب‌ ها ‌را‌", only({ zwnj: true })).text).toBe("کتاب ها را");
    });

    it("punctuationSpacing: fixes Persian punctuation only", () => {
        const options = only({ punctuationSpacing: true });
        expect(normalizePersian("سلام ، خوبی ؟", options).text).toBe("سلام، خوبی؟");
        expect(normalizePersian("سلام،خوبی", options).text).toBe("سلام، خوبی");
        expect(normalizePersian("a : b and 3.14", options).text).toBe("a : b and 3.14");
    });
});

describe("digits", () => {
    it("arabic-to-persian changes Arabic-Indic digits only", () => {
        expect(convertDigits("١٢٣ 123 ۱۲۳", "arabic-to-persian")).toEqual(["۱۲۳ 123 ۱۲۳", 3]);
    });

    it("to-persian and to-latin convert every digit system", () => {
        expect(convertDigits("0-9 ٠ ۵", "to-persian")[0]).toBe("۰-۹ ۰ ۵");
        expect(convertDigits("۰۱۲۳۴۵۶۷۸۹ ٠١٢٣٤٥٦٧٨٩", "to-latin")[0]).toBe("0123456789 0123456789");
    });

    it("keep leaves code-like content untouched", () => {
        const code = "const x = 0x1F; // ١";
        expect(
            normalizePersian(code, { ...DEFAULT_OPTIONS, digits: "keep", arabicLetters: false })
                .text,
        ).toBe(code);
    });
});

describe("defaults", () => {
    it("fix the common problems and report a count per rule", () => {
        const result = normalizePersian("كتابـــهاي ١٢ ساله");
        expect(result.text).toBe("کتابهای ۱۲ ساله");
        expect(result.counts).toEqual({ arabicLetters: 2, tatweel: 3, digits: 2 });
    });

    it("leave Latin text and mixed content alone", () => {
        const mixed = "HandyWeb یک ابزار است: https://handyweb.ir/fa/";
        expect(normalizePersian(mixed).text).toBe(mixed);
    });

    it("keep an empty string empty", () => {
        expect(normalizePersian("")).toEqual({ text: "", counts: {} });
    });
});
