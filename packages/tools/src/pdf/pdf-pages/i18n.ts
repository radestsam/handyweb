import type { LocalizedText } from "@handyweb/core";

export const strings = {
    pages: { fa: "برگه", en: "pages" },
    page: { fa: "برگه", en: "Page" },
    another: { fa: "PDF دیگر", en: "Another PDF" },
    grid: { fa: "برگه‌ها", en: "Pages" },
    select: { fa: "گزینش", en: "Select" },
    selectAll: { fa: "گزینش همه", en: "Select all" },
    selectNone: { fa: "برداشتن گزینش", en: "Select none" },
    rotateLeft: { fa: "چرخش به چپ", en: "Turn left" },
    rotateRight: { fa: "چرخش به راست", en: "Turn right" },
    moveEarlier: { fa: "بردن به پیش", en: "Move earlier" },
    moveLater: { fa: "بردن به پس", en: "Move later" },
    remove: { fa: "برداشتن برگه", en: "Remove page" },
    removeSelected: { fa: "برداشتن گزیده‌ها", en: "Remove selected" },
    manyNote: {
        fa: "چرخش‌ها روی برگه‌های گزیده انجام می‌شود، یا روی همه برگه‌ها اگر چیزی گزیده نشده است.",
        en: "The turn buttons above work on the selected pages, or on all pages when none is selected.",
    },
    undo: { fa: "بازگرداندن همه تغییرها", en: "Undo all changes" },
    save: { fa: "ذخیره PDF", en: "Save PDF" },
    extract: { fa: "جدا کردن گزیده‌ها در یک PDF", en: "Extract selected to a PDF" },
    split: { fa: "جدا کردن هر برگه (ZIP)", en: "Split into single pages (ZIP)" },
    result: { fa: "فایل ساخته‌شده", en: "Created file" },
    selected: { fa: "گزیده", en: "selected" },
    removed: { fa: "برداشته", en: "removed" },
    tooLarge: {
        fa: "این فایل از اندازه مجاز (۱۰۰ مگابایت) بزرگ‌تر است.",
        en: "This file is larger than the limit (100 MB).",
    },
    tooMany: {
        fa: "این ابزار PDF تا ۳۰۰ برگه را می‌پذیرد.",
        en: "This tool accepts PDFs with up to 300 pages.",
    },
    reading: { fa: "در حال خواندن…", en: "Reading…" },
} as const satisfies Record<string, LocalizedText>;
