import type { LocalizedText } from "@handyweb/core";

export const strings = {
    files: { fa: "فایل‌ها به ترتیب یکی شدن", en: "Files in merge order" },
    pages: { fa: "برگه", en: "pages" },
    moveUp: { fa: "بردن به بالا", en: "Move up" },
    moveDown: { fa: "بردن به پایین", en: "Move down" },
    remove: { fa: "برداشتن", en: "Remove" },
    addMore: { fa: "افزودن PDF دیگر", en: "Add more PDFs" },
    merge: { fa: "یکی کردن PDFها", en: "Merge PDFs" },
    needTwo: {
        fa: "دست‌کم دو فایل PDF برگزینید.",
        en: "Choose at least two PDF files.",
    },
    clear: { fa: "پاک کردن فهرست", en: "Clear the list" },
    result: { fa: "PDF یکی‌شده", en: "Merged PDF" },
    skipped: { fa: "این فایل‌ها افزوده نشدند:", en: "These files were not added:" },
    tooMany: {
        fa: "فهرست پر است.",
        en: "The list is full.",
    },
    tooLarge: {
        fa: "این فایل از اندازه مجاز بزرگ‌تر است.",
        en: "This file is larger than the limit.",
    },
    totalTooLarge: {
        fa: "اندازه همه فایل‌ها با هم از اندازه مجاز بیشتر می‌شود.",
        en: "All files together would be larger than the limit.",
    },
    reading: { fa: "در حال خواندن…", en: "Reading…" },
} as const satisfies Record<string, LocalizedText>;
