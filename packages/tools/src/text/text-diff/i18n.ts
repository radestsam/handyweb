import type { LocalizedText } from "@handyweb/core";

export const strings = {
    compareBy: { fa: "سنجش", en: "Compare by" },
    lines: { fa: "خط", en: "Lines" },
    words: { fa: "واژه", en: "Words" },
    chars: { fa: "نویسه", en: "Characters" },
    ignoreWhitespace: {
        fa: "نادیده گرفتن اسپیس آغاز و پایان خط",
        en: "Ignore spaces at the start and end of lines",
    },
    ignoreCase: { fa: "نادیده گرفتن بزرگی و کوچکی حروف لاتین", en: "Ignore letter case" },
    original: { fa: "نوشته نخست", en: "Original text" },
    changed: { fa: "نوشته دگرگون‌شده", en: "Changed text" },
    result: { fa: "فرق‌ها", en: "Differences" },
    identical: { fa: "دو نوشته یکسان‌اند.", en: "The two texts are the same." },
    copyPatch: { fa: "کپی patch", en: "Copy patch" },
    tooLargeToShow: {
        fa: "فرق‌ها برای نشان دادن بزرگ‌اند. patch را کپی کنید.",
        en: "The differences are too large to show. Copy the patch instead.",
    },
    cut: {
        fa: "تنها ۲٬۰۰۰ خط نخست نشان داده می‌شود. همه فرق‌ها در patch هستند.",
        en: "Only the first 2,000 lines are shown. The patch has every change.",
    },
    added: { fa: "افزوده", en: "added" },
    removed: { fa: "برداشته", en: "removed" },
    tooLarge: {
        fa: "دو نوشته روی هم بیش از ۱۰ مگابایت‌اند.",
        en: "The two texts are larger than 10 MB together.",
    },
} as const satisfies Record<string, LocalizedText>;
