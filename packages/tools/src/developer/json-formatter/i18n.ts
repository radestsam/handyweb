import type { LocalizedText } from "@handyweb/core";

export const strings = {
    action: { fa: "کار", en: "Action" },
    format: { fa: "آراستن", en: "Format" },
    minify: { fa: "فشرده‌سازی", en: "Minify" },
    validate: { fa: "بررسی درستی", en: "Validate" },
    indent: { fa: "تورفتگی", en: "Indent" },
    spaces2: { fa: "۲ اسپیس", en: "2 spaces" },
    spaces4: { fa: "۴ اسپیس", en: "4 spaces" },
    tab: { fa: "Tab", en: "Tab" },
    sortKeys: { fa: "چیدن کلیدها از A تا Z", en: "Sort keys" },
    valid: { fa: "JSON درست است.", en: "The JSON is valid." },
    warnings: { fa: "هشدارها", en: "Warnings" },
    tooLarge: { fa: "ورودی بیش از ۲۰ مگابایت است.", en: "The input is larger than 20 MB." },
} as const satisfies Record<string, LocalizedText>;

export function duplicateKey(key: string, line: number, column: number): LocalizedText {
    return {
        fa: `کلید «${key}» بیش از یک بار آمده است (خط ${line}، ستون ${column}). تنها واپسین ارزش آن می‌ماند.`,
        en: `The key "${key}" appears more than once (line ${line}, column ${column}). Only the last value stays.`,
    };
}

export function precision(number: string, line: number, column: number): LocalizedText {
    return {
        fa: `شماره ${number} (خط ${line}، ستون ${column}) در JavaScript بی‌کم‌وکاست نمی‌ماند.`,
        en: `The number ${number} (line ${line}, column ${column}) loses precision in JavaScript.`,
    };
}
