import type { ToolDefinition } from "@handyweb/core";

export const userAgentParserMeta: ToolDefinition = {
    id: "user-agent-parser",
    slug: "user-agent-parser",
    aliases: ["user-agent", "ua-parser", "what-is-my-browser", "browser-detector"],
    category: "developer",
    alsoIn: ["network"],
    related: ["http-header-parser", "url-parser"],
    tags: ["user-agent", "browser", "os"],
    title: { fa: "خواندن User-Agent مرورگر", en: "User-Agent Parser" },
    seoTitle: {
        fa: "خواندن User-Agent مرورگر و تشخیص سیستم‌عامل",
        en: "User-Agent Parser: Browser, OS, and Device",
    },
    description: {
        fa: "تشخیص مرورگر از رشته یوزر ایجنت (User-Agent): مرورگر، موتور، سیستم‌عامل، نوع دستگاه و ربات‌های شناخته‌شده. User-Agent مرورگر خودتان را هم ببینید.",
        en: "Read a User-Agent string to see the browser, engine, operating system, device type, and known bots. You can also check your own browser's User-Agent.",
    },
    keywords: {
        fa: ["یوزر ایجنت", "مرورگر من چیست", "تشخیص مرورگر", "user agent"],
        en: [
            "user agent parser",
            "what is my browser",
            "ua parser",
            "browser detection",
            "googlebot user agent",
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
    limits: { maxInputBytes: 10_000 },
    limitations: {
        fa: "قاعده‌ها مرورگرها و ربات‌های رایج را می‌شناسند. مرورگرهای امروزی User-Agent را کوتاه می‌کنند، پس نسخه دقیق سیستم‌عامل همیشه پیدا نیست. هر کسی می‌تواند User-Agent دروغین بفرستد.",
        en: "The rules know common browsers and bots. Modern browsers reduce the User-Agent, so the exact OS version is not always there. Anyone can send a fake User-Agent.",
    },
    guide: {
        steps: [
            {
                fa: "یک User-Agent را بچسبانید یا «User-Agent این مرورگر» را بزنید.",
                en: "Paste a User-Agent or select “This browser's User-Agent”.",
            },
            {
                fa: "مرورگر، سیستم‌عامل و دستگاه را بخوانید.",
                en: "Read the browser, OS, and device.",
            },
        ],
        faq: [],
    },
    example:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
};
