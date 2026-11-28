import type { LocalizedText } from "@handyweb/core";

export const strings = {
    pages: { fa: "برگه", en: "pages" },
    page: { fa: "برگه", en: "Page" },
    another: { fa: "PDF دیگر", en: "Another PDF" },
    headers: {
        fa: "نشان دادن شماره برگه پیش از متن هر برگه",
        en: "Show the page number before the text of each page",
    },
    text: { fa: "متن PDF", en: "PDF text" },
    download: { fa: "دانلود TXT", en: "Download TXT" },
    noText: {
        fa: "این PDF متنی ندارد. شاید برگه‌هایش تصویر اسکن‌شده‌اند. این ابزار نوشته درون تصویر را نمی‌خواند (OCR ندارد).",
        en: "This PDF has no text. Its pages may be scanned images. This tool does not read text in images (no OCR).",
    },
    tooLarge: {
        fa: "این فایل از اندازه مجاز (۱۰۰ مگابایت) بزرگ‌تر است.",
        en: "This file is larger than the limit (100 MB).",
    },
    tooMany: {
        fa: "تنها ۱۰۰۰ برگه نخست خوانده شد.",
        en: "Only the first 1,000 pages were read.",
    },
    reading: { fa: "در حال خواندن…", en: "Reading…" },
} as const satisfies Record<string, LocalizedText>;
