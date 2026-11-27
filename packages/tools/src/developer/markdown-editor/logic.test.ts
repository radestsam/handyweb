// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { htmlDocument, markdownToHtml } from "./logic";

describe("markdownToHtml", () => {
    it("converts headings, lists, emphasis, and Persian text", () => {
        const html = markdownToHtml("# سلام\n\n- یک\n- **دو**\n\n`code`");
        expect(html).toContain("<h1>سلام</h1>");
        expect(html).toContain("<li><strong>دو</strong></li>");
        expect(html).toContain("<code>code</code>");
    });

    it("converts GitHub tables", () => {
        expect(markdownToHtml("| a | b |\n|---|---|\n| 1 | 2 |")).toContain("<table>");
    });

    it("removes scripts, event handlers, and javascript: links", () => {
        const html = markdownToHtml(
            '<script>alert(1)</script>\n\n<img src="x.png" onerror="alert(2)">\n\n[click](javascript:alert(3))',
        );
        expect(html).not.toMatch(/<script|onerror|javascript:/i);
        expect(html).toContain('<img src="x.png">');
    });
});

describe("htmlDocument", () => {
    it("wraps the body in a page", () => {
        const page = htmlDocument("<p>x</p>", "My <notes>", true);
        expect(page).toContain('<html dir="rtl" lang="fa">');
        expect(page).toContain("<title>My notes</title>");
        expect(page).toContain("<p>x</p>");
    });
});
