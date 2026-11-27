import { describe, expect, it } from "vitest";
import { parseWifi } from "../code-reader/logic";
import { emailPayload, vcardPayload, wifiPayload } from "./payloads";

describe("QR payloads", () => {
    it("writes Wi-Fi settings that the reader reads back", () => {
        const fields = {
            ssid: 'Cafe;Net "5G"',
            password: "a:b\\c,d",
            security: "WPA" as const,
            hidden: true,
        };
        const payload = wifiPayload(fields);
        expect(payload).toBe('WIFI:T:WPA;S:Cafe\\;Net \\"5G\\";P:a\\:b\\\\c\\,d;H:true;;');
        expect(parseWifi(payload)).toEqual({
            ssid: fields.ssid,
            password: fields.password,
            security: "WPA",
            hidden: true,
        });
        expect(
            wifiPayload({ ssid: "Open", password: "x", security: "nopass", hidden: false }),
        ).toBe("WIFI:T:nopass;S:Open;;");
    });

    it("writes an email link with Persian text", () => {
        expect(emailPayload({ to: "info@example.com", subject: "سلام", body: "a&b" })).toBe(
            "mailto:info@example.com?subject=%D8%B3%D9%84%D8%A7%D9%85&body=a%26b",
        );
        expect(emailPayload({ to: "a@b.c", subject: "", body: "" })).toBe("mailto:a@b.c");
    });

    it("writes a vCard with escapes and CRLF lines", () => {
        const card = vcardPayload({
            name: "علی، رضایی",
            phone: "+989121234567",
            email: "",
            organization: "Hand;y",
            url: "",
        });
        expect(card.split("\r\n")).toEqual([
            "BEGIN:VCARD",
            "VERSION:3.0",
            "N:;علی، رضایی;;;",
            "FN:علی، رضایی",
            "TEL;TYPE=CELL:+989121234567",
            "ORG:Hand\\;y",
            "END:VCARD",
        ]);
    });
});
