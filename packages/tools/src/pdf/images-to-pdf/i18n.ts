import type { LocalizedText } from "@handyweb/core";

export const strings = {
    images: { fa: "تصویرها به ترتیب برگه‌ها", en: "Images in page order" },
    image: { fa: "تصویر", en: "images" },
    moveUp: { fa: "بردن به بالا", en: "Move up" },
    moveDown: { fa: "بردن به پایین", en: "Move down" },
    remove: { fa: "برداشتن", en: "Remove" },
    addMore: { fa: "افزودن تصویر دیگر", en: "Add more images" },
    hint: {
        fa: "JPEG، PNG، WebP، GIF یا BMP",
        en: "JPEG, PNG, WebP, GIF, or BMP",
    },
    pageSize: { fa: "اندازه برگه", en: "Page size" },
    fit: { fa: "هم‌اندازه تصویر", en: "Same as image" },
    margin: { fa: "حاشیه", en: "Margin" },
    none: { fa: "بی‌حاشیه", en: "None" },
    small: { fa: "کم", en: "Small" },
    large: { fa: "زیاد", en: "Large" },
    make: { fa: "ساخت PDF", en: "Make PDF" },
    clear: { fa: "پاک کردن فهرست", en: "Clear the list" },
    result: { fa: "PDF ساخته‌شده", en: "Created PDF" },
    pages: { fa: "برگه", en: "pages" },
    skipped: { fa: "این فایل‌ها افزوده نشدند:", en: "These files were not added:" },
    tooMany: { fa: "فهرست پر است.", en: "The list is full." },
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
