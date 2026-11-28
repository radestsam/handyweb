import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { processYaml } from "./logic";

function failure(fn: () => unknown): ToolFailure {
    try {
        fn();
    } catch (error) {
        if (error instanceof ToolFailure) return error;
        throw error;
    }
    throw new Error("expected a ToolFailure");
}

describe("processYaml", () => {
    it("formats with the chosen indent and keeps comments", () => {
        const yaml = "# config\nname:   سارا\nlist: [a,  b]\nnested:\n      key: 1\n";
        expect(processYaml(yaml, "format", 2).text).toBe(
            "# config\nname: سارا\nlist: [ a, b ]\nnested:\n  key: 1\n",
        );
        expect(processYaml("a:\n  b: 1\n", "format", 4).text).toBe("a:\n    b: 1\n");
    });

    it("keeps several documents", () => {
        expect(processYaml("a: 1\n---\nb: 2\n", "format", 2)).toEqual({
            text: "a: 1\n---\nb: 2\n",
            documents: 2,
        });
    });

    it("validates without output", () => {
        expect(processYaml("a: 1", "validate", 2)).toEqual({ text: "", documents: 1 });
    });

    it("reports the line and column of an error", () => {
        const error = failure(() => processYaml("a: 1\nb: [1, 2\nc: 3\n", "format", 2));
        expect(error.localized.en).toMatch(/^The YAML is not valid \(line \d+, column \d+\)\.$/);
    });

    it("rejects duplicate keys and empty input", () => {
        expect(failure(() => processYaml("a: 1\na: 2\n", "format", 2)).code).toBe("invalid-input");
        expect(failure(() => processYaml("  ", "format", 2)).detail).toBe("empty");
    });

    it("stops a billion-laughs document", () => {
        const lines = ["a: &a [x, x, x, x, x, x, x, x, x, x]"];
        for (let i = 1; i < 9; i++) {
            const prev = String.fromCharCode(96 + i);
            const name = String.fromCharCode(97 + i);
            lines.push(`${name}: &${name} [${Array(10).fill(`*${prev}`).join(", ")}]`);
        }
        expect(() => processYaml(lines.join("\n"), "validate", 2)).toThrow();
    });

    it("reads an unknown tag as plain text, so nothing runs", () => {
        expect(processYaml("a: !!js/function 'function(){}'\n", "validate", 2).documents).toBe(1);
    });
});
