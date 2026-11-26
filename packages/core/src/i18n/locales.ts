/** The site languages. Persian is the default (D3). */
export const LOCALES = ["fa", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fa";

/** Text direction of each locale. */
export const DIRECTION: Readonly<Record<Locale, "rtl" | "ltr">> = {
    fa: "rtl",
    en: "ltr",
};

/** BCP 47 tag for `Intl` APIs and the `hreflang` attribute. */
export const LANGUAGE_TAG: Readonly<Record<Locale, string>> = {
    fa: "fa-IR",
    en: "en",
};

export function isLocale(value: unknown): value is Locale {
    return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** The other locale, for the language switcher. */
export function otherLocale(locale: Locale): Locale {
    return locale === "fa" ? "en" : "fa";
}

/** Text with one value per locale. Every user-visible string uses this shape. */
export interface LocalizedText {
    fa: string;
    en: string;
}
