import type { ToolDefinition } from "@handyweb/core";

export const userAgentParserMeta: ToolDefinition = {
    id: "user-agent-parser",
    slug: "user-agent-parser",
    aliases: ["user-agent", "ua-parser", "what-is-my-browser", "browser-detector"],
    category: "developer",
    alsoIn: ["network"],
    related: ["http-header-parser", "url-parser"],
    tags: ["user-agent", "browser", "os"],
    title: {
        fa: "خواندن User-Agent مرورگر",
        en: "User-Agent Parser",
    },
    description: {
        fa: "یک رشته User-Agent را بخوانید تا مرورگر، موتور، سیستم‌عامل، گونه دستگاه و ربات‌های شناخته‌شده را ببینید. User-Agent مرورگر خودتان را هم می‌توانید بیازمایید.",
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
        faq: [
            {
                question: {
                    fa: "User-Agent من فرستاده می‌شود؟",
                    en: "Is my User-Agent sent anywhere?",
                },
                answer: {
                    fa: "نه. ابزار تنها navigator.userAgent را در همین صفحه می‌خواند. البته مرورگر شما آن را با هر درخواستی به هر سایتی می‌فرستد.",
                    en: "No. The tool only reads navigator.userAgent on this page. Your browser does send it with every request to every site, though.",
                },
            },
        ],
    },
    example:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
};
