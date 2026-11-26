import type { LocalizedText } from "@handyweb/core";

export const strings = {
    rules: { fa: "چه چیزهایی درست شود", en: "Rules" },
    digits: { fa: "شماره‌ها", en: "Digits" },
    digitsKeep: { fa: "دست‌نخورده", en: "Keep" },
    digitsArabic: { fa: "عربی به فارسی", en: "Arabic to Persian" },
    digitsPersian: { fa: "همه به فارسی", en: "All to Persian" },
    digitsLatin: { fa: "همه به لاتین", en: "All to Latin" },
    changes: { fa: "ویرایش‌ها", en: "Changes" },
    noChanges: { fa: "نیازی به ویرایش نبود.", en: "No changes were needed." },
    diffTooLarge: {
        fa: "نوشته برای نشان دادن تک‌تک ویرایش‌ها بزرگ است. شمار ویرایش‌ها در بالا آمده است.",
        en: "The text is too large to show each change. The counts are above.",
    },
    removed: { fa: "برداشته", en: "removed" },
    added: { fa: "افزوده", en: "added" },
} as const satisfies Record<string, LocalizedText>;

export const ruleLabels = {
    arabicLetters: { fa: "ی و ک عربی به فارسی", en: "Arabic yeh and kaf to Persian" },
    presentationForms: {
        fa: "شکل‌های نمایشی عربی به نویسه‌های ساده",
        en: "Arabic presentation forms to normal letters",
    },
    tatweel: { fa: "پاک کردن کشیده (ـ)", en: "Remove tatweel (ـ)" },
    zwnj: { fa: "پاک کردن نیم‌فاصله‌های زیادی", en: "Remove extra ZWNJ" },
    diacritics: { fa: "پاک کردن نشانه‌های زیر و زبر", en: "Remove diacritics" },
    tehMarbuta: { fa: "ة به ه", en: "ة to ه" },
    punctuationSpacing: {
        fa: "درست کردن اسپیس پیرامون نشانه‌های نگارشی",
        en: "Fix spacing around punctuation",
    },
    digits: { fa: "برگرداندن شماره‌ها", en: "Digit conversion" },
} as const satisfies Record<string, LocalizedText>;
