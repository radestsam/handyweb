import type { ToolDefinition } from "@handyweb/core";

export const ipRangesMeta: ToolDefinition = {
    id: "ip-ranges",
    slug: "ip-ranges",
    aliases: ["private-ip-ranges", "reserved-ip-addresses", "is-ip-private", "special-ip-ranges"],
    category: "network",
    alsoIn: [],
    related: ["ip-calculator", "mac-formatter"],
    tags: ["ip", "private", "reserved", "reference"],
    title: { fa: "بازه‌های IP خصوصی و رزرو", en: "Private and Reserved IP Ranges" },
    description: {
        fa: "ببینید یک نشانی IPv4 یا IPv6 خصوصی، Loopback، Link-local، CGNAT، برای مستندات یا عمومی است، و فهرست بازه‌های ویژه IANA را بخوانید.",
        en: "See whether an IPv4 or IPv6 address is private, loopback, link-local, CGNAT, for documentation, or public, and read the IANA special ranges.",
    },
    keywords: {
        fa: ["ip خصوصی", "بازه ip خصوصی", "ip رزرو", "آیپی لوکال", "cgnat"],
        en: [
            "private ip ranges",
            "reserved ip addresses",
            "is this ip private",
            "rfc 1918",
            "cgnat range",
        ],
    },
    presets: [],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["text"],
    outputKinds: ["structured"],
    limits: { maxInputBytes: 200 },
    limitations: {
        fa: "تنها بازه‌های ویژه IANA آمده‌اند. ابزار نمی‌گوید یک نشانی عمومی از آن کدام کشور یا شرکت است و به اینترنت درخواستی نمی‌فرستد.",
        en: "Only the IANA special ranges are listed. The tool does not say which country or company owns a public address, and it sends no request to the internet.",
    },
    guide: {
        steps: [
            { fa: "نشانی IP را بنویسید.", en: "Type an IP address." },
            {
                fa: "بازه ویژه آن یا عمومی بودنش را ببینید.",
                en: "See its special range, or that it is public.",
            },
        ],
        faq: [
            {
                question: { fa: "بازه‌های IP خصوصی کدام‌اند؟", en: "Which IP ranges are private?" },
                answer: {
                    fa: "10.0.0.0/8، 172.16.0.0/12 و 192.168.0.0/16 در IPv4 (RFC 1918)، و fc00::/7 در IPv6. 100.64.0.0/10 برای NAT اپراتور است.",
                    en: "10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16 in IPv4 (RFC 1918), and fc00::/7 in IPv6. 100.64.0.0/10 is for carrier NAT.",
                },
            },
        ],
    },
    example: "100.64.1.1",
};
