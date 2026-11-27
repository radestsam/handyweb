// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { decodeEntities, encodeEntities } from "./logic";

describe("encode", () => {
    it("returns an empty text for an empty input", () => {
        expect(encodeEntities("")).toBe("");
        expect(decodeEntities("")).toBe("");
    });

    it("encodes the five special characters", () => {
        expect(encodeEntities(`<a href="x?a=1&b='2'">`)).toBe(
            "&lt;a href=&quot;x?a=1&amp;b=&#39;2&#39;&quot;&gt;",
        );
    });

    it("keeps Persian text and emoji by default", () => {
        expect(encodeEntities("سلام & 😀")).toBe("سلام &amp; 😀");
    });

    it("can encode non-ASCII characters as decimal or hex references", () => {
        expect(encodeEntities("سلام 😀", { nonAscii: true, format: "decimal" })).toBe(
            "&#1587;&#1604;&#1575;&#1605; &#128512;",
        );
        expect(encodeEntities("é😀", { nonAscii: true, format: "hex" })).toBe("&#xE9;&#x1F600;");
    });

    it("encodes ZWNJ as a reference too", () => {
        expect(encodeEntities("می‌روم", { nonAscii: true, format: "hex" })).toBe(
            "&#x645;&#x6CC;&#x200C;&#x631;&#x648;&#x645;",
        );
    });
});

describe("decode", () => {
    it("decodes named, decimal, and hex references", () => {
        expect(decodeEntities("&lt;b&gt; &amp; &quot;x&quot; &#39; &copy; &nbsp;|")).toBe(
            `<b> & "x" ' © \u00A0|`,
        );
        expect(decodeEntities("&#1587;&#x644;&#X627;&#1605;")).toBe("سلام");
        expect(decodeEntities("&#128512; &#x1F600;")).toBe("😀 😀");
    });

    it("follows the HTML rules for edge cases", () => {
        // Legacy references without ";" decode, others stay as text.
        expect(decodeEntities("&amp &copy2 &notit; &bogus;")).toBe("& ©2 ¬it; &bogus;");
        // &#128; to &#159; are read as Windows-1252.
        expect(decodeEntities("&#128; &#150;")).toBe("€ –");
        // Out-of-range and zero references become U+FFFD.
        expect(decodeEntities("&#0; &#x110000;")).toBe("\uFFFD \uFFFD");
    });

    it("does not read tags and keeps the text around them", () => {
        expect(decodeEntities("<script>alert(1)</script> &lt;/textarea&gt; </textarea>x")).toBe(
            "<script>alert(1)</script> </textarea> </textarea>x",
        );
    });

    it("keeps a newline at the start and the line breaks", () => {
        expect(decodeEntities("\nline 1\nline 2\n")).toBe("\nline 1\nline 2\n");
    });

    it("round-trips Persian, emoji, and special characters", () => {
        const text = `کتاب‌ها <b class="x">'&'</b> 😀`;
        expect(decodeEntities(encodeEntities(text))).toBe(text);
        expect(decodeEntities(encodeEntities(text, { nonAscii: true, format: "hex" }))).toBe(text);
    });
});
