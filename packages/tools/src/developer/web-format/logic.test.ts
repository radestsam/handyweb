import { describe, expect, it } from "vitest";
import { css_beautify } from "js-beautify/js/lib/beautify-css.js";
import { html_beautify } from "js-beautify/js/lib/beautify-html.js";
import { js_beautify } from "js-beautify/js/lib/beautify.js";
import { ToolFailure } from "@handyweb/core/runtime";
import { formatCode, type FormatOptions } from "./logic";

const two: FormatOptions = { indent: "2", maxEmptyLines: 1 };

describe("formatCode", () => {
    it("formats JavaScript", () => {
        expect(formatCode("function f(a,b){if(a){return b}}", js_beautify, two)).toBe(
            "function f(a, b) {\n  if (a) {\n    return b\n  }\n}\n",
        );
    });

    it("formats CSS with tabs", () => {
        expect(
            formatCode("a{color:red;margin:0}", css_beautify, { indent: "tab", maxEmptyLines: 1 }),
        ).toBe("a {\n\tcolor: red;\n\tmargin: 0\n}\n");
    });

    it("formats HTML with inline style and script", () => {
        const html = formatCode(
            "<div><p>سلام</p><style>a{color:red}</style><script>let x=1</script></div>",
            html_beautify,
            two,
        );
        expect(html).toContain("<p>سلام</p>");
        expect(html).toContain("color: red");
        expect(html).toContain("let x = 1");
    });

    it("removes empty lines when asked", () => {
        expect(formatCode("a=1\n\n\nb=2", js_beautify, { indent: "2", maxEmptyLines: 0 })).toBe(
            "a = 1\nb = 2\n",
        );
        expect(formatCode("a=1\n\n\nb=2", js_beautify, two)).toBe("a = 1\n\nb = 2\n");
    });

    it("rejects empty input", () => {
        expect(() => formatCode(" ", js_beautify, two)).toThrow(ToolFailure);
    });
});
