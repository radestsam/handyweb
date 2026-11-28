import type { LocalizedText } from "@handyweb/core";
import type { AlphabetName } from "./logic";

export const strings = {
    kind: { fa: "گونه", en: "Type" },
    token: { fa: "توکن", en: "Token" },
    bytes: { fa: "بایت تصادفی", en: "Random bytes" },
    alphabet: { fa: "نویسه‌ها", en: "Characters" },
    length: { fa: "درازا (نویسه)", en: "Length (characters)" },
    byteCount: { fa: "شمار بایت‌ها", en: "Number of bytes" },
    encoding: { fa: "گونه خروجی", en: "Output format" },
    hex: { fa: "هگز", en: "Hex" },
    base64: { fa: "Base64", en: "Base64" },
    base64url: { fa: "Base64url", en: "Base64url" },
    count: { fa: "چند تا", en: "How many" },
    output: { fa: "خروجی (هر کدام در یک خط)", en: "Output (one per line)" },
    regenerate: { fa: "ساخت دوباره", en: "Generate again" },
    bits: { fa: "بیت تصادف در هر کدام", en: "bits of randomness each" },
    note: {
        fa: "همه مقدارها با crypto.getRandomValues مرورگر ساخته می‌شوند و جایی نگه داشته یا فرستاده نمی‌شوند.",
        en: "Every value comes from crypto.getRandomValues of your browser. Nothing is stored or sent.",
    },
} as const satisfies Record<string, LocalizedText>;

export const alphabetLabels: Record<AlphabetName, LocalizedText> = {
    hex: { fa: "هگز", en: "Hex" },
    base64url: { fa: "Base64url", en: "Base64url" },
    alphanumeric: { fa: "حرف و رقم", en: "A-z 0-9" },
    numeric: { fa: "تنها رقم", en: "0-9" },
};
