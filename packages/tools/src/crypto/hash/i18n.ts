import type { LocalizedText } from "@handyweb/core";

export const strings = {
    source: { fa: "ورودی", en: "Source" },
    text: { fa: "نوشته", en: "Text" },
    file: { fa: "فایل", en: "File" },
    encoding: { fa: "گونه خروجی", en: "Output format" },
    hex: { fa: "هگز", en: "Hex" },
    base64: { fa: "Base64", en: "Base64" },
    algorithm: { fa: "الگوریتم", en: "Algorithm" },
    legacy: { fa: "قدیمی", en: "legacy" },
    legacyWarning: {
        fa: "MD5 و SHA-1 شکسته‌اند: می‌توان دو فایل با هش یکسان ساخت. آن‌ها را تنها برای سنجیدن checksumهای قدیمی به کار ببرید، نه برای امنیت.",
        en: "MD5 and SHA-1 are broken: two files with the same hash can be made. Use them only to check old checksums, not for security.",
    },
    expected: {
        fa: "سنجش با هشی که دارید (دلخواه)",
        en: "Compare with an expected hash (optional)",
    },
    match: { fa: "هش‌ها یکسان‌اند.", en: "The hashes match." },
    mismatch: { fa: "هش‌ها یکسان نیستند.", en: "The hashes do not match." },
    tooLarge: {
        fa: "نوشته بیش از ۲۰ مگابایت است. آن را در یک فایل بدهید.",
        en: "The text is larger than 20 MB. Use a file instead.",
    },
} as const satisfies Record<string, LocalizedText>;

/** The title of the result box, such as "SHA-256 hash". */
export function digestLabel(algorithm: string): LocalizedText {
    return { fa: `هش ${algorithm}`, en: `${algorithm} hash` };
}
