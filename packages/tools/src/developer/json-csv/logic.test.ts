import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { csvToJson, detectDelimiter, jsonToCsv, parseCsv } from "./logic";

const comma = { delimiter: "," as const, flatten: false };

describe("jsonToCsv", () => {
    it("writes a header and quotes special fields", () => {
        expect(
            jsonToCsv(
                '[{"name":"سارا","note":"a, b"},{"name":"Ali","age":30,"note":"say \\"hi\\""}]',
                comma,
            ),
        ).toBe('name,note,age\r\nسارا,"a, b",\r\nAli,"say ""hi""",30');
    });

    it("writes nested values as JSON or as flat columns", () => {
        const json = '[{"a":{"b":1},"list":[1,2]}]';
        expect(jsonToCsv(json, comma)).toBe('a,list\r\n"{""b"":1}","[1,2]"');
        expect(jsonToCsv(json, { delimiter: ";", flatten: true })).toBe(
            "a.b;list.0;list.1\r\n1;1;2",
        );
    });

    it("writes an array of arrays without a header", () => {
        expect(jsonToCsv('[["a","b"],[1,null]]', comma)).toBe("a,b\r\n1,");
    });

    it("rejects other shapes and invalid JSON", () => {
        expect(() => jsonToCsv("[1,2]", comma)).toThrow(ToolFailure);
        expect(() => jsonToCsv("{a}", comma)).toThrow(ToolFailure);
    });
});

describe("parseCsv", () => {
    it("reads quotes, doubled quotes, and line breaks in fields", () => {
        expect(parseCsv('a,"b, c","d ""e"""\r\n"x\ny",z\n', ",")).toEqual([
            ["a", "b, c", 'd "e"'],
            ["x\ny", "z"],
        ]);
    });

    it("drops a BOM and reports an open quote", () => {
        expect(parseCsv("\uFEFFa,b", ",")).toEqual([["a", "b"]]);
        expect(() => parseCsv('a,"b', ",")).toThrow(ToolFailure);
    });
});

describe("csvToJson", () => {
    it("reads a header and types", () => {
        expect(
            JSON.parse(
                csvToJson("name;age;ok;code\nسارا;30;true;007\n", {
                    delimiter: "auto",
                    header: true,
                    types: true,
                }),
            ),
        ).toEqual([{ name: "سارا", age: 30, ok: true, code: "007" }]);
    });

    it("keeps text without types and reads rows without a header", () => {
        expect(
            JSON.parse(csvToJson("1,2\n3,4", { delimiter: ",", header: false, types: false })),
        ).toEqual([
            ["1", "2"],
            ["3", "4"],
        ]);
    });

    it("round-trips with jsonToCsv", () => {
        const json = [{ a: "x, y", b: 'q "z"', c: "خط\nدوم" }];
        expect(
            JSON.parse(
                csvToJson(jsonToCsv(JSON.stringify(json), comma), {
                    delimiter: ",",
                    header: true,
                    types: false,
                }),
            ),
        ).toEqual(json);
    });
});

describe("detectDelimiter", () => {
    it("picks the delimiter of the first line", () => {
        expect(detectDelimiter("a;b;c\n1,2;3")).toBe(";");
        expect(detectDelimiter("a\tb")).toBe("\t");
        expect(detectDelimiter("a,b")).toBe(",");
    });
});
