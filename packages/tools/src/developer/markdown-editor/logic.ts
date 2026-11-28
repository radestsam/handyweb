import DOMPurify from "dompurify";
import { marked } from "marked";

/*
 * Markdown to safe HTML. marked turns GitHub-flavored Markdown into HTML, and
 * DOMPurify removes scripts, event handlers, and javascript: links from the
 * result. The preview shows the clean HTML in the same sandboxed frame as the
 * HTML previewer, so remote images do not load either.
 */

export function markdownToHtml(markdown: string): string {
    // DOMPurify needs a DOM. The page is built on the server, where there is
    // none, so the result is empty there. Never return HTML that is not clean.
    if (!DOMPurify.isSupported) return "";
    const raw = marked.parse(markdown, { async: false, gfm: true, breaks: false }) as string;
    return DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } });
}

/** A full HTML page with the converted Markdown, for download. */
export function htmlDocument(body: string, title: string, rtl: boolean): string {
    const safeTitle = title.replace(/[<>&"]/g, "");
    return `<!doctype html>\n<html${rtl ? ' dir="rtl" lang="fa"' : ""}>\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width">\n<title>${safeTitle}</title>\n</head>\n<body>\n${body}\n</body>\n</html>\n`;
}
