import type { LocalizedText } from "@handyweb/core";

export const strings = {
    pages: { fa: "برگه", en: "pages" },
    another: { fa: "PDF دیگر", en: "Another PDF" },
    format: { fa: "قالب تصویر", en: "Image format" },
    resolution: { fa: "وضوح", en: "Resolution" },
    pageList: { fa: "برگه‌ها", en: "Pages" },
    pageListHint: {
        fa: "خالی برای همه برگه‌ها، یا برای نمونه:",
        en: "Empty for all pages, or for example:",
    },
    convert: { fa: "تبدیل به تصویر", en: "Convert to images" },
    cancel: { fa: "ایست", en: "Stop" },
    tooMany: {
        fa: "در هر بار تا ۱۰۰ برگه را می‌توان تبدیل کرد. برگه‌های کمتری برگزینید.",
        en: "You can convert up to 100 pages at a time. Choose fewer pages.",
    },
    results: { fa: "تصویرهای برگه‌ها", en: "Page images" },
    page: { fa: "برگه", en: "Page" },
    downloadAll: { fa: "دانلود همه (ZIP)", en: "Download all (ZIP)" },
    tooLarge: {
        fa: "این فایل از اندازه مجاز (۱۰۰ مگابایت) بزرگ‌تر است.",
        en: "This file is larger than the limit (100 MB).",
    },
    reading: { fa: "در حال خواندن…", en: "Reading…" },
    scaled: {
        fa: "برخی برگه‌ها برای این وضوح بیش از اندازه بزرگ بودند و کوچک‌تر ساخته شدند.",
        en: "Some pages were too large for this resolution, so they were made smaller.",
    },
} as const satisfies Record<string, LocalizedText>;
