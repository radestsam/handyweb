import type { LocalizedText } from "@handyweb/core";

export const strings = {
    find: { fa: "جستجو برای", en: "Find" },
    replace: { fa: "جایگزین با", en: "Replace with" },
    mode: { fa: "گونه جستجو", en: "Search type" },
    text: { fa: "نوشته ساده", en: "Plain text" },
    regex: { fa: "Regex", en: "Regex" },
    ignoreCase: { fa: "نادیده گرفتن بزرگی و کوچکی حروف", en: "Ignore case" },
    wholeWord: { fa: "تنها واژه کامل", en: "Whole words only" },
    all: { fa: "جایگزینی همه", en: "Replace all" },
    regexHint: {
        fa: "در جایگزین، $1، $<name> و $& را به کار ببرید. پرچم u همیشه روشن است.",
        en: "In the replacement, use $1, $<name>, and $&. The u flag is always on.",
    },
    count: { fa: "جایگزینی", en: "replacements" },
    timeout: {
        fa: "جستجو بیش از ۲ ثانیه کار کرد و ایستانده شد. الگو را ساده‌تر کنید.",
        en: "The search ran for more than 2 seconds and was stopped. Use a simpler pattern.",
    },
} as const satisfies Record<string, LocalizedText>;
