import type { LocalizedText } from "@handyweb/core";

export const strings = {
    search: {
        fa: "پسوند، نام فایل، نوع MIME یا واژه",
        en: "Extension, file name, MIME type, or word",
    },
    none: { fa: "چیزی پیدا نشد.", en: "Nothing was found." },
    type: { fa: "نوع MIME", en: "MIME type" },
    extensions: { fa: "پسوندها", en: "Extensions" },
    source: {
        fa: "منبع: فهرست نوع‌های رسانه IANA و پسوندهای رایج، نسخه",
        en: "Source: the IANA media type registry and common extensions, version",
    },
    warning: {
        fa: "پسوند و نوع MIME تنها برچسب‌اند و فایل می‌تواند چیز دیگری باشد. برای شناختن نوع واقعی، ابزار تشخیص نوع فایل را به کار ببرید.",
        en: "An extension and a MIME type are only labels, and the file can be something else. To find the real type, use the File Type Detector.",
    },
} as const satisfies Record<string, LocalizedText>;
