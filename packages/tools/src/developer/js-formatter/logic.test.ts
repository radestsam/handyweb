import { describe, expect, it } from "vitest";
import { js_beautify } from "js-beautify/js/lib/beautify.js";
import { formatCode } from "./logic";

describe("js-formatter", () => {
    it("formats the example", () => {
        const out = formatCode(
            'function hello(name){if(name){return "سلام "+name}return "سلام"}',
            js_beautify,
            { indent: "2", maxEmptyLines: 1 },
        );
        expect(out.split("\n").length).toBeGreaterThan(2);
        expect(out.endsWith("\n")).toBe(true);
    });
});
