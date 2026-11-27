import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { jsonToYaml, yamlToJson } from "./logic";

describe("jsonToYaml", () => {
    it("writes YAML", () => {
        expect(jsonToYaml('{"name":"سارا","tags":["a","b"],"n":1,"ok":true,"none":null}')).toBe(
            "name: سارا\ntags:\n  - a\n  - b\nn: 1\nok: true\nnone: null\n",
        );
    });

    it("quotes strings that look like other types", () => {
        expect(jsonToYaml('{"a":"true","b":"1.0","c":"no"}')).toBe('a: "true"\nb: "1.0"\nc: no\n');
    });

    it("rejects invalid JSON", () => {
        expect(() => jsonToYaml("{a:1}")).toThrow(ToolFailure);
    });
});

describe("yamlToJson", () => {
    it("writes JSON", () => {
        expect(yamlToJson("name: سارا\nlist:\n  - 1\n  - two\n", 2)).toBe(
            '{\n  "name": "سارا",\n  "list": [\n    1,\n    "two"\n  ]\n}',
        );
    });

    it("resolves anchors and turns several documents into an array", () => {
        expect(yamlToJson("a: &x 1\nb: *x\n", 0)).toBe('{"a":1,"b":1}');
        expect(yamlToJson("a: 1\n---\nb: 2\n", 0)).toBe('[{"a":1},{"b":2}]');
    });

    it("reads an unknown tag as a string", () => {
        expect(yamlToJson("a: !!js/function 'function(){}'\n", 0)).toBe('{"a":"function(){}"}');
    });

    it("round-trips", () => {
        const json = '{"a":[1,{"b":"سلام"}],"c":null}';
        expect(yamlToJson(jsonToYaml(json), 0)).toBe(json);
    });
});
