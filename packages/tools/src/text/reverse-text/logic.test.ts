import { describe, expect, it } from "vitest";
import { reverseText } from "./logic";

describe("reverseText", () => {
    it("reverses characters on each line", () => {
        expect(reverseText("abc\nxyz", "characters")).toBe("cba\nzyx");
        expect(reverseText("", "characters")).toBe("");
    });

    it("keeps emoji and letters with diacritics whole", () => {
        expect(reverseText("a👨‍👩‍👧b", "characters")).toBe("b👨‍👩‍👧a");
        expect(reverseText("کِتاب", "characters")).toBe("باتکِ");
    });

    it("reverses the words of each line and keeps the spaces", () => {
        expect(reverseText("one two  three", "words")).toBe("three two  one");
        expect(reverseText("می‌روم به خانه\nhello world", "words")).toBe(
            "خانه به می‌روم\nworld hello",
        );
    });

    it("reverses the order of the lines and keeps the final line break", () => {
        expect(reverseText("1\n2\n3\n", "lines")).toBe("3\n2\n1\n");
        expect(reverseText("a\r\nb", "lines")).toBe("b\r\na");
    });
});
