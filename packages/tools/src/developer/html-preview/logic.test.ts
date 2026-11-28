import { describe, expect, it } from "vitest";
import { buildSrcdoc, previewPolicy, sandboxTokens } from "./logic";

describe("html preview", () => {
    it("starts the document with a policy that blocks the network", () => {
        const doc = buildSrcdoc("<p>سلام</p>", { scripts: false, rtl: true });
        expect(
            doc.startsWith(
                '<!doctype html><html dir="rtl"><head><meta http-equiv="Content-Security-Policy"',
            ),
        ).toBe(true);
        expect(doc).toContain("<body><p>سلام</p></body>");
        expect(previewPolicy(false)).toContain("default-src 'none'");
        expect(previewPolicy(false)).toContain("script-src 'none'");
        expect(previewPolicy(false)).not.toMatch(/https?:/);
    });

    it("allows inline scripts only when asked, and never same-origin", () => {
        expect(previewPolicy(true)).toContain("script-src 'unsafe-inline'");
        expect(sandboxTokens({ scripts: true, rtl: false })).toBe("allow-scripts");
        expect(sandboxTokens({ scripts: false, rtl: false })).toBe("");
        expect(sandboxTokens({ scripts: true, rtl: false })).not.toContain("allow-same-origin");
    });
});
