import type { LocalizedText } from "@handyweb/core";

export const strings = {
    mode: { fa: "کار", en: "Operation" },
    encode: { fa: "رمزگذاری", en: "Encode" },
    decode: { fa: "رمزگشایی", en: "Decode" },
    nonAscii: {
        fa: "رمزگذاری نویسه‌های غیر ASCII (مانند حروف فارسی)",
        en: "Encode non-ASCII characters (such as Persian letters)",
    },
    format: { fa: "شکل شماره", en: "Number format" },
    decimal: { fa: "دهدهی", en: "Decimal" },
    hex: { fa: "هگز", en: "Hex" },
    text: { fa: "نوشته", en: "Text" },
    html: { fa: "HTML", en: "HTML" },
    swap: { fa: "جابه‌جایی ورودی و خروجی", en: "Swap input and output" },
    encodeHint: {
        fa: "& < > \" ' همیشه رمزگذاری می‌شوند. خروجی درون تگ و درون مقدار ویژگی (attribute) داخل گیومه ایمن است.",
        en: "& < > \" ' are always encoded. The output is safe inside an element and inside a quoted attribute value.",
    },
} as const satisfies Record<string, LocalizedText>;
