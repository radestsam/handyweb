import type { LocalizedText } from "@handyweb/core";

export const strings = {
    direction: { fa: "کار", en: "Action" },
    split: { fa: "جدا کردن", en: "Split" },
    join: { fa: "به هم پیوستن", en: "Join" },
    delimiter: { fa: "جداکننده", en: "Delimiter" },
    delimiterHint: {
        fa: "برای خط تازه \\n و برای تب \\t بنویسید.",
        en: "Write \\n for a new line and \\t for a tab.",
    },
    wrap: { fa: "پیرامون هر مورد", en: "Around each item" },
    trim: { fa: "پاک کردن اسپیس آغاز و پایان هر مورد", en: "Trim spaces around each item" },
    skipEmpty: { fa: "کنار گذاشتن موردهای خالی", en: "Skip empty items" },
    splitInput: { fa: "نوشته", en: "Text" },
    joinInput: { fa: "هر مورد در یک خط", en: "One item per line" },
} as const satisfies Record<string, LocalizedText>;
