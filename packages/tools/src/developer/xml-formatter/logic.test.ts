// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { processXml, readParseError, type Action, type Indent } from "./logic";

const run = (text: string, action: Action = "format", indent: Indent = "2") =>
    processXml({ text, action, indent });

function failure(fn: () => unknown): ToolFailure {
    try {
        fn();
    } catch (error) {
        if (error instanceof ToolFailure) return error;
        throw error;
    }
    throw new Error("expected a ToolFailure");
}

describe("format", () => {
    it("indents nested elements", () => {
        expect(run("<a><b><c/></b><d x='1'/></a>").text).toBe(
            '<a>\n  <b>\n    <c/>\n  </b>\n  <d x="1"/>\n</a>\n',
        );
    });

    it("uses 4 spaces or a tab", () => {
        expect(run("<a><b/></a>", "format", "4").text).toBe("<a>\n    <b/>\n</a>\n");
        expect(run("<a><b/></a>", "format", "tab").text).toBe("<a>\n\t<b/>\n</a>\n");
    });

    it("keeps the declaration, comments, processing instructions, and the doctype", () => {
        const xml =
            '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE note>\n<?style href="a.css"?><!-- top --><note><to>Ali</to></note>';
        expect(run(xml).text).toBe(
            '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE note>\n<?style href="a.css"?>\n<!-- top -->\n<note>\n  <to>Ali</to>\n</note>\n',
        );
    });

    it("keeps Persian text and mixed content unchanged", () => {
        expect(run("<p>سلام <b>دنیا</b>  !</p>").text).toBe("<p>سلام <b>دنیا</b>  !</p>\n");
        expect(run("<r><name>  کتاب‌ها  </name></r>").text).toBe(
            "<r>\n  <name>  کتاب‌ها  </name>\n</r>\n",
        );
    });

    it("keeps CDATA and escapes text and attributes", () => {
        expect(run('<a t="x &amp; &quot;y&quot;"><![CDATA[<raw> & ]]></a>').text).toBe(
            '<a t="x &amp; &quot;y&quot;"><![CDATA[<raw> & ]]></a>\n',
        );
        expect(run("<a>1 &lt; 2 &amp; 3 &gt; 2</a>").text).toBe("<a>1 &lt; 2 &amp; 3 &gt; 2</a>\n");
    });

    it("keeps namespace prefixes and declarations", () => {
        expect(run('<x:a xmlns:x="urn:x"><x:b/></x:a>').text).toBe(
            '<x:a xmlns:x="urn:x">\n  <x:b/>\n</x:a>\n',
        );
    });
});

describe("minify", () => {
    it("removes whitespace between elements, not inside text", () => {
        expect(run("<a>\n  <b> x </b>\n  <c/>\n</a>", "minify").text).toBe("<a><b> x </b><c/></a>");
    });

    it("keeps the declaration", () => {
        expect(run('<?xml version="1.0"?>\n<a/>', "minify").text).toBe('<?xml version="1.0"?><a/>');
    });

    it("round-trips with format", () => {
        const xml = '<?xml version="1.0"?><a x="1"><b>متن</b><c><d/></c></a>';
        expect(run(run(xml, "format").text, "minify").text).toBe(xml);
    });
});

describe("validate", () => {
    it("names the root and counts the elements", () => {
        expect(run("<a><b/><b/></a>", "validate")).toEqual({ text: "", root: "a", elements: 3 });
    });

    it("rejects empty input", () => {
        expect(failure(() => run("  ")).code).toBe("invalid-input");
    });

    it("reports the line and column of an error", () => {
        const error = failure(() => run("<a>\n  <b></a>"));
        expect(error.localized.en).toBe("The XML is not well-formed (line 2, column 9).");
        expect(error.detail).toBe("unexpected close tag.");
    });

    it("rejects two roots, an unquoted attribute, and an unknown entity", () => {
        expect(failure(() => run("<a/><b/>")).code).toBe("invalid-input");
        expect(failure(() => run("<a x=1/>")).code).toBe("invalid-input");
        expect(failure(() => run("<a>&nbsp;</a>")).code).toBe("invalid-input");
    });
});

describe("readParseError", () => {
    it("reads the Chromium and WebKit form", () => {
        expect(
            readParseError(
                "This page contains the following errors:error on line 3 at column 7: Opening and ending tag mismatch: b line 2 and a\nBelow is a rendering of the page up to the first error.",
            ),
        ).toEqual({
            line: 3,
            column: 7,
            message: "Opening and ending tag mismatch: b line 2 and a",
        });
    });

    it("reads the Firefox form", () => {
        expect(
            readParseError(
                "XML Parsing Error: mismatched tag. Expected: </b>.\nLocation: about:blank\nLine Number 1, Column 8:<a><b></a>\n-------^",
            ),
        ).toEqual({ line: 1, column: 8, message: "mismatched tag. Expected: </b>." });
    });

    it("keeps an unknown form as the message", () => {
        expect(readParseError("Something failed\nmore")).toEqual({
            line: null,
            column: null,
            message: "Something failed",
        });
    });
});
