import type { ToolDefinition } from "@handyweb/core";

export const ipCalculatorMeta: ToolDefinition = {
    id: "ip-calculator",
    slug: "ip-calculator",
    aliases: ["subnet-calculator", "cidr-calculator", "ipv4-calculator", "ipv6-calculator"],
    category: "network",
    alsoIn: ["developer"],
    related: ["url-parser"],
    tags: ["ip", "subnet", "cidr", "network"],
    title: { fa: "محاسبه زیرشبکه IP (CIDR)", en: "IP Subnet Calculator (CIDR)" },
    description: {
        fa: "نشانی شبکه، Broadcast، ماسک، بازه میزبان‌ها و شمار نشانی‌ها را برای IPv4 و IPv6 حساب کنید و ببینید نشانی خصوصی یا رزرو است.",
        en: "Work out the network, broadcast, mask, host range, and address count for IPv4 and IPv6, and see whether an address is private or reserved.",
    },
    keywords: {
        fa: ["محاسبه subnet", "ساب نت", "محاسبه cidr", "ماسک زیرشبکه", "محاسبه ip"],
        en: ["subnet calculator", "cidr calculator", "ip calculator", "ipv6 subnet", "subnet mask"],
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
        fa: "یک زیرشبکه در هر بار؛ تقسیم به زیرشبکه‌های کوچک‌تر و جمع کردن بازه‌ها پشتیبانی نمی‌شود. نام بازه‌های ویژه از فهرست IANA است و ابزار مالک نشانی را نمی‌داند.",
        en: "One subnet at a time; splitting into smaller subnets and merging ranges are not supported. Special range names come from the IANA lists; the tool does not know who owns an address.",
    },
    guide: {
        steps: [
            {
                fa: "نشانی و پیشوند (مانند /24) یا ماسک را بنویسید.",
                en: "Enter the address and the prefix (such as /24) or the mask.",
            },
            {
                fa: "شبکه، بازه میزبان‌ها و ماسک‌ها را ببینید.",
                en: "Read the network, the host range, and the masks.",
            },
        ],
        faq: [
            {
                question: { fa: "/24 چند میزبان دارد؟", en: "How many hosts does a /24 have?" },
                answer: {
                    fa: "۲۵۶ نشانی، که ۲۵۴ تای آن میزبان‌اند؛ نشانی شبکه و Broadcast کنار گذاشته می‌شوند.",
                    en: "256 addresses, of which 254 are hosts; the network and broadcast addresses are left out.",
                },
            },
        ],
    },
    example: "192.168.1.10/24",
};
