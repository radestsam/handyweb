import type { LocalizedText } from "@handyweb/core";

export const strings = {
    direction: { fa: "سو", en: "Direction" },
    jsonToCsv: { fa: "JSON به CSV", en: "JSON to CSV" },
    csvToJson: { fa: "CSV به JSON", en: "CSV to JSON" },
    delimiter: { fa: "جداکننده", en: "Delimiter" },
    auto: { fa: "خودکار", en: "Auto" },
    comma: { fa: "کاما", en: "Comma" },
    semicolon: { fa: "نقطه‌ویرگول", en: "Semicolon" },
    tab: { fa: "تب", en: "Tab" },
    flatten: { fa: "شیءهای تودرتو به ستون‌های a.b", en: "Nested objects as a.b columns" },
    header: { fa: "خط نخست نام ستون‌هاست", en: "First row is the header" },
    types: { fa: "شماره و true/false به نوع JSON", en: "Numbers and true/false as JSON types" },
    download: { fa: "دانلود فایل", en: "Download file" },
    bom: {
        fa: "برای Excel (با BOM، تا فارسی درست دیده شود)",
        en: "For Excel (with BOM, so Persian shows correctly)",
    },
} as const satisfies Record<string, LocalizedText>;
