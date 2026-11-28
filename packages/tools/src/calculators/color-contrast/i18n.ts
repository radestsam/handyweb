import type { LocalizedText } from "@handyweb/core";

export const strings = {
    foreground: { fa: "رنگ متن", en: "Text color" },
    background: { fa: "رنگ پس‌زمینه", en: "Background color" },
    swap: { fa: "جابه‌جا کردن", en: "Swap" },
    ratio: { fa: "نسبت کنتراست", en: "Contrast ratio" },
    normal: { fa: "متن معمولی", en: "Normal text" },
    large: { fa: "متن درشت (۲۴px یا ۱۸٫۶۶px پررنگ)", en: "Large text (24px, or 18.66px bold)" },
    ui: { fa: "اجزای رابط (آیکون، لبه فیلد)", en: "Interface parts (icons, field borders)" },
    pass: { fa: "قبول", en: "Pass" },
    fail: { fa: "رد", en: "Fail" },
    sample: {
        fa: "نمونه متن: سلام، این یک نمونه است. Hello, this is a sample.",
        en: "Sample text: Hello, this is a sample. سلام، این یک نمونه است.",
    },
    suggestion: { fa: "نزدیک‌ترین رنگ متن با AA:", en: "Closest text color that passes AA:" },
    use: { fa: "به کار بردن", en: "Use it" },
} as const satisfies Record<string, LocalizedText>;
