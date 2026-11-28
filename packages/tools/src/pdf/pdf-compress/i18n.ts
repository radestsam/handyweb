import type { LocalizedText } from "@handyweb/core";

export const strings = {
    another: { fa: "PDF دیگر", en: "Another PDF" },
    level: { fa: "میزان فشرده‌سازی", en: "Compression level" },
    light: { fa: "کم (کیفیت بالا)", en: "Light (high quality)" },
    medium: { fa: "میانه", en: "Medium" },
    strong: { fa: "زیاد (فایل کوچک‌تر)", en: "Strong (smaller file)" },
    compress: { fa: "فشرده‌سازی PDF", en: "Compress PDF" },
    result: { fa: "PDF فشرده", en: "Compressed PDF" },
    smaller: { fa: "کوچک‌تر", en: "smaller" },
    images: {
        fa: "تصویر دوباره فشرده شد",
        en: "images compressed again",
    },
    of: { fa: "از", en: "of" },
    notSmaller: {
        fa: "فایل کوچک‌تر نشد. این PDF شاید از پیش فشرده است، یا بیشتر حجم آن متن، فونت یا تصویرهایی است که این ابزار تغییر نمی‌دهد. فایل اصلی را نگه دارید.",
        en: "The file did not get smaller. This PDF may be compressed already, or most of its size is text, fonts, or images that this tool does not change. Keep the original file.",
    },
    note: {
        fa: "فشرده‌سازی کیفیت تصویرها را کم می‌کند. متن و نمودارها تغییر نمی‌کنند. کوچک‌تر شدن فایل تضمین نمی‌شود.",
        en: "Compression lowers the quality of images. Text and drawings do not change. A smaller file is not guaranteed.",
    },
    tooLarge: {
        fa: "این فایل از اندازه مجاز (۲۰۰ مگابایت) بزرگ‌تر است.",
        en: "This file is larger than the limit (200 MB).",
    },
} as const satisfies Record<string, LocalizedText>;
