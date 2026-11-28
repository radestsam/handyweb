import type { LocalizedText } from "@handyweb/core";

export const strings = {
    fromSize: { fa: "نسبت از اندازه", en: "Ratio from a size" },
    width: { fa: "پهنا", en: "Width" },
    height: { fa: "بلندا", en: "Height" },
    ratio: { fa: "نسبت", en: "Ratio" },
    decimal: { fa: "به عدد", en: "As a number" },
    near: { fa: "نزدیک به", en: "Close to" },
    sideTitle: { fa: "ضلع دیگر با یک نسبت", en: "The other side for a ratio" },
    ratioW: { fa: "نسبت پهنا", en: "Ratio width" },
    ratioH: { fa: "نسبت بلندا", en: "Ratio height" },
    known: { fa: "ضلعی که می‌دانید", en: "The side you know" },
    value: { fa: "اندازه", en: "Size" },
    answer: { fa: "ضلع دیگر", en: "Other side" },
    common: { fa: "نسبت‌های رایج", en: "Common ratios" },
} as const satisfies Record<string, LocalizedText>;
