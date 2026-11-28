import type { ToolDefinition } from "@handyweb/core";

export const httpHeaderParserMeta: ToolDefinition = {
    id: "http-header-parser",
    slug: "http-header-parser",
    aliases: ["http-headers", "security-headers-check", "header-analyzer", "set-cookie-parser"],
    category: "developer",
    alsoIn: ["network"],
    related: ["url-parser", "user-agent-parser"],
    tags: ["http", "headers", "security"],
    title: {
        fa: "خواندن سربرگ‌های HTTP",
        en: "HTTP Header Parser",
    },
    description: {
        fa: "سربرگ‌های HTTP را از ابزار برنامه‌نویس مرورگر یا curl بچسبانید تا هر یک را با توضیح ببینید و سربرگ‌های امنیتی و کوکی‌ها را بسنجید.",
        en: "Paste HTTP headers from the browser developer tools or curl to see each one explained, and to check the security headers and cookies.",
    },
    keywords: {
        fa: ["سربرگ http", "هدر http", "بررسی هدر امنیتی", "کوکی"],
        en: ["http headers", "security headers", "header parser", "set-cookie", "hsts check"],
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
    limits: { maxInputBytes: 1_000_000 },
    limitations: {
        fa: "ابزار هیچ درخواستی نمی‌فرستد: تنها سربرگ‌هایی را می‌خواند که شما می‌چسبانید. بررسی امنیتی تنها بودن سربرگ‌ها را می‌سنجد، نه درستی هر قاعده CSP را.",
        en: "The tool sends no request: it reads only the headers you paste. The security check looks at which headers exist, not at every CSP rule.",
    },
    guide: {
        steps: [
            {
                fa: "در ابزار برنامه‌نویس مرورگر، سربرگ‌های یک درخواست یا پاسخ را کپی کنید، یا خروجی curl -I را بردارید.",
                en: "Copy the headers of a request or response from the browser developer tools, or take the output of curl -I.",
            },
            { fa: "آن‌ها را بچسبانید.", en: "Paste them." },
            {
                fa: "توضیح‌ها و بررسی امنیتی را بخوانید.",
                en: "Read the explanations and the security check.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "سربرگ‌ها جایی فرستاده می‌شوند؟",
                    en: "Are the headers sent anywhere?",
                },
                answer: {
                    fa: "نه. همه چیز در مرورگر شما خوانده می‌شود. با این همه، کوکی و Authorization را با کسی هم‌رسانی نکنید.",
                    en: "No. Everything is read in your browser. Still, do not share Cookie or Authorization values with anyone.",
                },
            },
        ],
    },
    example:
        "HTTP/2 200 OK\ncontent-type: text/html\nstrict-transport-security: max-age=31536000\nx-content-type-options: nosniff",
};
