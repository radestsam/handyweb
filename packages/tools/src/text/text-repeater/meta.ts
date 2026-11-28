import type { ToolDefinition } from "@handyweb/core";

export const textRepeaterMeta: ToolDefinition = {
    id: "text-repeater",
    slug: "text-repeater",
    aliases: ["repeat-text", "text-multiplier"],
    category: "text",
    alsoIn: [],
    related: ["split-join", "text-counter"],
    tags: ["text", "repeat"],
    title: { fa: "تکرار متن", en: "Text Repeater" },
    seoTitle: {
        fa: "تکرار متن و کلمه به تعداد دلخواه",
        en: "Text Repeater: Repeat Text Many Times",
    },
    description: {
        fa: "تکرار متن یا کلمه به تعداد دلخواه، با خط تازه، اسپیس یا جداکننده دلخواه میان نمونه‌ها.",
        en: "Repeat a text a number of times, with a new line, a space, or a custom separator between the copies.",
    },
    keywords: {
        fa: ["تکرار متن", "تکرار کلمه", "تکثیر متن"],
        en: ["text repeater", "repeat text", "repeat word", "text multiplier"],
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
        fa: "تا ۱۰٬۰۰۰ بار و تا ۵ میلیون نویسه خروجی.",
        en: "Up to 10,000 copies and 5 million characters of output.",
    },
    guide: {
        steps: [
            { fa: "نوشته را بنویسید.", en: "Type the text." },
            {
                fa: "شمار تکرار و جداکننده را برگزینید.",
                en: "Choose the count and the separator.",
            },
            { fa: "خروجی را کپی کنید.", en: "Copy the output." },
        ],
        faq: [
            {
                question: {
                    fa: "می‌توانم کاما یا خط تیره میان تکرارها بگذارم؟",
                    en: "Can I put a comma or a dash between the copies?",
                },
                answer: {
                    fa: "بله. «دلخواه» را برگزینید و هر جداکننده‌ای را بنویسید.",
                    en: "Yes. Choose Custom and type any separator.",
                },
            },
        ],
    },
    example: "سلام",
};
