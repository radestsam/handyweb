import { LOCALES, type Locale } from "./locales";

/**
 * Builds the URL of a page in one locale. `path` is the locale-neutral path,
 * for example "/" or "/tools/base64/". Every page URL ends with a slash, the
 * same as the folders that the static build writes.
 */
export function localePath(locale: Locale, path: string): string {
    const clean = `/${path.replace(/^\/+|\/+$/g, "")}`;
    const withSlash = clean === "/" ? "/" : `${clean}/`;
    return `/${locale}${withSlash}`;
}

/** Splits "/fa/tools/base64/" into the locale and the locale-neutral path. */
export function splitLocalePath(pathname: string): { locale: Locale | null; path: string } {
    const match = /^\/([a-z]{2})(\/.*)?$/.exec(pathname);
    const head = match?.[1];
    if (head && (LOCALES as readonly string[]).includes(head)) {
        return { locale: head as Locale, path: match?.[2] ?? "/" };
    }
    return { locale: null, path: pathname };
}
