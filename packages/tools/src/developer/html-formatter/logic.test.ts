import { describe, expect, it } from "vitest";
import { html_beautify } from "js-beautify/js/lib/beautify-html.js";
import { formatCode } from "./logic";

describe("html-formatter", () => {
    it("formats the example", () => {
        const out = formatCode("<div><h1>سلام</h1><p>متن <b>نمونه</b></p></div>", html_beautify, {
            indent: "2",
            maxEmptyLines: 1,
        });
        expect(out.split("\n").length).toBeGreaterThan(2);
        expect(out.endsWith("\n")).toBe(true);
    });
});
