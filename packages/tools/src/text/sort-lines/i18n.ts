import type { LocalizedText } from "@handyweb/core";

export const strings = {
    order: { fa: "ترتیب", en: "Order" },
    ascending: { fa: "الف تا ی", en: "A to Z" },
    descending: { fa: "ی تا الف", en: "Z to A" },
    reverse: { fa: "وارونه", en: "Reverse" },
    options: { fa: "گزینه‌ها", en: "Options" },
    natural: { fa: "ترتیب طبیعی شماره‌ها (۲ پیش از ۱۰)", en: "Natural number order (2 before 10)" },
    ignoreCase: { fa: "نادیده گرفتن بزرگی و کوچکی حروف لاتین", en: "Ignore letter case" },
    removeEmpty: { fa: "پاک کردن خط‌های خالی", en: "Remove empty lines" },
} as const satisfies Record<string, LocalizedText>;
