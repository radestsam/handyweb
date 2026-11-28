import type { ToolDefinition } from "@handyweb/core";

export const macFormatterMeta: ToolDefinition = {
    id: "mac-formatter",
    slug: "mac-formatter",
    aliases: ["mac-address-formatter", "mac-address-converter", "mac-address-format"],
    category: "network",
    alsoIn: ["developer"],
    related: ["ip-calculator"],
    tags: ["mac", "network", "format"],
    title: { fa: "تبدیل شکل نشانی MAC", en: "MAC Address Formatter" },
    description: {
        fa: "نشانی‌های MAC را میان شکل‌های 00:1A:2B، 00-1A-2B، 001A.2B3C و بی‌جداکننده تبدیل کنید و ببینید نشانی محلی، تصادفی یا چندپخشی است.",
        en: "Convert MAC addresses between the 00:1A:2B, 00-1A-2B, 001A.2B3C, and plain styles, and see whether an address is local, random, or multicast.",
    },
    keywords: {
        fa: ["نشانی mac", "تبدیل مک آدرس", "فرمت mac address", "مک آدرس"],
        en: [
            "mac address formatter",
            "mac address converter",
            "mac format",
            "cisco mac format",
            "eui-64",
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
    outputKinds: ["text"],
    limits: { maxInputBytes: 1_000_000 },
    limitations: {
        fa: "تنها نشانی‌های ۴۸ بیتی (EUI-48). نام سازنده از روی OUI نشان داده نمی‌شود.",
        en: "Only 48-bit addresses (EUI-48). The maker name is not shown from the OUI.",
    },
    guide: {
        steps: [
            { fa: "نشانی‌ها را، هر خط یکی، بچسبانید.", en: "Paste the addresses, one per line." },
            { fa: "شکل خروجی را برگزینید.", en: "Choose the output style." },
            { fa: "خروجی را کپی کنید.", en: "Copy the output." },
        ],
        faq: [
            {
                question: {
                    fa: "چرا نشانی MAC گوشی من هر بار عوض می‌شود؟",
                    en: "Why does my phone's MAC address change?",
                },
                answer: {
                    fa: "اندروید و iOS برای حریم خصوصی، برای هر شبکه Wi-Fi نشانی تصادفی می‌سازند. این نشانی‌ها بیت «محلی» را دارند.",
                    en: "Android and iOS make a random address for each Wi-Fi network, for privacy. These addresses have the “local” bit set.",
                },
            },
        ],
    },
    example: "00-1a-2b-3c-4d-5e",
};
