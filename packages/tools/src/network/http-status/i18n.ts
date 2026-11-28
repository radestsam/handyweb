import type { LocalizedText } from "@handyweb/core";

export const strings = {
    search: { fa: "جستجوی کد یا واژه", en: "Search a code or a word" },
    all: { fa: "همه", en: "All" },
    group: { fa: "دسته", en: "Class" },
    none: { fa: "چیزی پیدا نشد.", en: "Nothing was found." },
    source: {
        fa: "منبع: فهرست کدهای وضعیت HTTP در IANA، نسخه",
        en: "Source: the IANA HTTP status code registry, version",
    },
} as const satisfies Record<string, LocalizedText>;
