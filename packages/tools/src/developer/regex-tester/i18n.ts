import type { LocalizedText } from "@handyweb/core";
import type { Flag } from "./logic";

export const strings = {
    pattern: { fa: "الگو (regex)", en: "Pattern (regex)" },
    flags: { fa: "پرچم‌ها", en: "Flags" },
    text: { fa: "نوشته آزمایشی", en: "Test text" },
    matches: { fa: "یافته‌ها", en: "Matches" },
    noMatch: { fa: "چیزی یافت نشد.", en: "No match." },
    highlighted: { fa: "یافته‌ها در نوشته", en: "Matches in the text" },
    index: { fa: "جایگاه", en: "Position" },
    match: { fa: "یافته", en: "Match" },
    groups: { fa: "گروه‌ها", en: "Groups" },
    truncated: {
        fa: "تنها ۱٬۰۰۰ یافته نخست نشان داده می‌شوند.",
        en: "Only the first 1,000 matches are shown.",
    },
    risk: {
        fa: "این الگو یک کمیت‌نما درون گروهی با کمیت‌نما دارد، مانند (a+)+. چنین الگویی روی برخی نوشته‌ها بسیار کند می‌شود (catastrophic backtracking).",
        en: "This pattern has a quantifier inside a quantified group, such as (a+)+. Such a pattern can be very slow on some text (catastrophic backtracking).",
    },
    timeout: {
        fa: "الگو بیش از ۲ ثانیه کار کرد و ایستانده شد. شاید backtracking بی‌پایان دارد.",
        en: "The pattern ran for more than 2 seconds and was stopped. It may have catastrophic backtracking.",
    },
    working: { fa: "در حال جستجو…", en: "Searching…" },
    tooLarge: { fa: "نوشته بیش از ۱ مگابایت است.", en: "The text is larger than 1 MB." },
    highlightTooLarge: {
        fa: "نوشته برای رنگ‌آمیزی یافته‌ها بزرگ است. فهرست یافته‌ها در پایین است.",
        en: "The text is too large to highlight. The list of matches is below.",
    },
} as const satisfies Record<string, LocalizedText>;

export const flagLabels: Record<Flag, LocalizedText> = {
    g: { fa: "g: همه یافته‌ها", en: "g: all matches" },
    i: { fa: "i: بی‌توجه به بزرگی حروف", en: "i: ignore case" },
    m: { fa: "m: ^ و $ برای هر خط", en: "m: ^ and $ per line" },
    s: { fa: "s: نقطه خط تازه را هم می‌گیرد", en: "s: dot matches line breaks" },
    u: { fa: "u: یونیکد (\\p{…})", en: "u: Unicode (\\p{…})" },
};
