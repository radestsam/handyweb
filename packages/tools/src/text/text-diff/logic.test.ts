import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { compareTexts, MAX_CHAR_INPUT, type DiffInput } from "./logic";

const base: DiffInput = {
    original: "",
    changed: "",
    granularity: "lines",
    ignoreWhitespace: false,
    ignoreCase: false,
};
const run = (input: Partial<DiffInput>) => compareTexts({ ...base, ...input });

describe("lines", () => {
    it("finds added and removed lines", () => {
        const result = run({ original: "a\nb\nc\n", changed: "a\nB\nc\nd\n" });
        expect(result.removed).toBe(1);
        expect(result.added).toBe(2);
        expect(result.parts.filter((p) => p.removed).map((p) => p.value)).toEqual(["b\n"]);
        expect(result.identical).toBe(false);
    });

    it("says when the texts are the same", () => {
        expect(run({ original: "سلام\n", changed: "سلام\n" })).toMatchObject({
            identical: true,
            added: 0,
            removed: 0,
        });
        expect(run({}).identical).toBe(true);
    });

    it("can ignore spaces at the start and end of lines", () => {
        expect(run({ original: "a\n  b\n", changed: "a\nb  \n" }).identical).toBe(false);
        expect(
            run({ original: "a\n  b\n", changed: "a\nb  \n", ignoreWhitespace: true }).identical,
        ).toBe(true);
    });

    it("writes a unified patch", () => {
        const { patch } = run({ original: "a\nb\n", changed: "a\nc\n" });
        expect(patch).toContain("--- original");
        expect(patch).toContain("+++ changed");
        expect(patch).toContain("@@ -1,2 +1,2 @@");
        expect(patch).toContain("-b\n+c");
    });
});

describe("words", () => {
    it("compares Persian words and keeps ZWNJ words whole", () => {
        const result = run({
            original: "من به کتاب‌خانه رفتم",
            changed: "من به کتاب‌فروشی رفتم",
            granularity: "words",
        });
        expect(result.parts.filter((p) => p.removed).map((p) => p.value)).toEqual(["کتاب‌خانه"]);
        expect(result.parts.filter((p) => p.added).map((p) => p.value)).toEqual(["کتاب‌فروشی"]);
        expect(result).toMatchObject({ added: 1, removed: 1 });
    });

    it("can ignore case", () => {
        const input = {
            original: "Hello World",
            changed: "hello world",
            granularity: "words" as const,
        };
        expect(run(input).identical).toBe(false);
        expect(run({ ...input, ignoreCase: true }).identical).toBe(true);
    });
});

describe("characters", () => {
    it("counts changed characters", () => {
        expect(run({ original: "کتاب", changed: "کتابها", granularity: "chars" })).toMatchObject({
            added: 2,
            removed: 0,
        });
    });

    it("refuses very large input", () => {
        try {
            run({ original: "a".repeat(MAX_CHAR_INPUT), changed: "b", granularity: "chars" });
            throw new Error("expected a ToolFailure");
        } catch (error) {
            expect(error).toBeInstanceOf(ToolFailure);
            expect((error as ToolFailure).detail).toBe("chars limit");
        }
    });
});
