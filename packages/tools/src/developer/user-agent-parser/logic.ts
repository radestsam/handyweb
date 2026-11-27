/*
 * User-Agent parsing with a small set of documented rules. Browsers now
 * reduce their User-Agent: Chrome reports a fixed minor version and fixed OS
 * versions (for example "Windows NT 10.0" for Windows 10 and 11). So the
 * result is a best guess, not a fact.
 */

export interface ParsedAgent {
    browser: string | null;
    browserVersion: string | null;
    engine: string | null;
    os: string | null;
    osVersion: string | null;
    device: "desktop" | "mobile" | "tablet" | "bot" | "unknown";
    bot: string | null;
}

const BOTS: Array<[string, RegExp]> = [
    ["Googlebot", /Googlebot/i],
    ["Bingbot", /bingbot/i],
    ["YandexBot", /YandexBot/i],
    ["DuckDuckBot", /DuckDuckBot/i],
    ["Baiduspider", /Baiduspider/i],
    ["Applebot", /Applebot/i],
    ["facebookexternalhit", /facebookexternalhit/i],
    ["Twitterbot", /Twitterbot/i],
    ["GPTBot", /GPTBot/i],
    ["curl", /^curl\//i],
    ["Wget", /^Wget\//i],
    ["Python requests", /python-requests/i],
];

/** Order matters: Edge, Opera, Samsung, and Yandex also say "Chrome", and Chrome also says "Safari". */
const BROWSERS: Array<[string, RegExp]> = [
    ["Edge", /Edg(?:e|A|iOS)?\/([\d.]+)/],
    ["Opera", /(?:OPR|Opera)\/([\d.]+)/],
    ["Samsung Internet", /SamsungBrowser\/([\d.]+)/],
    ["Yandex Browser", /YaBrowser\/([\d.]+)/],
    ["Vivaldi", /Vivaldi\/([\d.]+)/],
    ["Firefox", /(?:Firefox|FxiOS)\/([\d.]+)/],
    ["Chrome", /(?:Chrome|CriOS)\/([\d.]+)/],
    ["Safari", /Version\/([\d.]+).*Safari\//],
];

const WINDOWS: Record<string, string> = {
    "10.0": "10 or 11",
    "6.3": "8.1",
    "6.2": "8",
    "6.1": "7",
    "6.0": "Vista",
    "5.1": "XP",
};

function os(ua: string): [string | null, string | null] {
    let m: RegExpExecArray | null;
    if ((m = /Windows NT ([\d.]+)/.exec(ua)))
        return ["Windows", WINDOWS[m[1] as string] ?? m[1] ?? null];
    if ((m = /(?:iPhone|iPad|iPod).*? OS ([\d_]+)/.exec(ua))) {
        return [/iPad/.test(ua) ? "iPadOS" : "iOS", (m[1] as string).replace(/_/g, ".")];
    }
    if ((m = /Android ([\d.]+)/.exec(ua))) return ["Android", m[1] ?? null];
    if (/Android/.test(ua)) return ["Android", null];
    if ((m = /Mac OS X ([\d_.]+)/.exec(ua))) return ["macOS", (m[1] as string).replace(/_/g, ".")];
    if (/CrOS/.test(ua)) return ["ChromeOS", null];
    if (/Linux/.test(ua)) return ["Linux", null];
    return [null, null];
}

export function parseUserAgent(input: string): ParsedAgent {
    const ua = input.trim();
    const bot = BOTS.find(([, test]) => test.test(ua))?.[0] ?? null;
    let browser: string | null = null;
    let browserVersion: string | null = null;
    for (const [name, test] of BROWSERS) {
        const m = test.exec(ua);
        if (m) {
            browser = name;
            browserVersion = m[1] ?? null;
            break;
        }
    }
    const engine =
        /Gecko\/\d/.test(ua) && /Firefox/.test(ua)
            ? "Gecko"
            : /(?:iPhone|iPad|iPod)/.test(ua)
              ? "WebKit"
              : /Chrome\//.test(ua)
                ? "Blink"
                : /AppleWebKit/.test(ua)
                  ? "WebKit"
                  : null;
    const [osName, osVersion] = os(ua);
    const device: ParsedAgent["device"] = bot
        ? "bot"
        : /iPad|Tablet|SM-T\d/.test(ua) || (/Android/.test(ua) && !/Mobile/.test(ua))
          ? "tablet"
          : /Mobi|iPhone|iPod|Android/.test(ua)
            ? "mobile"
            : osName
              ? "desktop"
              : "unknown";
    return { browser, browserVersion, engine, os: osName, osVersion, device, bot };
}
