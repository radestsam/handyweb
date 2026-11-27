import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { parseUrl } from "./logic";
import { toUnicode } from "./punycode";

describe("toUnicode", () => {
    it("decodes punycode labels (RFC 3492 samples)", () => {
        expect(toUnicode("xn--mgbh0fb.xn--kgbechtv")).toBe("مثال.إختبار");
        expect(toUnicode("www.xn--bcher-kva.example")).toBe("www.bücher.example");
        expect(toUnicode("example.com")).toBe("example.com");
        expect(toUnicode("xn--!!.com")).toBe("xn--!!.com");
    });
});

describe("parseUrl", () => {
    it("splits a URL into its parts", () => {
        const url = parseUrl(
            "https://user:pa%20ss@fa.wikipedia.org:8443/wiki/%D8%A7%DB%8C%D8%B1%D8%A7%D9%86?q=%D8%B3%D9%84%D8%A7%D9%85&tag=a&tag=b#bottom",
        );
        expect(url).toMatchObject({
            protocol: "https:",
            username: "user",
            password: "pa ss",
            hostname: "fa.wikipedia.org",
            port: "8443",
            defaultPort: "443",
            segments: ["wiki", "ایران"],
            params: [
                ["q", "سلام"],
                ["tag", "a"],
                ["tag", "b"],
            ],
            hash: "bottom",
            addedScheme: false,
        });
        expect(url.flags).toEqual(["credentials", "unusual-port"]);
    });

    it("adds https:// to a bare host", () => {
        expect(parseUrl("handyweb.ir/fa/")).toMatchObject({
            addedScheme: true,
            hostname: "handyweb.ir",
        });
    });

    it("shows an IDN host in its own letters and flags it", () => {
        const url = parseUrl("https://xn--mgbh0fb.example/");
        expect(url.hostnameUnicode).toBe("مثال.example");
        expect(url.flags).toContain("punycode");
    });

    it("flags a mixed-script host (homograph)", () => {
        // The "а" is Cyrillic.
        expect(parseUrl("https://\u0430pple.com/").flags).toEqual(["punycode", "mixed-script"]);
    });

    it("flags IP hosts, http, dangerous schemes, and redirect parameters", () => {
        expect(parseUrl("http://192.168.1.1/admin").flags).toEqual(["ip-host", "insecure"]);
        expect(parseUrl("javascript:alert(1)").flags).toEqual(["dangerous-scheme"]);
        expect(parseUrl("https://a.com/login?next=https://evil.example/").flags).toEqual([
            "redirect-param",
        ]);
        expect(parseUrl("https://a.com/login?next=/home").flags).toEqual([]);
    });

    it("rejects empty and unreadable input", () => {
        expect(() => parseUrl(" ")).toThrow(ToolFailure);
        expect(() => parseUrl("http://[bad")).toThrow(ToolFailure);
        expect(() => parseUrl("exa mple.com")).toThrow(ToolFailure);
    });
});
