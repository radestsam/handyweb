/**
 * Normalizes text for search only. Never use it to change user text: the
 * Persian tools show every change and let the user choose (plan section 5.4).
 *
 * The same function runs on the index and on the query, so a query typed with
 * an Arabic keyboard layout, with Persian digits, or without ZWNJ still finds
 * the Persian title.
 */
const CHARACTER_MAP: Readonly<Record<string, string>> = {
    ي: "ی", // ARABIC LETTER YEH -> FARSI YEH
    ى: "ی", // ARABIC LETTER ALEF MAKSURA -> FARSI YEH
    ك: "ک", // ARABIC LETTER KAF -> KEHEH
    ة: "ه", // TEH MARBUTA -> HEH
    ۀ: "ه", // HEH WITH YEH ABOVE -> HEH
    أ: "ا", // ALEF WITH HAMZA ABOVE -> ALEF
    إ: "ا", // ALEF WITH HAMZA BELOW -> ALEF
    آ: "ا", // ALEF WITH MADDA ABOVE -> ALEF
    ٱ: "ا", // ALEF WASLA -> ALEF
    ؤ: "و", // WAW WITH HAMZA ABOVE -> WAW
};

// U+064B..U+065F and U+0670: Arabic diacritics (harakat, tanwin, superscript alef).
const DIACRITICS = /[ً-ٰٟ]/g;
// ZWNJ, ZWJ, LRM, RLM, ALM, the bidi embeddings and isolates, and tatweel.
const INVISIBLE = /[‌‍‎‏؜‪-‮⁦-⁩ـ]/g;
// Persian (U+06F0..U+06F9) and Arabic-Indic (U+0660..U+0669) digits.
const DIGITS = /[۰-۹٠-٩]/g;

export function normalizeForSearch(text: string): string {
    return text
        .normalize("NFKC")
        .replace(INVISIBLE, "")
        .replace(DIACRITICS, "")
        .replace(/[يىكةۀأإآٱؤ]/g, (c) => CHARACTER_MAP[c] ?? c)
        .replace(DIGITS, (d) => String((d.codePointAt(0) as number) & 0xf))
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}
