import { describe, expect, it } from "vitest";
import { parseUserAgent } from "./logic";

describe("parseUserAgent", () => {
    it("reads Chrome on Windows", () => {
        expect(
            parseUserAgent(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            ),
        ).toEqual({
            browser: "Chrome",
            browserVersion: "131.0.0.0",
            engine: "Blink",
            os: "Windows",
            osVersion: "10 or 11",
            device: "desktop",
            bot: null,
        });
    });

    it("reads Edge before Chrome", () => {
        expect(
            parseUserAgent(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.2903.70",
            ),
        ).toMatchObject({ browser: "Edge", browserVersion: "131.0.2903.70" });
    });

    it("reads Safari on iPhone and Chrome on iOS", () => {
        expect(
            parseUserAgent(
                "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
            ),
        ).toMatchObject({
            browser: "Safari",
            os: "iOS",
            osVersion: "17.5",
            device: "mobile",
            engine: "WebKit",
        });
        expect(
            parseUserAgent(
                "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0 Mobile/15E148 Safari/604.1",
            ),
        ).toMatchObject({ browser: "Chrome", engine: "WebKit" });
    });

    it("reads Firefox on Android and Samsung Internet on a tablet", () => {
        expect(
            parseUserAgent("Mozilla/5.0 (Android 14; Mobile; rv:132.0) Gecko/132.0 Firefox/132.0"),
        ).toMatchObject({
            browser: "Firefox",
            engine: "Gecko",
            os: "Android",
            osVersion: "14",
            device: "mobile",
        });
        expect(
            parseUserAgent(
                "Mozilla/5.0 (Linux; Android 13; SM-T870) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/26.0 Chrome/122.0.0.0 Safari/537.36",
            ),
        ).toMatchObject({ browser: "Samsung Internet", device: "tablet" });
    });

    it("finds bots", () => {
        expect(
            parseUserAgent(
                "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
            ),
        ).toMatchObject({ bot: "Googlebot", device: "bot" });
        expect(parseUserAgent("curl/8.7.1")).toMatchObject({ bot: "curl", device: "bot" });
    });

    it("reads macOS", () => {
        expect(
            parseUserAgent(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15",
            ),
        ).toMatchObject({
            browser: "Safari",
            os: "macOS",
            osVersion: "10.15.7",
            device: "desktop",
        });
    });
});
