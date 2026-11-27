/*
 * Builds the srcdoc of the preview frame. The frame is sandboxed without
 * allow-same-origin, so its code cannot reach this page or its storage. A
 * Content-Security-Policy meta tag at the start blocks every network request,
 * so the preview cannot load remote images, scripts, fonts, or forms, and
 * pasted HTML cannot send data anywhere. Only inline styles, data: and blob:
 * images, and (when allowed) inline scripts run.
 */

export interface PreviewOptions {
    /** Let inline scripts run in the sandboxed frame. */
    scripts: boolean;
    /** Set dir="rtl" on the document. */
    rtl: boolean;
}

export function previewPolicy(scripts: boolean): string {
    return [
        "default-src 'none'",
        "img-src data: blob:",
        "media-src data: blob:",
        "font-src data:",
        "style-src 'unsafe-inline'",
        `script-src ${scripts ? "'unsafe-inline'" : "'none'"}`,
        "form-action 'none'",
        "base-uri 'none'",
    ].join("; ");
}

export function buildSrcdoc(html: string, options: PreviewOptions): string {
    const csp = `<meta http-equiv="Content-Security-Policy" content="${previewPolicy(options.scripts)}">`;
    const dir = options.rtl ? ' dir="rtl"' : "";
    // The meta tag must come before any content, so it is put first. A
    // document that has its own <html> or <head> still gets it first: the
    // parser moves it into the head.
    return `<!doctype html><html${dir}><head>${csp}<meta charset="utf-8"><meta name="viewport" content="width=device-width"></head><body>${html}</body></html>`;
}

/** The sandbox tokens of the frame. allow-same-origin is never set. */
export function sandboxTokens(options: PreviewOptions): string {
    return options.scripts ? "allow-scripts" : "";
}
