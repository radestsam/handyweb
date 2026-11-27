import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { cookies, parseHeaders, securityChecks } from "./logic";

const response = [
    "HTTP/2 200 OK",
    "Content-Type: text/html; charset=utf-8",
    "Strict-Transport-Security: max-age=31536000; includeSubDomains",
    "Content-Security-Policy: default-src 'self';",
    "  frame-ancestors 'none'",
    "X-Content-Type-Options: nosniff",
    "Set-Cookie: sid=abc123; Path=/; Secure; HttpOnly; SameSite=Lax",
    "Set-Cookie: theme=dark",
].join("\r\n");

describe("parseHeaders", () => {
    it("reads the status line, folded lines, and repeated headers", () => {
        const parsed = parseHeaders(response);
        expect(parsed.startLine).toBe("HTTP/2 200 OK");
        expect(parsed.kind).toBe("response");
        expect(parsed.headers).toHaveLength(6);
        expect(parsed.headers[2]?.value).toBe("default-src 'self'; frame-ancestors 'none'");
    });

    it("reads a request and HTTP/2 pseudo-headers", () => {
        expect(parseHeaders("GET /fa/ HTTP/1.1\nHost: handyweb.ir").kind).toBe("request");
        expect(parseHeaders(":authority: handyweb.ir\nuser-agent: x").headers[0]).toEqual({
            name: ":authority",
            key: ":authority",
            value: "handyweb.ir",
        });
    });

    it("rejects text without headers", () => {
        expect(() => parseHeaders("hello")).toThrow(ToolFailure);
    });
});

describe("securityChecks", () => {
    it("checks the common security headers", () => {
        expect(securityChecks(parseHeaders(response).headers)).toEqual([
            { check: "hsts", ok: true },
            { check: "csp", ok: true },
            { check: "nosniff", ok: true },
            { check: "framing", ok: true },
            { check: "referrer", ok: false },
            { check: "permissions", ok: false },
        ]);
    });

    it("needs a long HSTS max-age", () => {
        expect(
            securityChecks(parseHeaders("Strict-Transport-Security: max-age=300").headers)[0]?.ok,
        ).toBe(false);
    });
});

describe("cookies", () => {
    it("reads cookie attributes without values", () => {
        expect(cookies(parseHeaders(response).headers)).toEqual([
            { name: "sid", secure: true, httpOnly: true, sameSite: "Lax" },
            { name: "theme", secure: false, httpOnly: false, sameSite: null },
        ]);
    });
});
