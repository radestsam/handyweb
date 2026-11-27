import { describe, expect, it } from "vitest";
import type { ToolFailure } from "@handyweb/core/runtime";
import { detectDraft, validateJson } from "./logic";

const schema = JSON.stringify({
    $schema: "https://json-schema.org/draft/2020-12/schema",
    type: "object",
    required: ["name"],
    properties: {
        name: { type: "string", minLength: 2 },
        age: { type: "integer", minimum: 0 },
        tags: { type: "array", items: { type: "string" } },
    },
    additionalProperties: false,
});

function failure(fn: () => unknown): ToolFailure {
    try {
        fn();
    } catch (error) {
        return error as ToolFailure;
    }
    throw new Error("expected a ToolFailure");
}

describe("validateJson", () => {
    it("accepts valid data", () => {
        expect(validateJson(schema, '{"name":"سارا","age":30,"tags":["a"]}', "auto")).toEqual({
            valid: true,
            errors: [],
            draft: "2020-12",
        });
    });

    it("lists the leaf errors with their paths", () => {
        const result = validateJson(schema, '{"name":"a","age":-1,"tags":["x",2]}', "auto");
        expect(result.valid).toBe(false);
        expect(result.errors.map((e) => [e.path, e.keyword])).toEqual([
            ["/name", "minLength"],
            ["/age", "minimum"],
            ["/tags/1", "type"],
        ]);
    });

    it("reports required and additional properties", () => {
        const result = validateJson(schema, '{"extra":1}', "auto");
        expect(result.errors.map((e) => e.keyword).sort()).toEqual(
            ["additionalProperties", "required"].sort(),
        );
    });

    it("names the side with invalid JSON", () => {
        expect(failure(() => validateJson("{", "{}", "auto")).localized.en).toBe(
            "The schema is not valid JSON.",
        );
        expect(failure(() => validateJson("{}", "{", "auto")).localized.en).toBe(
            "The data is not valid JSON.",
        );
    });

    it("does not load an external $ref", () => {
        const remote = JSON.stringify({ $ref: "https://example.com/schema.json" });
        expect(failure(() => validateJson(remote, "{}", "auto")).localized.en).toMatch(
            /not loaded/,
        );
    });
});

describe("detectDraft", () => {
    it("reads the $schema URL", () => {
        expect(detectDraft({ $schema: "http://json-schema.org/draft-07/schema#" })).toBe("7");
        expect(detectDraft({ $schema: "http://json-schema.org/draft-04/schema#" })).toBe("4");
        expect(detectDraft({ $schema: "https://json-schema.org/draft/2019-09/schema" })).toBe(
            "2019-09",
        );
        expect(detectDraft({})).toBe("2020-12");
    });
});
