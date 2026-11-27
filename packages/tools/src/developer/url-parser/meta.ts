import type { ToolDefinition } from "@handyweb/core";

export const urlParserMeta: ToolDefinition = {
    id: "url-parser",
    slug: "url-parser",
    aliases: ["url-inspector", "link-checker", "url-analyzer", "query-string-parser"],
    category: "developer",
    alsoIn: ["network", "encoding"],
    related: ["url-encoding", "qr-generator"],
    tags: ["url", "link", "parse", "security"],
    title: {
        fa: "بررسی و تجزیه نشانی (URL)",
        en: "URL Parser and Inspector",
    },
    description: {
        fa: "یک نشانی را به پروتکل، میزبان، مسیر و پارامترها جدا کنید، دامنه‌های فارسی (Punycode) را بخوانید و نشانه‌های پیوند فریب‌دهنده را ببینید.",
        en: "Split a URL into scheme, host, path, and parameters, read internationalized domains (Punycode), and see the signs of a deceptive link.",
    },
    keywords: {
        fa: ["بررسی لینک", "تجزیه url", "لینک مشکوک", "پارامتر url", "فیشینگ"],
        en: [
            "url parser",
            "url inspector",
            "check link",
            "query string parser",
            "phishing link",
            "punycode",
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
    limits: { maxInputBytes: 100_000 },
    limitations: {
        fa: "ابزار نشانی را باز نمی‌کند و از هیچ فهرست سیاهی کمک نمی‌گیرد. نبود نشانه هشدار به این معنا نیست که پیوند ایمن است.",
        en: "The tool does not open the URL or check any block list. No warning signs does not mean that a link is safe.",
    },
    guide: {
        steps: [
            { fa: "نشانی را بچسبانید.", en: "Paste the URL." },
            { fa: "نشانه‌های هشدار را بخوانید.", en: "Read the warning signs." },
            { fa: "هر بخش یا پارامتر را کپی کنید.", en: "Copy any part or parameter." },
        ],
        faq: [
            {
                question: {
                    fa: "نشانی باز یا بارگیری می‌شود؟",
                    en: "Is the URL opened or loaded?",
                },
                answer: {
                    fa: "نه. نشانی تنها با پارسر URL مرورگر خوانده می‌شود و هیچ درخواستی به آن فرستاده نمی‌شود.",
                    en: "No. The URL is only read with the URL parser of the browser, and no request is sent to it.",
                },
            },
        ],
    },
    example: "https://handyweb.ir/fa/tools/?q=%D8%B3%D9%84%D8%A7%D9%85&page=2#top",
};
