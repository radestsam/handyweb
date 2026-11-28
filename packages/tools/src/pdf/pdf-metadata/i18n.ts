import type { LocalizedText } from "@handyweb/core";
import type { TextField } from "./logic";

export const fieldLabels: Record<TextField, LocalizedText> = {
    Title: { fa: "عنوان", en: "Title" },
    Author: { fa: "نویسنده", en: "Author" },
    Subject: { fa: "موضوع", en: "Subject" },
    Keywords: { fa: "کلیدواژه‌ها", en: "Keywords" },
    Creator: { fa: "برنامه سازنده", en: "Creator (app)" },
    Producer: { fa: "تولیدکننده PDF", en: "Producer" },
};

export const strings = {
    pages: { fa: "برگه", en: "pages" },
    another: { fa: "PDF دیگر", en: "Another PDF" },
    fields: { fa: "فراداده", en: "Metadata" },
    empty: { fa: "خالی", en: "empty" },
    emptyNote: {
        fa: "فیلد خالی از فایل برداشته می‌شود.",
        en: "An empty field is removed from the file.",
    },
    created: { fa: "تاریخ ساخت", en: "Creation date" },
    modified: { fa: "تاریخ ویرایش", en: "Modification date" },
    keep: { fa: "نگه داشتن", en: "Keep" },
    none: { fa: "ندارد", en: "None" },
    otherKeys: {
        fa: "این فیلدهای دیگر هم در فایل هستند و برداشته می‌شوند:",
        en: "The file also has these other fields. They will be removed:",
    },
    xmp: {
        fa: "این فایل فراداده XMP هم دارد. XMP برداشته می‌شود، چون برخی برنامه‌ها مقدارهای کهنه را از آن می‌خوانند.",
        en: "This file also has XMP metadata. The XMP is removed, because some apps read old values from it.",
    },
    save: { fa: "ذخیره تغییرها", en: "Save changes" },
    removeAll: { fa: "پاک کردن همه فراداده", en: "Remove all metadata" },
    result: { fa: "PDF ویرایش‌شده", en: "Edited PDF" },
    tooLarge: {
        fa: "این فایل از اندازه مجاز (۱۰۰ مگابایت) بزرگ‌تر است.",
        en: "This file is larger than the limit (100 MB).",
    },
    reading: { fa: "در حال خواندن…", en: "Reading…" },
    cleaned: {
        fa: "فایل خروجی هیچ فراداده‌ای ندارد.",
        en: "The output file has no metadata.",
    },
} as const satisfies Record<string, LocalizedText>;
