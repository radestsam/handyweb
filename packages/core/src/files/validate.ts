import type { LocalizedText } from "../i18n/locales";

export type FileCheck =
    { ok: true } | { ok: false; code: "empty" | "too-large"; message: LocalizedText };

/** Formats a byte count for people: 1.5 MB. Uses decimal units, like most file managers. */
export function formatBytes(bytes: number, locale: "fa" | "en" = "en"): string {
    const units =
        locale === "fa" ? ["بایت", "کیلوبایت", "مگابایت", "گیگابایت"] : ["B", "KB", "MB", "GB"];
    let value = bytes;
    let unit = 0;
    while (value >= 1000 && unit < units.length - 1) {
        value /= 1000;
        unit++;
    }
    const number = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en", {
        maximumFractionDigits: unit === 0 ? 0 : 1,
    }).format(value);
    return `${number} ${units[unit]}`;
}

/** Checks a file against the size limit of a tool before it is read. */
export function checkFileSize(file: { size: number }, maxBytes: number | undefined): FileCheck {
    if (file.size === 0) {
        return {
            ok: false,
            code: "empty",
            message: { fa: "فایل خالی است.", en: "The file is empty." },
        };
    }
    if (maxBytes !== undefined && file.size > maxBytes) {
        return {
            ok: false,
            code: "too-large",
            message: {
                fa: `حجم فایل ${formatBytes(file.size, "fa")} است. این ابزار حداکثر ${formatBytes(maxBytes, "fa")} را می‌پذیرد.`,
                en: `The file is ${formatBytes(file.size)}. This tool accepts up to ${formatBytes(maxBytes)}.`,
            },
        };
    }
    return { ok: true };
}
