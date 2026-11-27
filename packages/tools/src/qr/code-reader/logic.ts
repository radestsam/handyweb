/*
 * What a scanned code holds, and how to show it. The decoding itself is in
 * decode.ts.
 */

export type Kind = "url" | "wifi" | "email" | "phone" | "sms" | "geo" | "contact" | "text";

export interface Wifi {
    ssid: string;
    password: string;
    security: string;
    hidden: boolean;
}

/** Reads WIFI:S:name;T:WPA;P:pass;H:true;; with \ escapes. */
export function parseWifi(text: string): Wifi | null {
    if (!/^WIFI:/i.test(text)) return null;
    const fields: Record<string, string> = {};
    const body = text.slice(5);
    let key = "";
    let value = "";
    let reading: "key" | "value" = "key";
    for (let i = 0; i < body.length; i++) {
        const char = body[i] as string;
        if (reading === "key") {
            if (char === ":") reading = "value";
            else if (char !== ";") key += char;
            continue;
        }
        if (char === "\\" && i + 1 < body.length) {
            value += body[++i];
        } else if (char === ";") {
            fields[key.toUpperCase()] = value;
            key = "";
            value = "";
            reading = "key";
        } else value += char;
    }
    if (key) fields[key.toUpperCase()] = value;
    return {
        ssid: fields.S ?? "",
        password: fields.P ?? "",
        security: fields.T ?? "nopass",
        hidden: (fields.H ?? "").toLowerCase() === "true",
    };
}

export function classify(text: string): Kind {
    const value = text.trim();
    if (/^https?:\/\//i.test(value)) return "url";
    if (/^WIFI:/i.test(value)) return "wifi";
    if (/^mailto:/i.test(value) || /^MATMSG:/i.test(value)) return "email";
    if (/^tel:/i.test(value)) return "phone";
    if (/^(sms|smsto):/i.test(value)) return "sms";
    if (/^geo:/i.test(value)) return "geo";
    if (/^BEGIN:VCARD/i.test(value) || /^MECARD:/i.test(value)) return "contact";
    return "text";
}

/** Only http and https links can be opened; javascript: and data: links are never opened. */
export function safeLink(text: string): string | null {
    try {
        const url = new URL(text.trim());
        return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
    } catch {
        return null;
    }
}
