import { ToolFailure } from "@handyweb/core/runtime";
import { toUnicode } from "./punycode";

export type RiskFlag =
    | "credentials"
    | "ip-host"
    | "punycode"
    | "mixed-script"
    | "insecure"
    | "unusual-port"
    | "dangerous-scheme"
    | "redirect-param"
    | "long";

export interface ParsedUrl {
    href: string;
    /** The scheme was missing, and https:// was added to read the URL. */
    addedScheme: boolean;
    protocol: string;
    username: string;
    password: string;
    /** The host as the browser sends it (punycode for IDN). */
    hostname: string;
    /** The host in its own letters. */
    hostnameUnicode: string;
    port: string;
    /** The port the scheme uses when the URL names none. */
    defaultPort: string;
    pathname: string;
    /** Each path segment, percent-decoded. */
    segments: string[];
    /** Every query parameter in order, decoded. A name can repeat. */
    params: Array<[string, string]>;
    hash: string;
    flags: RiskFlag[];
}

const DEFAULT_PORTS: Record<string, string> = {
    "http:": "80",
    "https:": "443",
    "ws:": "80",
    "wss:": "443",
    "ftp:": "21",
};
const REDIRECT_PARAMS =
    /^(?:url|redirect|redirect_uri|redirect_url|return|returnurl|return_to|next|goto|dest|destination|continue|target|r|u)$/i;

function decode(text: string): string {
    try {
        return decodeURIComponent(text);
    } catch {
        return text;
    }
}

/** The scripts of the letters in a host, for a mixed-script (homograph) warning. */
function scripts(text: string): Set<string> {
    const found = new Set<string>();
    const tests: Array<[string, RegExp]> = [
        ["Latin", /\p{Script=Latin}/u],
        ["Cyrillic", /\p{Script=Cyrillic}/u],
        ["Greek", /\p{Script=Greek}/u],
        ["Arabic", /\p{Script=Arabic}/u],
        ["Han", /\p{Script=Han}/u],
        ["Armenian", /\p{Script=Armenian}/u],
        ["Hebrew", /\p{Script=Hebrew}/u],
    ];
    for (const label of text.split(".")) {
        for (const [name, test] of tests) if (test.test(label)) found.add(`${name}`);
        if (found.size > 1) return found;
        found.clear();
    }
    return found;
}

export function parseUrl(input: string): ParsedUrl {
    const text = input.trim();
    if (text === "")
        throw new ToolFailure(
            "invalid-input",
            { fa: "ورودی خالی است.", en: "The input is empty." },
            "empty",
        );
    let url: URL;
    let addedScheme = false;
    try {
        url = new URL(text);
    } catch {
        // Only a text without a scheme gets https:// added.
        if (/^[a-z][a-z0-9+.-]*:\/\//i.test(text)) {
            throw new ToolFailure(
                "invalid-input",
                { fa: "این نشانی خوانده نشد.", en: "This URL could not be read." },
                "parse",
            );
        }
        try {
            url = new URL(`https://${text}`);
            addedScheme = true;
        } catch {
            throw new ToolFailure(
                "invalid-input",
                { fa: "این نشانی خوانده نشد.", en: "This URL could not be read." },
                "parse",
            );
        }
    }
    const hostnameUnicode = toUnicode(url.hostname);
    const flags: RiskFlag[] = [];
    if (url.username || url.password) flags.push("credentials");
    if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(url.hostname) || url.hostname.startsWith("["))
        flags.push("ip-host");
    if (url.hostname.split(".").some((label) => label.startsWith("xn--"))) flags.push("punycode");
    if (scripts(hostnameUnicode).size > 1) flags.push("mixed-script");
    if (url.protocol === "http:" || url.protocol === "ws:") flags.push("insecure");
    if (url.port && url.port !== DEFAULT_PORTS[url.protocol]) flags.push("unusual-port");
    if (["javascript:", "data:", "vbscript:", "file:"].includes(url.protocol))
        flags.push("dangerous-scheme");
    const params = Array.from(url.searchParams.entries());
    if (
        params.some(
            ([name, value]) => REDIRECT_PARAMS.test(name) && /^(?:https?:)?\/\//i.test(value),
        )
    ) {
        flags.push("redirect-param");
    }
    if (url.href.length > 2000) flags.push("long");
    return {
        href: url.href,
        addedScheme,
        protocol: url.protocol,
        username: decode(url.username),
        password: decode(url.password),
        hostname: url.hostname,
        hostnameUnicode,
        port: url.port,
        defaultPort: DEFAULT_PORTS[url.protocol] ?? "",
        pathname: url.pathname,
        segments: url.pathname.split("/").filter(Boolean).map(decode),
        params,
        hash: decode(url.hash.replace(/^#/, "")),
        flags,
    };
}
