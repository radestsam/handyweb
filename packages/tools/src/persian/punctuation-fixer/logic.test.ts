import { describe, expect, it } from "vitest";
import { DEFAULT_OPTIONS, fixPunctuation, type PunctuationOptions } from "./logic";

const only = (rule: keyof PunctuationOptions): PunctuationOptions => ({
    marks: false,
    quotes: false,
    spacing: false,
    brackets: false,
    ellipsis: false,
    [rule]: true,
});

describe("fixPunctuation", () => {
    it("changes Latin marks after Persian words", () => {
        expect(fixPunctuation("سلام, خوبی? بله; ممنون", only("marks"))).toEqual({
            text: "سلام، خوبی؟ بله؛ ممنون",
            counts: { marks: 3 },
        });
    });

    it("keeps Latin marks in English, numbers, and code", () => {
        const text = "Hello, world? a;b 1,000 f(x, y)";
        expect(fixPunctuation(text)).toEqual({ text, counts: {} });
    });

    it("changes quotes around Persian text only", () => {
        expect(fixPunctuation('او گفت "سلام" و "hello"', only("quotes")).text).toBe(
            'او گفت «سلام» و "hello"',
        );
    });

    it("fixes the spaces around marks", () => {
        expect(fixPunctuation("سلام ، خوبی ؟بله.ممنون", only("spacing")).text).toBe(
            "سلام، خوبی؟ بله. ممنون",
        );
        expect(fixPunctuation("عدد ۳.۵ است", only("spacing")).text).toBe("عدد ۳.۵ است");
    });

    it("removes spaces inside brackets", () => {
        expect(fixPunctuation("( سلام ) و « دنیا »", only("brackets")).text).toBe(
            "(سلام) و «دنیا»",
        );
    });

    it("can change three dots to an ellipsis", () => {
        expect(fixPunctuation("صبر کن...", only("ellipsis")).text).toBe("صبر کن…");
        expect(fixPunctuation("صبر کن...").text).toBe("صبر کن...");
    });

    it("fixes a full sentence with the default rules", () => {
        expect(fixPunctuation('او پرسید : "کجا می‌روی ?"', DEFAULT_OPTIONS).text).toBe(
            "او پرسید: «کجا می‌روی؟»",
        );
    });
});
