import { LOCALES, type Locale } from "@handyweb/core";

/** getStaticPaths for a page that exists once per locale. */
export function localeStaticPaths(): Array<{ params: { locale: Locale } }> {
    return LOCALES.map((locale) => ({ params: { locale } }));
}
