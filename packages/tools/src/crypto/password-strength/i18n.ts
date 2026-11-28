import type { LocalizedText } from "@handyweb/core";

export const strings = {
    password: { fa: "گذرواژه", en: "Password" },
    placeholder: { fa: "گذرواژه را بنویسید", en: "Type a password" },
    show: { fa: "نمایش", en: "Show" },
    hide: { fa: "پنهان", en: "Hide" },
    loading: {
        fa: "در حال بار کردن واژه‌نامه‌ها (نزدیک ۹۰۰ کیلوبایت، یک بار)…",
        en: "Loading the dictionaries (about 900 KB, once)…",
    },
    strength: { fa: "قدرت", en: "Strength" },
    times: { fa: "زمان حدس زدن", en: "Time to guess" },
    online: {
        fa: "حمله آنلاین (۱۰ حدس در ثانیه)",
        en: "Online attack (10 guesses per second)",
    },
    offlineSlow: {
        fa: "هش کند، مانند bcrypt (۱۰ هزار حدس در ثانیه)",
        en: "Slow hash such as bcrypt (10 thousand guesses per second)",
    },
    offlineFast: {
        fa: "هش تند، مانند MD5 (۱۰ میلیارد حدس در ثانیه)",
        en: "Fast hash such as MD5 (10 billion guesses per second)",
    },
    tips: { fa: "پیشنهادها", en: "Suggestions" },
    length: { fa: "طول", en: "Length" },
    characters: { fa: "نویسه", en: "characters" },
    kinds: { fa: "گونه‌های نویسه", en: "Character kinds" },
    lower: { fa: "حروف کوچک", en: "lowercase" },
    upper: { fa: "حروف بزرگ", en: "uppercase" },
    digit: { fa: "عدد", en: "digits" },
    symbol: { fa: "نماد", en: "symbols" },
    other: { fa: "حروف فارسی و دیگر", en: "Persian and other letters" },
    tooLong: {
        fa: "تنها ۲۵۶ نویسه نخست سنجیده می‌شود.",
        en: "Only the first 256 characters are checked.",
    },
    privacy: {
        fa: "گذرواژه واقعی و در حال استفاده خود را در هیچ وب‌سایتی ننویسید.",
        en: "Do not type a real password that you use now into any website.",
    },
} as const satisfies Record<string, LocalizedText>;
