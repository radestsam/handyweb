import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { decodeUrl, encodeUrl, type UrlOptions } from "./logic";

const component: UrlOptions = { scope: "component", plusForSpace: false };
const form: UrlOptions = { scope: "component", plusForSpace: true };
const full: UrlOptions = { scope: "full", plusForSpace: false };

function failure(run: () => unknown): ToolFailure {
    try {
        run();
    } catch (error) {
        if (error instanceof ToolFailure) return error;
        throw error;
    }
    throw new Error("expected a ToolFailure");
}

describe("encode", () => {
    it("returns an empty text for an empty input", () => {
        expect(encodeUrl("", component)).toBe("");
        expect(decodeUrl("", component)).toBe("");
    });

    it("component: matches encodeURIComponent", () => {
        const samples = ["a b&c=d/e?f#g", "سلام دنیا", "emoji 😀", "100% sure", "-_.!~*'()"];
        for (const sample of samples) {
            expect(encodeUrl(sample, component)).toBe(encodeURIComponent(sample));
        }
    });

    it("component: encodes Persian text and ZWNJ as UTF-8", () => {
        expect(encodeUrl("می‌روم", component)).toBe("%D9%85%DB%8C%E2%80%8C%D8%B1%D9%88%D9%85");
    });

    it("form: a space is +, and + is encoded", () => {
        expect(encodeUrl("a b+c", form)).toBe("a+b%2Bc");
    });

    it("full: keeps the URL structure", () => {
        expect(encodeUrl("https://fa.wikipedia.org/wiki/ایران?q=a b#top", full)).toBe(
            "https://fa.wikipedia.org/wiki/%D8%A7%DB%8C%D8%B1%D8%A7%D9%86?q=a%20b#top",
        );
        expect(encodeUrl("http://[::1]:8080/", full)).toBe("http://[::1]:8080/");
    });

    it("full: does not encode a valid escape twice, but encodes a lone %", () => {
        expect(encodeUrl("https://x.ir/a%20b/100%", full)).toBe("https://x.ir/a%20b/100%25");
    });

    it("rejects a lone surrogate with its position", () => {
        const error = failure(() => encodeUrl("ab\uD800c", component));
        expect(error.detail).toBe("position 3");
    });
});

describe("decode", () => {
    it("component: decodes every escape", () => {
        expect(decodeUrl("a%20b%26c%3Dd%2Fe", component)).toBe("a b&c=d/e");
        expect(decodeUrl("%D8%B3%D9%84%D8%A7%D9%85", component)).toBe("سلام");
        expect(decodeUrl("%f0%9f%98%80", component)).toBe("😀");
    });

    it("component: keeps + unless form decoding is on", () => {
        expect(decodeUrl("a+b", component)).toBe("a+b");
        expect(decodeUrl("a+b%2B", form)).toBe("a b+");
    });

    it("full: keeps escapes of URL structure characters, like decodeURI", () => {
        const url = "https://x.ir/a%2Fb%3Fc?q=%D8%A7%26%20x#%23";
        expect(decodeUrl(url, full)).toBe(decodeURI(url));
        expect(decodeUrl(url, full)).toBe("https://x.ir/a%2Fb%3Fc?q=ا%26 x#%23");
    });

    it("round-trips Persian, emoji, and symbols", () => {
        const text = "کتاب‌ها & 😀 / ۱۲۳ ?#";
        expect(decodeUrl(encodeUrl(text, component), component)).toBe(text);
        expect(decodeUrl(encodeUrl(text, form), form)).toBe(text);
    });

    it("rejects a broken escape with its position", () => {
        expect(failure(() => decodeUrl("abc%2", component)).detail).toBe("position 4");
        expect(failure(() => decodeUrl("a%zz", component)).detail).toBe("position 2");
    });

    it("rejects bytes that are not UTF-8", () => {
        expect(failure(() => decodeUrl("ok%FF", component)).detail).toBe("position 3");
        expect(failure(() => decodeUrl("%D8", component)).detail).toBe("position 1");
        expect(failure(() => decodeUrl("x%D8%41", component)).detail).toBe("position 2");
        // An encoded surrogate (CESU-8) is not valid UTF-8.
        expect(failure(() => decodeUrl("%ED%A0%80", component)).detail).toBe("position 1");
    });
});
