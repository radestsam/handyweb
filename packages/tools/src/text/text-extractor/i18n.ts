import type { LocalizedText } from "@handyweb/core";
import type { ExtractKind } from "./logic";

export const strings = {
    kind: { fa: "بیرون کشیدن", en: "Extract" },
    unique: { fa: "بدون تکرار", en: "Remove duplicates" },
    sort: { fa: "مرتب‌سازی", en: "Sort" },
    found: { fa: "یافته", en: "found" },
} as const satisfies Record<string, LocalizedText>;

export const kindLabels: Record<ExtractKind, LocalizedText> = {
    emails: { fa: "ایمیل", en: "Emails" },
    urls: { fa: "نشانی وب", en: "URLs" },
    phones: { fa: "تلفن", en: "Phones" },
    numbers: { fa: "شماره", en: "Numbers" },
    hashtags: { fa: "هشتگ", en: "Hashtags" },
    mentions: { fa: "منشن", en: "Mentions" },
};
