import type { LocalizedText } from "@handyweb/core";

export const strings = {
    compare: { fa: "سنجش خط‌ها", en: "Comparison" },
    trim: {
        fa: "نادیده گرفتن اسپیس آغاز و پایان خط",
        en: "Ignore spaces at the start and end",
    },
    ignoreCase: { fa: "نادیده گرفتن بزرگی و کوچکی حروف لاتین", en: "Ignore letter case" },
    removeEmpty: { fa: "پاک کردن همه خط‌های خالی", en: "Remove all empty lines" },
    duplicates: { fa: "خط تکراری برداشته شد", en: "duplicate lines removed" },
    duplicate: { fa: "خط تکراری برداشته شد", en: "duplicate line removed" },
    empty: { fa: "خط خالی برداشته شد", en: "empty lines removed" },
    emptyOne: { fa: "خط خالی برداشته شد", en: "empty line removed" },
} as const satisfies Record<string, LocalizedText>;
