import { describe, expect, it } from "vitest";
import { convertCase } from "./logic";

const title = (text: string) => convertCase(text, "title");
const sentence = (text: string) => convertCase(text, "sentence");

describe("upper and lower case", () => {
    it("converts Latin letters", () => {
        expect(convertCase("Hello World", "upper")).toBe("HELLO WORLD");
        expect(convertCase("Hello World", "lower")).toBe("hello world");
    });

    it("does not use the Turkish dotted i", () => {
        expect(convertCase("istanbul", "upper")).toBe("ISTANBUL");
        expect(convertCase("ISTANBUL", "lower")).toBe("istanbul");
    });

    it("converts other cased scripts", () => {
        expect(convertCase("straße", "upper")).toBe("STRASSE");
        expect(convertCase("ΑΘΗΝΑ", "lower")).toBe("αθηνα");
        expect(convertCase("привет", "upper")).toBe("ПРИВЕТ");
    });

    it("keeps Persian text, digits, and an empty input as they are", () => {
        expect(convertCase("", "upper")).toBe("");
        expect(convertCase("سلام ۱۲۳ hello", "upper")).toBe("سلام ۱۲۳ HELLO");
        expect(title("سلام دنیا")).toBe("سلام دنیا");
        expect(sentence("سلام دنیا")).toBe("سلام دنیا");
    });
});

describe("title case (Chicago)", () => {
    it("lowercases articles, conjunctions, and prepositions inside the title", () => {
        expect(title("the lord of the rings")).toBe("The Lord of the Rings");
        expect(title("a tale of two cities and more")).toBe("A Tale of Two Cities and More");
        expect(title("how to win friends")).toBe("How to Win Friends");
    });

    it("capitalizes the first and the last word", () => {
        expect(title("what are you looking for")).toBe("What Are You Looking For");
        expect(title("of mice and men")).toBe("Of Mice and Men");
    });

    it("capitalizes phrasal-verb particles", () => {
        expect(title("how to set up a server")).toBe("How to Set Up a Server");
        expect(title("log out of the app")).toBe("Log Out of the App");
    });

    it("starts a new part after a colon or a dash", () => {
        expect(title("star wars: a new hope")).toBe("Star Wars: A New Hope");
        expect(title("persian tools — a guide")).toBe("Persian Tools — A Guide");
    });

    it("applies the rule to each part of a hyphenated compound", () => {
        expect(title("a step-by-step guide")).toBe("A Step-by-Step Guide");
        expect(title("well-known facts")).toBe("Well-Known Facts");
    });

    it("keeps words with inner capitals", () => {
        expect(title("using NASA data on an iPhone")).toBe("Using NASA Data on an iPhone");
    });

    it("lowercases an all-caps input first", () => {
        expect(title("THE LORD OF THE RINGS")).toBe("The Lord of the Rings");
    });

    it("keeps apostrophes inside a word", () => {
        expect(title("don't stop me now")).toBe("Don't Stop Me Now");
        expect(title("it’s a man’s world")).toBe("It’s a Man’s World");
    });

    it("converts each line on its own", () => {
        expect(title("first of all\nlast of the line\r\n")).toBe(
            "First of All\nLast of the Line\r\n",
        );
    });

    it("works next to Persian words", () => {
        expect(title("کتاب the art of war")).toBe("کتاب The Art of War");
    });
});

describe("sentence case", () => {
    it("capitalizes the first word of each sentence", () => {
        expect(sentence("HELLO THERE. HOW ARE YOU? FINE!")).toBe("Hello there. How are you? Fine!");
        expect(sentence("This Is A Title Case Text.")).toBe("This is a title case text.");
    });

    it("capitalizes the first word of each line and the pronoun I", () => {
        expect(sentence("first line\nsecond line and i think i'm right")).toBe(
            "First line\nSecond line and I think I'm right",
        );
    });

    it("keeps words with inner capitals", () => {
        expect(sentence("Read The NASA Report On Your iPhone.")).toBe(
            "Read the NASA report on your iPhone.",
        );
    });

    it("does not start a sentence inside a number", () => {
        expect(sentence("pi is 3.14 today")).toBe("Pi is 3.14 today");
    });

    it("starts a sentence after an abbreviation (documented)", () => {
        expect(sentence("use e.g. this")).toBe("Use e.g. This");
    });

    it("starts a sentence after a Persian part", () => {
        expect(sentence("سلام. hello there")).toBe("سلام. Hello there");
    });

    it("starts a sentence after a closing quote", () => {
        expect(sentence('he said "stop." then left')).toBe('He said "stop." Then left');
    });
});
