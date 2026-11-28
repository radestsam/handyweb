import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { generateLorem } from "./logic";
import { LATIN_WORDS, PERSIAN_WORDS } from "./words";

describe("generateLorem", () => {
    it("makes the number of paragraphs asked for", () => {
        const text = generateLorem({
            language: "fa",
            unit: "paragraphs",
            count: 3,
            classicStart: false,
        });
        expect(text.split("\n\n")).toHaveLength(3);
    });

    it("makes the number of words asked for, from the list", () => {
        const words = generateLorem({
            language: "fa",
            unit: "words",
            count: 50,
            classicStart: false,
        }).split(" ");
        expect(words).toHaveLength(50);
        for (const word of words) expect(PERSIAN_WORDS).toContain(word);
    });

    it("makes the number of sentences asked for", () => {
        const text = generateLorem({
            language: "la",
            unit: "sentences",
            count: 4,
            classicStart: false,
        });
        expect(text.match(/\./g)).toHaveLength(4);
        expect(text.charAt(0)).toMatch(/[A-Z]/);
    });

    it("starts with Lorem ipsum when asked", () => {
        expect(
            generateLorem({ language: "la", unit: "paragraphs", count: 1, classicStart: true }),
        ).toMatch(/^Lorem ipsum dolor sit amet, consectetur adipiscing elit, [a-z]/);
        expect(generateLorem({ language: "la", unit: "words", count: 3, classicStart: true })).toBe(
            "Lorem ipsum dolor",
        );
        const words = generateLorem({
            language: "la",
            unit: "words",
            count: 20,
            classicStart: true,
        }).split(" ");
        expect(words).toHaveLength(20);
        for (const word of words.slice(8)) expect(LATIN_WORDS).toContain(word);
    });

    it("rejects a bad count", () => {
        expect(() =>
            generateLorem({ language: "fa", unit: "words", count: 0, classicStart: false }),
        ).toThrow(ToolFailure);
    });
});
