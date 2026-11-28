import type { ToolDefinition } from "@handyweb/core";

export const binaryCalculatorMeta: ToolDefinition = {
    id: "binary-calculator",
    slug: "binary-calculator",
    aliases: ["binary-arithmetic", "hex-calculator", "bitwise-calculator", "binary-addition"],
    category: "calculators",
    alsoIn: ["developer"],
    related: ["number-base", "binary"],
    tags: ["binary", "hex", "bitwise", "calculator"],
    title: { fa: "ماشین حساب باینری و هگز", en: "Binary and Hex Calculator" },
    seoTitle: {
        fa: "ماشین حساب باینری و هگز با AND، OR و XOR",
        en: "Binary and Hex Calculator with Bitwise Operators",
    },
    description: {
        fa: "دو عدد دودویی، هگز یا ده‌دهی را جمع، تفریق، ضرب و تقسیم کنید یا AND، OR، XOR و شیفت بیتی بگیرید، و پاسخ را در هر چهار مبنا ببینید.",
        en: "Add, subtract, multiply, and divide binary or hex numbers, or use AND, OR, XOR, and bit shifts, and see the answer in four bases.",
    },
    keywords: {
        fa: ["ماشین حساب باینری", "جمع باینری", "ماشین حساب هگز", "عملگر بیتی", "xor"],
        en: [
            "binary calculator",
            "hex calculator",
            "bitwise calculator",
            "binary addition",
            "xor calculator",
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
    limits: { maxInputBytes: 10_000 },
    limitations: {
        fa: "تنها عدد صحیح؛ ممیز شناور پشتیبانی نمی‌شود. تقسیم به سوی صفر گرد می‌شود. پهنای بیت (۸، ۱۶، ۳۲ بیت) محدود نیست.",
        en: "Whole numbers only; floating point is not supported. Division rounds toward zero. There is no fixed bit width (8, 16, 32 bits).",
    },
    guide: {
        steps: [
            { fa: "مبنای ورودی را برگزینید.", en: "Choose the input base." },
            { fa: "دو عدد و عمل را بنویسید.", en: "Enter the two numbers and the operation." },
            { fa: "پاسخ را در هر مبنا کپی کنید.", en: "Copy the answer in any base." },
        ],
        faq: [
            {
                question: { fa: "XOR چه می‌کند؟", en: "What does XOR do?" },
                answer: {
                    fa: "هر بیت پاسخ ۱ است اگر و تنها اگر دو بیت ورودی با هم فرق داشته باشند. ۱۱۰۰ XOR ۱۰۱۰ برابر ۰۱۱۰ است.",
                    en: "Each bit of the answer is 1 only when the two input bits differ. 1100 XOR 1010 is 0110.",
                },
            },
        ],
    },
    example: "1010",
};
