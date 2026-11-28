import { translations } from "@zxcvbn-ts/language-en";
import { describe, expect, it } from "vitest";
import { estimate } from "./estimator";
import { characterKinds, formatDuration, SUGGESTIONS, WARNINGS } from "./logic";

describe("password strength", () => {
    it("rates a common password as very weak, with a warning", () => {
        const summary = estimate("password");
        expect(summary.score).toBe(0);
        expect(summary.warning).toBe("topTen");
        expect(WARNINGS[summary.warning as string]).toBeDefined();
    });

    it("finds English words and names", () => {
        expect(estimate("jennifer").score).toBeLessThanOrEqual(1);
        expect(estimate("butterfly").score).toBeLessThanOrEqual(1);
    });

    it("rates a long random passphrase as strong", () => {
        expect(estimate("correct-violet-tugboat-mosaic-91").score).toBe(4);
    });

    it("has Persian and English text for every zxcvbn key", () => {
        expect(Object.keys(WARNINGS).sort()).toEqual(Object.keys(translations.warnings).sort());
        expect(Object.keys(SUGGESTIONS).sort()).toEqual(
            Object.keys(translations.suggestions).sort(),
        );
    });

    it("gives only known keys", () => {
        for (const password of [
            "qwertyuiop",
            "aaaaaa",
            "abcabcabc",
            "2024",
            "P@ssw0rd",
            "drowssap",
        ]) {
            const summary = estimate(password);
            if (summary.warning) expect(WARNINGS[summary.warning], summary.warning).toBeDefined();
            for (const key of summary.suggestions) expect(SUGGESTIONS[key], key).toBeDefined();
        }
    });

    it("lists the kinds of characters", () => {
        expect(characterKinds("Ab1!سلام")).toEqual({
            length: 8,
            lower: true,
            upper: true,
            digit: true,
            symbol: true,
            other: true,
        });
    });

    it("formats durations", () => {
        expect(formatDuration(0.5, "en")).toBe("less than a second");
        expect(formatDuration(1, "en")).toBe("1 second");
        expect(formatDuration(3 * 3600, "en")).toBe("3 hours");
        expect(formatDuration(2 * 86400, "fa")).toBe("۲ روز");
        expect(formatDuration(1e12, "en")).toBe("centuries");
    });
});
