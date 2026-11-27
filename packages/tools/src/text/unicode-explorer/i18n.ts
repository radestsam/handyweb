import type { LocalizedText } from "@handyweb/core";
import type { CategoryGroup } from "./logic";

export const strings = {
    characters: { fa: "نویسه‌ها", en: "Characters" },
    codePoints: { fa: "کد پوینت", en: "Code points" },
    graphemes: { fa: "نویسه دیدنی", en: "Visible characters" },
    utf8Bytes: { fa: "بایت UTF-8", en: "UTF-8 bytes" },
    utf16Units: { fa: "واحد UTF-16", en: "UTF-16 units" },
    char: { fa: "نویسه", en: "Char" },
    codePoint: { fa: "کد", en: "Code point" },
    name: { fa: "نام", en: "Name" },
    category: { fa: "گونه", en: "Category" },
    script: { fa: "خط", en: "Script" },
    noName: { fa: "نام در این ابزار نیست", en: "Name not included" },
    truncated: {
        fa: "تنها ۱٬۰۰۰ نویسه نخست نشان داده می‌شوند. شمارش‌ها همه نوشته را در بر می‌گیرند.",
        en: "Only the first 1,000 characters are shown. The counts cover the whole text.",
    },
    copyTable: { fa: "کپی جدول", en: "Copy table" },
    invisibleNote: {
        fa: "ردیف‌های رنگی نویسه‌های نادیدنی‌اند، مانند نیم‌فاصله، اسپیس ویژه و نشانه جهت.",
        en: "Highlighted rows are invisible characters, such as ZWNJ, special spaces, and direction marks.",
    },
} as const satisfies Record<string, LocalizedText>;

export const groupLabels: Record<CategoryGroup, LocalizedText> = {
    letter: { fa: "حرف", en: "Letter" },
    mark: { fa: "نشانه ترکیبی", en: "Mark" },
    number: { fa: "شماره", en: "Number" },
    punctuation: { fa: "نشانه نگارشی", en: "Punctuation" },
    symbol: { fa: "نماد", en: "Symbol" },
    separator: { fa: "جداکننده", en: "Separator" },
    control: { fa: "کنترلی", en: "Control" },
    format: { fa: "قالب‌بندی (نادیدنی)", en: "Format (invisible)" },
    surrogate: { fa: "surrogate تنها", en: "Lone surrogate" },
    private: { fa: "کاربرد خصوصی", en: "Private use" },
    unassigned: { fa: "بی‌نام", en: "Unassigned" },
};
