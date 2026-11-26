import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { processJson, type JsonInput } from "./logic";
import { scanJson } from "./scan";

const run = (text: string, extra: Partial<JsonInput> = {}) =>
    processJson({ text, action: "format", indent: "2", sortKeys: false, ...extra });

const failure = (text: string): ToolFailure => {
    try {
        run(text);
    } catch (error) {
        if (error instanceof ToolFailure) return error;
        throw error;
    }
    throw new Error("Expected a ToolFailure");
};

describe("processJson", () => {
    it("formats with 2 spaces, 4 spaces, or tabs", () => {
        expect(run('{"a":[1,2]}').output).toBe('{\n  "a": [\n    1,\n    2\n  ]\n}');
        expect(run('{"a":1}', { indent: "4" }).output).toBe('{\n    "a": 1\n}');
        expect(run('{"a":1}', { indent: "tab" }).output).toBe('{\n\t"a": 1\n}');
    });

    it("minifies", () => {
        expect(run('{ "a" : [ 1 , 2 ] ,\n "b": "x y" }', { action: "minify" }).output).toBe(
            '{"a":[1,2],"b":"x y"}',
        );
    });

    it("validates without output", () => {
        expect(run("[1, 2]", { action: "validate" })).toEqual({ output: "", warnings: [] });
    });

    it("keeps Persian strings as they are", () => {
        expect(run('{"نام":"علی"}', { action: "minify" }).output).toBe('{"نام":"علی"}');
    });

    it("sorts keys deeply on request", () => {
        expect(run('{"b":1,"a":{"d":1,"c":2}}', { action: "minify", sortKeys: true }).output).toBe(
            '{"a":{"c":2,"d":1},"b":1}',
        );
    });

    it("accepts top-level scalars and a byte order mark", () => {
        expect(run("42").output).toBe("42");
        expect(run('﻿"x"').output).toBe('"x"');
    });
});

describe("errors", () => {
    it("reports a trailing comma with its line and column", () => {
        const error = failure('{\n  "a": 1,\n}');
        expect(error.detail).toBe("3:1");
        expect(error.localized.en).toBe(
            "Extra comma before the end of an array or object at line 3, column 1.",
        );
        expect(error.localized.fa).toContain("خط 3، ستون 1");
    });

    it("reports single quotes, comments, and NaN as unexpected characters", () => {
        expect(failure("{'a': 1}").detail).toBe("1:2");
        expect(failure("[1] // x").localized.en).toContain("Extra text");
        expect(failure("[NaN]").localized.en).toContain('Unexpected character "N"');
    });

    it("reports a truncated document", () => {
        expect(failure('{"a": [1, 2').localized.en).toContain("ends too early");
        expect(failure("").localized.en).toContain("ends too early");
    });

    it("rejects bad numbers", () => {
        expect(failure("[01]").localized.en).toContain("Invalid number");
        expect(failure("[1.]").localized.en).toContain("Invalid number");
        expect(failure("[-]").localized.en).toContain("Invalid number");
    });

    it("rejects a raw line break inside a string and a bad escape", () => {
        expect(failure('["a\nb"]').localized.en).toContain("Control character");
        expect(failure('["\\x41"]').localized.en).toContain("escape");
    });

    it("counts columns in UTF-16 code units after Persian text", () => {
        expect(failure('{"نام": x}').detail).toBe("1:9");
    });
});

describe("warnings", () => {
    it("reports duplicate keys", () => {
        const result = scanJson('{"a": 1, "a": 2}');
        expect(result).toEqual({
            ok: true,
            warnings: [{ kind: "duplicate-key", key: "a", line: 1, column: 10 }],
        });
    });

    it("reports integers that lose precision", () => {
        const result = run('{"id": 12345678901234567890, "ok": 9007199254740991}');
        expect(result.warnings).toEqual([
            { kind: "precision", number: "12345678901234567890", line: 1, column: 8 },
        ]);
    });

    it("does not warn about ordinary decimals", () => {
        expect(run("[0.1, 3.14159, 1e10, -0, 2.5e-3]").warnings).toEqual([]);
    });

    it("survives deep nesting up to the limit", () => {
        const deep = "[".repeat(500) + "]".repeat(500);
        expect(run(deep, { action: "minify" }).output).toBe(deep);
    });
});
