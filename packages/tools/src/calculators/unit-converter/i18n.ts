import type { LocalizedText } from "@handyweb/core";

export const strings = {
    kind: { fa: "نوع", en: "Kind" },
    value: { fa: "مقدار", en: "Value" },
    from: { fa: "از", en: "From" },
    results: { fa: "برابر با", en: "Equals" },
    note: {
        fa: "یکاهای ایرانی با مقدار رایج امروز حساب می‌شوند: مثقال ۴٫۶۰۸ گرم، سیر ۷۵ گرم، من تبریز ۳ کیلوگرم، ذرع ۱۰۴ سانتی‌متر، جریب ۱۰٬۰۰۰ متر مربع. مقدار آن‌ها در گذشته و در شهرها فرق داشته است.",
        en: "Iranian units use the values common today: mesghal 4.608 g, sir 75 g, man-e Tabriz 3 kg, zar 104 cm, jerib 10,000 m². Their values differed in the past and between cities.",
    },
} as const satisfies Record<string, LocalizedText>;
