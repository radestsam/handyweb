import type { Locale, LocalizedText } from "@handyweb/core";

/** The longest password that the tool checks. zxcvbn gets slow on long input. */
export const MAX_LENGTH = 256;

export type Score = 0 | 1 | 2 | 3 | 4;

/** What the worker sends back. It holds no copy of the password. */
export interface StrengthSummary {
    score: Score;
    guessesLog10: number;
    /** Seconds to guess the password in three attack cases. */
    seconds: { online: number; offlineSlow: number; offlineFast: number };
    /** zxcvbn feedback keys, such as "topTen" or "useWords". */
    warning: string | null;
    suggestions: string[];
}

/** The kinds of characters in a password. */
export function characterKinds(password: string): {
    length: number;
    lower: boolean;
    upper: boolean;
    digit: boolean;
    symbol: boolean;
    other: boolean;
} {
    const chars = [...password];
    return {
        length: chars.length,
        lower: /\p{Ll}/u.test(password),
        upper: /\p{Lu}/u.test(password),
        digit: /\p{Nd}/u.test(password),
        symbol: /[\p{P}\p{S}]/u.test(password),
        // Letters without case, such as Persian letters.
        other: /\p{Lo}/u.test(password),
    };
}

const UNITS: Array<[number, LocalizedText, LocalizedText]> = [
    [60, { fa: "ثانیه", en: "second" }, { fa: "ثانیه", en: "seconds" }],
    [60, { fa: "دقیقه", en: "minute" }, { fa: "دقیقه", en: "minutes" }],
    [24, { fa: "ساعت", en: "hour" }, { fa: "ساعت", en: "hours" }],
    [30.4375, { fa: "روز", en: "day" }, { fa: "روز", en: "days" }],
    [12, { fa: "ماه", en: "month" }, { fa: "ماه", en: "months" }],
    [100, { fa: "سال", en: "year" }, { fa: "سال", en: "years" }],
];

/** A short human time: "less than a second", "3 hours", "centuries". */
export function formatDuration(seconds: number, locale: Locale): string {
    if (!(seconds >= 1)) return locale === "fa" ? "کمتر از یک ثانیه" : "less than a second";
    let value = seconds;
    for (const [size, one, many] of UNITS) {
        if (value < size) {
            const count = Math.floor(value);
            const number = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en").format(count);
            return `${number} ${(count === 1 ? one : many)[locale]}`;
        }
        value /= size;
    }
    return locale === "fa" ? "چند سده" : "centuries";
}

export const SCORE_LABELS: Record<Score, LocalizedText> = {
    0: { fa: "بسیار ضعیف", en: "Very weak" },
    1: { fa: "ضعیف", en: "Weak" },
    2: { fa: "متوسط", en: "Fair" },
    3: { fa: "خوب", en: "Good" },
    4: { fa: "قوی", en: "Strong" },
};

/** Text for every zxcvbn warning key. */
export const WARNINGS: Record<string, LocalizedText> = {
    straightRow: {
        fa: "ردیف پشت‌سرهم کلیدهای صفحه‌کلید آسان حدس زده می‌شود.",
        en: "Straight rows of keys on the keyboard are easy to guess.",
    },
    keyPattern: {
        fa: "الگوهای کوتاه صفحه‌کلید آسان حدس زده می‌شوند.",
        en: "Short keyboard patterns are easy to guess.",
    },
    simpleRepeat: {
        fa: "نویسه‌های تکراری مانند «aaa» آسان حدس زده می‌شوند.",
        en: 'Repeated characters such as "aaa" are easy to guess.',
    },
    extendedRepeat: {
        fa: "الگوهای تکراری مانند «abcabcabc» آسان حدس زده می‌شوند.",
        en: 'Repeated patterns such as "abcabcabc" are easy to guess.',
    },
    sequences: {
        fa: "رشته‌های رایج مانند «abc» یا «123» آسان حدس زده می‌شوند.",
        en: 'Common sequences such as "abc" or "123" are easy to guess.',
    },
    recentYears: {
        fa: "سال‌های نزدیک آسان حدس زده می‌شوند.",
        en: "Recent years are easy to guess.",
    },
    dates: { fa: "تاریخ‌ها آسان حدس زده می‌شوند.", en: "Dates are easy to guess." },
    topTen: {
        fa: "این یکی از پرکاربردترین گذرواژه‌های جهان است.",
        en: "This is one of the most used passwords in the world.",
    },
    topHundred: {
        fa: "این گذرواژه بسیار پرکاربرد است.",
        en: "This is a very frequently used password.",
    },
    common: { fa: "این گذرواژه رایج است.", en: "This is a common password." },
    similarToCommon: {
        fa: "این گذرواژه به یک گذرواژه رایج بسیار نزدیک است.",
        en: "This is very close to a common password.",
    },
    wordByItself: {
        fa: "یک واژه تنها آسان حدس زده می‌شود.",
        en: "A single word is easy to guess.",
    },
    namesByThemselves: {
        fa: "یک نام یا نام خانوادگی تنها آسان حدس زده می‌شود.",
        en: "A single first name or last name is easy to guess.",
    },
    commonNames: {
        fa: "نام‌ها و نام‌های خانوادگی رایج آسان حدس زده می‌شوند.",
        en: "Common first names and last names are easy to guess.",
    },
    userInputs: {
        fa: "داده‌های شخصی در گذرواژه نگذارید.",
        en: "Do not put personal data in the password.",
    },
    pwned: {
        fa: "این گذرواژه در یک نشت داده دیده شده است.",
        en: "This password was seen in a data breach.",
    },
};

/** Text for every zxcvbn suggestion key. */
export const SUGGESTIONS: Record<string, LocalizedText> = {
    l33t: {
        fa: "از جایگزینی‌های قابل پیش‌بینی مانند «@» به جای «a» پرهیز کنید.",
        en: 'Avoid predictable swaps such as "@" for "a".',
    },
    reverseWords: {
        fa: "واژه‌های رایج را وارونه ننویسید.",
        en: "Do not spell common words backward.",
    },
    allUppercase: {
        fa: "برخی حروف را بزرگ بنویسید، نه همه را.",
        en: "Make some letters uppercase, not all of them.",
    },
    capitalization: {
        fa: "به جز نخستین حرف، حروف دیگری را هم بزرگ بنویسید.",
        en: "Make more than the first letter uppercase.",
    },
    dates: {
        fa: "از تاریخ‌ها و سال‌هایی که به شما مربوط‌اند پرهیز کنید.",
        en: "Avoid dates and years that are connected to you.",
    },
    recentYears: { fa: "از سال‌های نزدیک پرهیز کنید.", en: "Avoid recent years." },
    associatedYears: {
        fa: "از سال‌هایی که به شما مربوط‌اند پرهیز کنید.",
        en: "Avoid years that are connected to you.",
    },
    sequences: {
        fa: "از رشته‌های رایج نویسه پرهیز کنید.",
        en: "Avoid common character sequences.",
    },
    repeated: {
        fa: "از واژه‌ها و نویسه‌های تکراری پرهیز کنید.",
        en: "Avoid repeated words and characters.",
    },
    longerKeyboardPattern: {
        fa: "الگوی صفحه‌کلید را بلندتر کنید و چند بار جهت آن را عوض کنید.",
        en: "Use a longer keyboard pattern, and change direction several times.",
    },
    anotherWord: {
        fa: "یک یا چند واژه کم‌کاربرد دیگر بیفزایید.",
        en: "Add one or more less common words.",
    },
    useWords: {
        fa: "چند واژه را کنار هم بگذارید، ولی از عبارت‌های رایج پرهیز کنید.",
        en: "Use several words, but avoid common phrases.",
    },
    noNeed: {
        fa: "برای یک گذرواژه قوی به نماد، عدد یا حرف بزرگ نیازی نیست.",
        en: "A strong password does not need symbols, numbers, or uppercase letters.",
    },
    pwned: {
        fa: "اگر این گذرواژه را جای دیگری به کار می‌برید، آن را عوض کنید.",
        en: "If you use this password somewhere else, change it.",
    },
};
