import { describe, expect, it } from "vitest";
import {
    countLines,
    countParagraphs,
    countSentences,
    countWords,
    readingSeconds,
    textStats,
} from "./logic";

describe("empty and blank input", () => {
    it("counts nothing in an empty text", () => {
        expect(textStats("")).toEqual({
            characters: 0,
            charactersNoSpaces: 0,
            words: 0,
            lines: 0,
            paragraphs: 0,
            sentences: 0,
        });
    });

    it("counts whitespace as characters but not as words", () => {
        expect(textStats("  \n\t")).toEqual({
            characters: 4,
            charactersNoSpaces: 0,
            words: 0,
            lines: 2,
            paragraphs: 0,
            sentences: 0,
        });
    });
});

describe("characters", () => {
    it("counts a Persian letter with a diacritic as one character", () => {
        expect(textStats("کِتاب").characters).toBe(4);
    });

    it("counts an emoji sequence as one character", () => {
        expect(textStats("👨‍👩‍👧 ok").characters).toBe(4);
        expect(textStats("👨‍👩‍👧 ok").charactersNoSpaces).toBe(3);
    });

    it("counts CRLF as one character", () => {
        expect(textStats("a\r\nb").characters).toBe(3);
    });
});

describe("words", () => {
    it("counts English and Persian words", () => {
        expect(countWords("Hello, world!")).toBe(2);
        expect(countWords("سلام، دنیا!")).toBe(2);
        expect(countWords("کتاب و book")).toBe(3);
    });

    it("keeps a word with ZWNJ as one word", () => {
        expect(countWords("می‌روم به کتاب‌خانه")).toBe(3);
        expect(countWords("کتاب‌ها")).toBe(1);
    });

    it("counts words that a space separates, even with a stray ZWNJ", () => {
        expect(countWords("می‌ روم")).toBe(2);
        expect(countWords("کتاب ‌ها")).toBe(2);
    });

    it("keeps tatweel and diacritics inside the word", () => {
        expect(countWords("کـــتاب کِتَاب")).toBe(2);
    });

    it("joins apostrophes and hyphens", () => {
        expect(countWords("don't stop well-known it’s")).toBe(4);
        expect(countWords("a - b")).toBe(2);
    });

    it("keeps numbers with separators as one word", () => {
        expect(countWords("3.14 1,000 ۱٬۰۰۰ ۳٫۱۴ ۱۴۰۴/۰۹/۰۵")).toBe(5);
    });

    it("splits at punctuation that is not between digits", () => {
        expect(countWords("end.Next a/b x,y")).toBe(6);
    });

    it("does not count symbols and punctuation alone", () => {
        expect(countWords("— ... ؟ !! # @ 👍")).toBe(0);
    });
});

describe("lines", () => {
    it("ignores one final line break", () => {
        expect(countLines("a")).toBe(1);
        expect(countLines("a\n")).toBe(1);
        expect(countLines("a\n\n")).toBe(2);
    });

    it("accepts LF, CRLF, and CR", () => {
        expect(countLines("a\nb\r\nc\rd")).toBe(4);
    });
});

describe("paragraphs", () => {
    it("splits at one or more empty lines", () => {
        expect(countParagraphs("one\ntwo\n\nthree\n \n\n four")).toBe(3);
    });

    it("does not count a block without letters or digits", () => {
        expect(countParagraphs("text\n\n---\n\nmore")).toBe(2);
    });
});

describe("sentences", () => {
    it("counts English and Persian end marks", () => {
        expect(countSentences("One. Two! Three?")).toBe(3);
        expect(countSentences("سلام. حالت چطور است؟ خوبم!")).toBe(3);
    });

    it("counts a final part without an end mark", () => {
        expect(countSentences("First. Second")).toBe(2);
        expect(countSentences("بدون نشانه")).toBe(1);
    });

    it("does not end a sentence inside a number", () => {
        expect(countSentences("Pi is 3.14 today.")).toBe(1);
    });

    it("counts repeated marks and closing quotes once", () => {
        expect(countSentences('Wait... "Really?!" Yes.')).toBe(3);
        expect(countSentences("گفت: «برو.» رفتم.")).toBe(2);
    });

    it("ends a sentence at an empty line", () => {
        expect(countSentences("Title\n\nBody text.")).toBe(2);
    });

    it("counts an abbreviation as an end (documented)", () => {
        expect(countSentences("Use e.g. this.")).toBe(2);
    });
});

describe("reading time", () => {
    it("rounds up to whole seconds", () => {
        expect(readingSeconds(0, 200)).toBe(0);
        expect(readingSeconds(1, 200)).toBe(1);
        expect(readingSeconds(200, 200)).toBe(60);
        expect(readingSeconds(500, 200)).toBe(150);
    });

    it("keeps the rate inside the allowed range", () => {
        expect(readingSeconds(100, 0)).toBe(120);
        expect(readingSeconds(100, Number.NaN)).toBe(120);
        expect(readingSeconds(1000, 5000)).toBe(60);
    });
});
