import type { LocalizedText } from "@handyweb/core";

export const strings = {
    mode: { fa: "کار", en: "Action" },
    generate: { fa: "ساخت", en: "Generate" },
    verify: { fa: "بررسی", en: "Verify" },
    algorithm: { fa: "الگوریتم", en: "Algorithm" },
    message: { fa: "پیام", en: "Message" },
    key: { fa: "کلید پنهان", en: "Secret key" },
    keyFormat: { fa: "شکل کلید", en: "Key format" },
    text: { fa: "نوشته", en: "Text" },
    hex: { fa: "هگز", en: "Hex" },
    base64: { fa: "Base64", en: "Base64" },
    encoding: { fa: "گونه خروجی", en: "Output format" },
    expected: { fa: "HMAC که دریافت کرده‌اید", en: "The HMAC you received" },
    match: {
        fa: "HMAC درست است: پیام با همین کلید امضا شده است.",
        en: "The HMAC matches: the message was signed with this key.",
    },
    mismatch: { fa: "HMAC یکسان نیست.", en: "The HMAC does not match." },
    unreadable: {
        fa: "این مقدار هگز یا Base64 با درازای این الگوریتم نیست.",
        en: "This value is not hex or Base64 of the right length for this algorithm.",
    },
} as const satisfies Record<string, LocalizedText>;

export function macLabel(algorithm: string): LocalizedText {
    return { fa: `HMAC-${algorithm}`, en: `HMAC-${algorithm}` };
}
