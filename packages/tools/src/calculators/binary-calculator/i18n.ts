import type { LocalizedText } from "@handyweb/core";

export const strings = {
    base: { fa: "مبنای ورودی", en: "Input base" },
    binary: { fa: "دودویی", en: "Binary" },
    hex: { fa: "شانزده‌شانزدهی", en: "Hex" },
    decimal: { fa: "ده‌دهی", en: "Decimal" },
    auto: { fa: "خودکار (0x، 0b)", en: "Auto (0x, 0b)" },
    first: { fa: "عدد اول", en: "First number" },
    second: { fa: "عدد دوم", en: "Second number" },
    operation: { fa: "عمل", en: "Operation" },
    octal: { fa: "هشت‌هشتی", en: "Octal" },
    note: {
        fa: "عددها صحیح‌اند و هر اندازه‌ای می‌توانند داشته باشند. تقسیم به سوی صفر گرد می‌شود. عملگرهای بیتی برای عدد منفی مکمل دو را به کار می‌برند.",
        en: "Numbers are whole and can be any size. Division rounds toward zero. Bit operations use two's complement for negative numbers.",
    },
} as const satisfies Record<string, LocalizedText>;
