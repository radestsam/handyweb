import type { LocalizedText } from "@handyweb/core";

export const strings = {
    action: { fa: "کار", en: "Action" },
    format: { fa: "آراستن", en: "Format" },
    validate: { fa: "بررسی درستی", en: "Validate" },
    indent: { fa: "تورفتگی", en: "Indent" },
    spaces2: { fa: "۲ اسپیس", en: "2 spaces" },
    spaces4: { fa: "۴ اسپیس", en: "4 spaces" },
    tooLarge: { fa: "ورودی بیش از ۵ مگابایت است.", en: "The input is larger than 5 MB." },
} as const satisfies Record<string, LocalizedText>;

export function valid(documents: number, locale: "fa" | "en"): string {
    const count = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en").format(documents);
    return locale === "fa"
        ? `YAML درست است (${count} سند).`
        : `The YAML is valid (${count} ${documents === 1 ? "document" : "documents"}).`;
}
