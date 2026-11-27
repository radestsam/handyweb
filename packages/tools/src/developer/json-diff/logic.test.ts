import { describe, expect, it } from "vitest";
import type { ToolFailure } from "@handyweb/core/runtime";
import { changesToText, diffJson } from "./logic";

const ordered = { ignoreArrayOrder: false };

describe("diffJson", () => {
    it("ignores key order and formatting", () => {
        expect(diffJson('{"a":1,"b":[1,2]}', '{ "b": [1, 2],\n "a": 1 }', ordered)).toEqual([]);
    });

    it("finds added, removed, and changed values with paths", () => {
        expect(
            diffJson(
                '{"name":"سارا","age":30,"tags":["a"],"x":1}',
                '{"name":"Sara","age":30,"tags":["a","b"],"y":2}',
                ordered,
            ),
        ).toEqual([
            { kind: "changed", path: "$.name", before: "سارا", after: "Sara" },
            { kind: "added", path: "$.tags[1]", after: "b" },
            { kind: "removed", path: "$.x", before: 1 },
            { kind: "added", path: "$.y", after: 2 },
        ]);
    });

    it("reports a change of type", () => {
        expect(diffJson('{"a":"1"}', '{"a":1}', ordered)).toEqual([
            { kind: "type", path: "$.a", before: "1", after: 1 },
        ]);
    });

    it("quotes unusual keys", () => {
        expect(diffJson('{"first name":1}', '{"first name":2}', ordered)[0]?.path).toBe(
            '$["first name"]',
        );
    });

    it("can ignore array order", () => {
        expect(diffJson("[1,2,3]", "[3,1,2]", { ignoreArrayOrder: true })).toEqual([]);
        expect(diffJson("[1,1,2]", "[1,2,2]", { ignoreArrayOrder: true })).toEqual([
            { kind: "removed", path: "$[*]", before: 1 },
            { kind: "added", path: "$[*]", after: 2 },
        ]);
        expect(diffJson('[{"a":1,"b":2}]', '[{"b":2,"a":1}]', { ignoreArrayOrder: true })).toEqual(
            [],
        );
    });

    it("names the invalid side", () => {
        try {
            diffJson("{}", "{x}", ordered);
            throw new Error("expected a ToolFailure");
        } catch (error) {
            expect((error as ToolFailure).localized.en).toBe("The second JSON is not valid.");
        }
    });
});

describe("changesToText", () => {
    it("writes one line per change", () => {
        expect(changesToText(diffJson('{"a":1,"b":2}', '{"a":3,"c":4}', ordered))).toBe(
            "~ $.a: 1 → 3\n- $.b: 2\n+ $.c: 4",
        );
    });
});
