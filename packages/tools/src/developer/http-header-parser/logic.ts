import { ToolFailure } from "@handyweb/core/runtime";

export interface Header {
    /** The name as written. */
    name: string;
    /** The name in lower case, for lookups. */
    key: string;
    value: string;
}

export interface ParsedHeaders {
    /** "HTTP/1.1 200 OK" or "GET /path HTTP/1.1", when the text starts with one. */
    startLine: string | null;
    kind: "request" | "response" | "unknown";
    headers: Header[];
}

export type SecurityCheck = "hsts" | "csp" | "nosniff" | "framing" | "referrer" | "permissions";

export interface CheckResult {
    check: SecurityCheck;
    ok: boolean;
}

export interface CookieInfo {
    name: string;
    secure: boolean;
    httpOnly: boolean;
    sameSite: string | null;
}

/**
 * Reads headers as they appear in browser developer tools or curl -i. A
 * line that starts with a space or a tab continues the line before it
 * (obsolete folding). Lines without a colon are skipped.
 */
export function parseHeaders(text: string): ParsedHeaders {
    const lines = text.replace(/\r\n?/g, "\n").split("\n");
    let startLine: string | null = null;
    let kind: ParsedHeaders["kind"] = "unknown";
    const first = lines[0]?.trim() ?? "";
    if (/^HTTP\/[\d.]+ \d{3}/i.test(first)) {
        startLine = first;
        kind = "response";
        lines.shift();
    } else if (/^[A-Z]+ \S+ HTTP\/[\d.]+$/.test(first)) {
        startLine = first;
        kind = "request";
        lines.shift();
    }
    const headers: Header[] = [];
    for (const line of lines) {
        if (line.trim() === "") continue;
        if (/^[ \t]/.test(line) && headers.length > 0) {
            const last = headers[headers.length - 1] as Header;
            last.value = `${last.value} ${line.trim()}`;
            continue;
        }
        const colon = line.indexOf(":", line.startsWith(":") ? 1 : 0);
        if (colon <= 0) continue;
        const name = line.slice(0, colon).trim();
        headers.push({ name, key: name.toLowerCase(), value: line.slice(colon + 1).trim() });
    }
    if (headers.length === 0) {
        throw new ToolFailure(
            "invalid-input",
            {
                fa: "سربرگی یافت نشد. هر سربرگ در یک خط و به شکل «نام: مقدار» است.",
                en: "No headers found. Each header is on its own line as “Name: value”.",
            },
            "no headers",
        );
    }
    if (kind === "unknown") {
        const keys = new Set(headers.map((h) => h.key));
        if (["user-agent", "host", "accept", "cookie"].some((k) => keys.has(k))) kind = "request";
        else if (
            ["server", "set-cookie", "content-security-policy", "strict-transport-security"].some(
                (k) => keys.has(k),
            )
        )
            kind = "response";
    }
    return { startLine, kind, headers };
}

function get(headers: Header[], key: string): string | undefined {
    return headers.find((header) => header.key === key)?.value;
}

/** Checks the common security headers of a response. */
export function securityChecks(headers: Header[]): CheckResult[] {
    const csp = get(headers, "content-security-policy") ?? "";
    const hsts = get(headers, "strict-transport-security") ?? "";
    const maxAge = Number(/max-age=(\d+)/i.exec(hsts)?.[1] ?? 0);
    return [
        { check: "hsts", ok: maxAge >= 15_552_000 },
        { check: "csp", ok: csp !== "" },
        {
            check: "nosniff",
            ok: (get(headers, "x-content-type-options") ?? "").toLowerCase() === "nosniff",
        },
        {
            check: "framing",
            ok:
                /frame-ancestors/i.test(csp) ||
                /^(deny|sameorigin)$/i.test(get(headers, "x-frame-options") ?? ""),
        },
        { check: "referrer", ok: get(headers, "referrer-policy") !== undefined },
        { check: "permissions", ok: get(headers, "permissions-policy") !== undefined },
    ];
}

/** Reads the attributes of each Set-Cookie header. The cookie value is not kept. */
export function cookies(headers: Header[]): CookieInfo[] {
    return headers
        .filter((header) => header.key === "set-cookie")
        .map((header) => {
            const [pair = "", ...attributes] = header.value.split(";").map((part) => part.trim());
            const names = attributes.map((a) => a.toLowerCase());
            const sameSite = attributes.find((a) => /^samesite=/i.test(a))?.split("=")[1] ?? null;
            return {
                name: pair.split("=")[0] ?? "",
                secure: names.includes("secure"),
                httpOnly: names.includes("httponly"),
                sameSite,
            };
        });
}
