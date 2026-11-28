/*
 * The text formats that phone cameras read from QR codes: Wi-Fi network
 * settings (the ZXing "WIFI:" format), an email (mailto:, RFC 6068), and a
 * contact card (vCard 3.0, RFC 2426). Persian text is fine: QR codes hold
 * UTF-8.
 */

export interface WifiFields {
    ssid: string;
    password: string;
    security: "WPA" | "WEP" | "nopass";
    hidden: boolean;
}

const wifiEscape = (value: string) => value.replace(/([\\;,:"])/g, "\\$1");

export function wifiPayload(fields: WifiFields): string {
    const parts = [`T:${fields.security}`, `S:${wifiEscape(fields.ssid)}`];
    if (fields.security !== "nopass") parts.push(`P:${wifiEscape(fields.password)}`);
    if (fields.hidden) parts.push("H:true");
    return `WIFI:${parts.join(";")};;`;
}

export interface EmailFields {
    to: string;
    subject: string;
    body: string;
}

export function emailPayload(fields: EmailFields): string {
    const query = [
        fields.subject && `subject=${encodeURIComponent(fields.subject)}`,
        fields.body && `body=${encodeURIComponent(fields.body)}`,
    ].filter(Boolean);
    return `mailto:${fields.to.trim()}${query.length ? `?${query.join("&")}` : ""}`;
}

export interface ContactFields {
    name: string;
    phone: string;
    email: string;
    organization: string;
    url: string;
}

const vcardEscape = (value: string) =>
    value
        .replace(/\\/g, "\\\\")
        .replace(/([,;])/g, "\\$1")
        .replace(/\r?\n/g, "\\n");

export function vcardPayload(fields: ContactFields): string {
    const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:;${vcardEscape(fields.name)};;;`,
        `FN:${vcardEscape(fields.name)}`,
    ];
    if (fields.phone.trim()) lines.push(`TEL;TYPE=CELL:${fields.phone.trim()}`);
    if (fields.email.trim()) lines.push(`EMAIL:${fields.email.trim()}`);
    if (fields.organization.trim()) lines.push(`ORG:${vcardEscape(fields.organization.trim())}`);
    if (fields.url.trim()) lines.push(`URL:${fields.url.trim()}`);
    lines.push("END:VCARD");
    // vCard lines end with CRLF.
    return lines.join("\r\n");
}
