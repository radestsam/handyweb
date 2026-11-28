import type { LocalizedText } from "@handyweb/core";

export const strings = {
    lookup: { fa: "این نشانی در کدام بازه است؟", en: "Which range is this address in?" },
    invalid: { fa: "این نشانی IP درست نیست.", en: "This is not a valid IP address." },
    public: {
        fa: "این نشانی در هیچ بازه ویژه‌ای نیست، پس یک نشانی عمومی اینترنت است.",
        en: "This address is in no special range, so it is a public internet address.",
    },
    table: { fa: "بازه‌های ویژه", en: "Special ranges" },
    range: { fa: "بازه", en: "Range" },
    use: { fa: "کاربرد", en: "Use" },
    source: {
        fa: "منبع: فهرست‌های نشانی ویژه IPv4 و IPv6 در IANA (RFC 6890).",
        en: "Source: the IANA IPv4 and IPv6 special-purpose address registries (RFC 6890).",
    },
} as const satisfies Record<string, LocalizedText>;
