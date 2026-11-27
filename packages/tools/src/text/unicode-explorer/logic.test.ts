import { describe, expect, it } from "vitest";
import { inspectChar, inspectText, toTsv } from "./logic";
import { NAME_BLOCKS } from "./names";

describe("inspectChar", () => {
    it("describes a Persian letter", () => {
        expect(inspectChar("ی")).toEqual({
            char: "ی",
            code: 0x06cc,
            label: "U+06CC",
            name: "ARABIC LETTER FARSI YEH",
            block: "Arabic",
            category: "Lo",
            group: "letter",
            script: "Arabic",
            utf8: "DB 8C",
            utf16: "06CC",
            invisible: false,
        });
    });

    it("tells Arabic yeh and kaf from the Persian letters", () => {
        expect(inspectChar("ي").name).toBe("ARABIC LETTER YEH");
        expect(inspectChar("ك").name).toBe("ARABIC LETTER KAF");
        expect(inspectChar("ک").name).toBe("ARABIC LETTER KEHEH");
    });

    it("marks ZWNJ and RLM as invisible format characters", () => {
        const zwnj = inspectChar(String.fromCodePoint(0x200c));
        expect(zwnj).toMatchObject({
            name: "ZERO WIDTH NON-JOINER",
            category: "Cf",
            group: "format",
            script: "Inherited",
            invisible: true,
        });
        expect(inspectChar(String.fromCodePoint(0x200f)).name).toBe("RIGHT-TO-LEFT MARK");
    });

    it("describes an emoji outside the BMP", () => {
        expect(inspectChar("😀")).toMatchObject({
            label: "U+1F600",
            name: "GRINNING FACE",
            category: "So",
            utf8: "F0 9F 98 80",
            utf16: "D83D DE00",
        });
    });

    it("names Persian digits and diacritics", () => {
        expect(inspectChar("۴")).toMatchObject({
            name: "EXTENDED ARABIC-INDIC DIGIT FOUR",
            category: "Nd",
        });
        expect(inspectChar("\u064E")).toMatchObject({ name: "ARABIC FATHA", group: "mark" });
    });

    it("names controls by their common alias", () => {
        expect(inspectChar("\n")).toMatchObject({
            name: "LINE FEED",
            group: "control",
            invisible: true,
        });
    });

    it("names CJK ideographs by rule, and leaves other names empty", () => {
        expect(inspectChar("中").name).toBe("CJK UNIFIED IDEOGRAPH-4E2D");
        expect(inspectChar("ж")).toMatchObject({ name: "", block: "", script: "Cyrillic" });
    });

    it("handles a lone surrogate and an unassigned code point", () => {
        expect(inspectChar("\uD800")).toMatchObject({
            group: "surrogate",
            utf8: "",
            utf16: "D800",
        });
        expect(inspectChar(String.fromCodePoint(0x0378))).toMatchObject({
            category: "Cn",
            group: "unassigned",
        });
    });
});

describe("inspectText", () => {
    it("counts code points, graphemes, and bytes", () => {
        const result = inspectText("می\u200Cروم 👨‍👩‍👧");
        expect(result.codePoints).toBe(12);
        expect(result.graphemes).toBe(7);
        expect(result.utf16Units).toBe(15);
        expect(result.utf8Bytes).toBe(32);
        expect(result.truncated).toBe(false);
    });

    it("limits the rows but not the counts", () => {
        const result = inspectText("abcdef", 4);
        expect(result.rows).toHaveLength(4);
        expect(result.codePoints).toBe(6);
        expect(result.truncated).toBe(true);
    });

    it("returns nothing for an empty text", () => {
        expect(inspectText("")).toMatchObject({ rows: [], codePoints: 0, graphemes: 0 });
    });
});

describe("toTsv", () => {
    it("writes a header and one line per row, without invisible characters", () => {
        expect(toTsv(inspectText("س\u200C").rows)).toBe(
            [
                "Character\tCode point\tName\tCategory\tScript\tUTF-8\tUTF-16",
                "س\tU+0633\tARABIC LETTER SEEN\tLo\tArabic\tD8 B3\t0633",
                "\tU+200C\tZERO WIDTH NON-JOINER\tCf\tInherited\tE2 80 8C\t200C",
            ].join("\n"),
        );
    });
});

describe("name table", () => {
    it("has blocks in order without overlap", () => {
        let end = -1;
        for (const [start, , names] of NAME_BLOCKS) {
            expect(start).toBeGreaterThan(end);
            end = start + names.split("|").length - 1;
        }
    });
});
