import type { ToolDefinition } from "@handyweb/core";

export const cssUnitsMeta: ToolDefinition = {
    id: "css-units",
    slug: "css-units",
    aliases: ["px-to-rem", "rem-to-px", "css-unit-converter", "px-to-em"],
    category: "calculators",
    alsoIn: ["developer"],
    related: ["unit-converter", "color-converter"],
    tags: ["css", "px", "rem", "em"],
    title: { fa: "تبدیل یکاهای CSS (px به rem)", en: "CSS Unit Converter (px to rem)" },
    description: {
        fa: "px، rem، em، ٪، vw، vh، pt، cm و دیگر یکاهای CSS را به هم تبدیل کنید، با اندازه فونت ریشه و اندازه نمایشگر دلخواه.",
        en: "Convert px, rem, em, %, vw, vh, pt, cm, and other CSS units, with your own root font size and viewport size.",
    },
    keywords: {
        fa: ["تبدیل px به rem", "تبدیل پیکسل به rem", "یکاهای css", "تبدیل rem به px"],
        en: ["px to rem", "rem to px", "css unit converter", "px to em", "px to vw"],
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
        fa: "یکاهای نسبی (em، ٪، vw، vh) به زمینه‌ای بستگی دارند که خودتان می‌نویسید. ch، ex و یکاهای container پشتیبانی نمی‌شوند.",
        en: "Relative units (em, %, vw, vh) depend on the context you enter. ch, ex, and container units are not supported.",
    },
    guide: {
        steps: [
            { fa: "مقدار و یکای آن را بنویسید.", en: "Enter the value and its unit." },
            {
                fa: "در صورت نیاز، زمینه (اندازه فونت و نمایشگر) را تغییر دهید.",
                en: "If needed, change the context (font and viewport sizes).",
            },
            { fa: "مقدار CSS دلخواه را کپی کنید.", en: "Copy the CSS value you need." },
        ],
        faq: [
            {
                question: { fa: "۱rem چند پیکسل است؟", en: "How many pixels is 1rem?" },
                answer: {
                    fa: "به اندازه فونت ریشه (html) بستگی دارد. در مرورگرها به‌طور پیش‌فرض ۱۶px است، پس ۲۴px برابر ۱٫۵rem است.",
                    en: "It depends on the root (html) font size. Browsers use 16px by default, so 24px is 1.5rem.",
                },
            },
        ],
    },
    example: "24",
};
