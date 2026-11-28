import type { ToolDefinition } from "@handyweb/core";

export const romanNumeralsMeta: ToolDefinition = {
    id: "roman-numerals",
    slug: "roman-numerals",
    aliases: ["roman-numeral-converter", "number-to-roman", "roman-to-number"],
    category: "calculators",
    alsoIn: [],
    related: ["number-base", "unit-converter"],
    tags: ["roman", "numerals", "convert"],
    title: { fa: "تبدیل عدد رومی", en: "Roman Numeral Converter" },
    description: {
        fa: "عدد را به عدد رومی و عدد رومی را به عدد تبدیل کنید، از ۱ تا ۳۹۹۹، با اعداد فارسی یا انگلیسی.",
        en: "Convert numbers to Roman numerals and Roman numerals to numbers, from 1 to 3999.",
    },
    keywords: {
        fa: ["عدد رومی", "تبدیل عدد به رومی", "اعداد رومی", "تبدیل رومی به عدد"],
        en: [
            "roman numeral converter",
            "number to roman numerals",
            "roman numerals to numbers",
            "roman numerals",
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
    limits: { maxInputBytes: 100 },
    limitations: {
        fa: "تنها ۱ تا ۳۹۹۹ و شکل استاندارد (IV نه IIII). نوشتن با خط بالا برای اعداد بزرگ‌تر پشتیبانی نمی‌شود.",
        en: "Only 1 to 3999 and the standard form (IV, not IIII). The overline form for larger numbers is not supported.",
    },
    guide: {
        steps: [
            { fa: "عدد یا عدد رومی را بنویسید.", en: "Type a number or a Roman numeral." },
            { fa: "نتیجه را ببینید و کپی کنید.", en: "Read and copy the result." },
        ],
        faq: [
            {
                question: { fa: "چرا IIII پذیرفته نمی‌شود؟", en: "Why is IIII not accepted?" },
                answer: {
                    fa: "در شکل استاندارد، ۴ به شکل IV نوشته می‌شود. IIII گاهی روی ساعت دیده می‌شود، اما استاندارد نیست.",
                    en: "In the standard form, 4 is written IV. IIII is sometimes seen on clocks, but it is not standard.",
                },
            },
        ],
    },
    example: "2026",
};
