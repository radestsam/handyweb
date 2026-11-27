import { describe, expect, it } from "vitest";
import { css_beautify } from "js-beautify/js/lib/beautify-css.js";
import { formatCode } from "./logic";

describe("css-formatter", () => {
    it("formats the example", () => {
        const out = formatCode("body{margin:0;font-family:Estedad}a{color:#bc4a3c}", css_beautify, {
            indent: "2",
            maxEmptyLines: 1,
        });
        expect(out.split("\n").length).toBeGreaterThan(2);
        expect(out.endsWith("\n")).toBe(true);
    });
});
