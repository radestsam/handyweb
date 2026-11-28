import type { ToolDefinition } from "@handyweb/core";

export const colorConverterMeta: ToolDefinition = {
    id: "color-converter",
    slug: "color-converter",
    aliases: ["hex-to-rgb", "rgb-to-hex", "hex-to-hsl", "color-code-converter", "oklch-converter"],
    category: "developer",
    alsoIn: ["calculators", "image"],
    related: ["qr-generator", "number-base"],
    tags: ["color", "hex", "rgb", "hsl"],
    title: { fa: "تبدیل کد رنگ (HEX، RGB، HSL)", en: "Color Converter (HEX, RGB, HSL)" },
    seoTitle: {
        fa: "تبدیل کد رنگ (HEX، RGB، HSL) و CMYK",
        en: "Color Converter (HEX, RGB, HSL) and CMYK",
    },
    description: {
        fa: "یک کد رنگ را میان HEX، RGB، HSL، HWB، OKLCH و CMYK برگردانید و کنتراست آن را با سفید و سیاه برای خوانایی متن ببینید.",
        en: "Convert a color between HEX, RGB, HSL, HWB, OKLCH, and CMYK, and see its contrast with white and black for readable text.",
    },
    keywords: {
        fa: ["تبدیل رنگ", "کد رنگ", "hex به rgb", "rgb به hex", "رنگ css"],
        en: [
            "color converter",
            "hex to rgb",
            "rgb to hex",
            "hex to hsl",
            "oklch",
            "color contrast",
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
    limits: { maxInputBytes: 200 },
    limitations: {
        fa: "رنگ‌ها در فضای sRGB هستند. CMYK تقریبی است و برای چاپ، با نیم‌رخ رنگی چاپگر جور نمی‌شود. ورودی lab() و oklch() هنوز خوانده نمی‌شود.",
        en: "Colors are in the sRGB space. CMYK is an approximation that does not match a printer color profile. lab() and oklch() input is not read yet.",
    },
    guide: {
        steps: [
            {
                fa: "کد رنگ را بنویسید یا از انتخاب‌گر برگزینید.",
                en: "Type a color code or pick one.",
            },
            { fa: "هر شکل را کپی کنید.", en: "Copy any format." },
            {
                fa: "کنتراست را برای متن روی سفید یا سیاه بسنجید.",
                en: "Check the contrast for text on white or black.",
            },
        ],
        faq: [
            {
                question: { fa: "OKLCH چیست؟", en: "What is OKLCH?" },
                answer: {
                    fa: "فضای رنگی که با چشم هماهنگ است: دو رنگ با روشنایی برابر در OKLCH در چشم هم برابر روشن‌اند. مرورگرهای امروزی آن را در CSS می‌شناسند.",
                    en: "A color space that matches the eye: two colors with the same lightness in OKLCH look equally light. Modern browsers support it in CSS.",
                },
            },
            {
                question: {
                    fa: "عدد کنتراست چه می‌گوید؟",
                    en: "What does the contrast number mean?",
                },
                answer: {
                    fa: "نسبت کنتراست WCAG از ۱ تا ۲۱ است. متن معمولی دست‌کم ۴٫۵ و متن بزرگ دست‌کم ۳ نیاز دارد.",
                    en: "The WCAG contrast ratio goes from 1 to 21. Normal text needs at least 4.5, and large text at least 3.",
                },
            },
        ],
    },
    example: "#bc4a3c",
};
