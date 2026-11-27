import type { LocalizedText } from "@handyweb/core";

export const strings = {
    count: { fa: "شمار رنگ‌ها", en: "Number of colors" },
    export: { fa: "خروجی", en: "Export" },
    css: { fa: "متغیرهای CSS", en: "CSS variables" },
    hex: { fa: "فهرست HEX", en: "HEX list" },
    json: { fa: "JSON", en: "JSON" },
    palette: { fa: "رنگ‌های اصلی", en: "Main colors" },
    another: { fa: "تصویر دیگر", en: "Another image" },
    note: {
        fa: "رنگ‌ها از نسخه کوچکی از عکس خوانده می‌شوند و بر پایه سهم هر رنگ در عکس مرتب شده‌اند.",
        en: "The colors are read from a small copy of the picture and sorted by how much of the picture each one covers.",
    },
} as const satisfies Record<string, LocalizedText>;
