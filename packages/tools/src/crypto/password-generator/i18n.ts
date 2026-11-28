import type { LocalizedText } from "@handyweb/core";
import type { SetName, Strength } from "./logic";

export const strings = {
    kind: { fa: "گونه", en: "Type" },
    password: { fa: "گذرواژه", en: "Password" },
    passphrase: { fa: "عبارت عبور", en: "Passphrase" },
    length: { fa: "درازا", en: "Length" },
    words: { fa: "شمار واژه‌ها", en: "Words" },
    sets: { fa: "نویسه‌ها", en: "Characters" },
    excludeSimilar: {
        fa: "بدون نویسه‌های همانند (l، 1، I، O، 0)",
        en: "No look-alike characters (l, 1, I, O, 0)",
    },
    separator: { fa: "جداکننده", en: "Separator" },
    space: { fa: "اسپیس", en: "Space" },
    capitalize: { fa: "حرف نخست بزرگ", en: "Capitalize words" },
    addDigit: { fa: "افزودن یک رقم", en: "Add a digit" },
    regenerate: { fa: "ساخت دوباره", en: "Generate again" },
    result: { fa: "پاسخ", en: "Result" },
    bits: { fa: "بیت", en: "bits" },
    strength: { fa: "توان", en: "Strength" },
    passphraseNote: {
        fa: "واژه‌ها از فهرست ۷٬۷۷۶ واژه‌ای انگلیسی EFF برگزیده می‌شوند. هر واژه حدود ۱۲٫۹ بیت توان می‌افزاید.",
        en: "Words come from the EFF list of 7,776 English words. Each word adds about 12.9 bits.",
    },
    randomNote: {
        fa: "همه نویسه‌ها با crypto.getRandomValues مرورگر برگزیده می‌شوند.",
        en: "Every character comes from crypto.getRandomValues of your browser.",
    },
} as const satisfies Record<string, LocalizedText>;

export const setLabels: Record<SetName, LocalizedText> = {
    lower: { fa: "حروف کوچک (a-z)", en: "Lowercase (a-z)" },
    upper: { fa: "حروف بزرگ (A-Z)", en: "Uppercase (A-Z)" },
    digits: { fa: "رقم (0-9)", en: "Digits (0-9)" },
    symbols: { fa: "نشانه (!#$…)", en: "Symbols (!#$…)" },
};

export const strengthLabels: Record<Strength, LocalizedText> = {
    weak: { fa: "سست", en: "Weak" },
    fair: { fa: "میانه", en: "Fair" },
    strong: { fa: "نیرومند", en: "Strong" },
    "very-strong": { fa: "بسیار نیرومند", en: "Very strong" },
};
