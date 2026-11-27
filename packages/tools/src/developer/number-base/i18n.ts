import type { LocalizedText } from "@handyweb/core";

export const strings = {
    input: { fa: "عدد", en: "Number" },
    from: { fa: "پایه ورودی", en: "Input base" },
    auto: { fa: "خودکار", en: "Auto" },
    other: { fa: "دیگر", en: "Other" },
    otherBase: { fa: "پایه دیگر (۲ تا ۳۶)", en: "Other base (2 to 36)" },
    autoHint: {
        fa: "خودکار: پیشوند 0x هگز، 0o هشت‌هشتی و 0b دودویی است و بی‌پیشوند دهدهی.",
        en: "Auto: a 0x prefix is hex, 0o is octal, 0b is binary, and no prefix is decimal.",
    },
    uppercase: { fa: "حروف بزرگ (A-F)", en: "Uppercase (A-F)" },
    group: { fa: "گروه‌بندی رقم‌ها", en: "Group digits" },
    binary: { fa: "دودویی (۲)", en: "Binary (2)" },
    octal: { fa: "هشت‌هشتی (۸)", en: "Octal (8)" },
    decimal: { fa: "دهدهی (۱۰)", en: "Decimal (10)" },
    hex: { fa: "هگز (۱۶)", en: "Hex (16)" },
    target: { fa: "پایه دلخواه", en: "Any base" },
    bits: { fa: "بیت", en: "bits" },
    readAs: { fa: "خوانده شد در پایه", en: "Read in base" },
    tooLarge: {
        fa: "عدد بیش از ۱۰٬۰۰۰ رقم دارد.",
        en: "The number has more than 10,000 digits.",
    },
} as const satisfies Record<string, LocalizedText>;
