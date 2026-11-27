import type { LocalizedText } from "@handyweb/core";

export const strings = {
    rules: { fa: "چه چیزهایی پاک شود", en: "Rules" },
    emptyLines: { fa: "خط‌های خالی", en: "Empty lines" },
    emptyKeep: { fa: "دست‌نخورده", en: "Keep" },
    emptyCollapse: { fa: "تنها یکی", en: "One at most" },
    emptyRemove: { fa: "همه پاک", en: "Remove all" },
    changes: { fa: "ویرایش‌ها", en: "Changes" },
    noChanges: { fa: "نیازی به پاک‌سازی نبود.", en: "Nothing to clean." },
} as const satisfies Record<string, LocalizedText>;

export const ruleLabels = {
    controlChars: { fa: "نویسه‌های کنترلی", en: "Control characters" },
    zeroWidth: {
        fa: "نویسه‌های بی‌پهنا (به جز نیم‌فاصله)",
        en: "Zero-width characters (not ZWNJ)",
    },
    bidiControls: { fa: "نشانه‌های جهت (RLM و LRM)", en: "Direction marks (RLM, LRM)" },
    unicodeSpaces: {
        fa: "اسپیس‌های ویژه به اسپیس ساده",
        en: "Special spaces to normal spaces",
    },
    trimLines: { fa: "اسپیس آغاز و پایان خط", en: "Spaces at the start and end of lines" },
    collapseSpaces: { fa: "اسپیس‌ها و تب‌های پشت سر هم", en: "Repeated spaces and tabs" },
    emptyLines: { fa: "خط‌های خالی", en: "Empty lines" },
} as const satisfies Record<string, LocalizedText>;
