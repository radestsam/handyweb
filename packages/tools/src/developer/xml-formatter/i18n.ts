import type { LocalizedText } from "@handyweb/core";

export const strings = {
    action: { fa: "کار", en: "Action" },
    format: { fa: "آراستن", en: "Format" },
    minify: { fa: "فشرده‌سازی", en: "Minify" },
    validate: { fa: "بررسی درستی", en: "Validate" },
    indent: { fa: "تورفتگی", en: "Indent" },
    spaces2: { fa: "۲ اسپیس", en: "2 spaces" },
    spaces4: { fa: "۴ اسپیس", en: "4 spaces" },
    tab: { fa: "Tab", en: "Tab" },
    tooLarge: { fa: "ورودی بیش از ۵ مگابایت است.", en: "The input is larger than 5 MB." },
} as const satisfies Record<string, LocalizedText>;

export function wellFormed(root: string, elements: number, locale: "fa" | "en"): string {
    const count = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en").format(elements);
    return locale === "fa"
        ? `XML درست ساخته شده است. ریشه: ${root}، ${count} عنصر.`
        : `The XML is well-formed. Root: ${root}, ${count} ${elements === 1 ? "element" : "elements"}.`;
}
