import type { Locale } from "@handyweb/core";

/*
 * The strings of the site chrome. Each tool keeps its own strings in its
 * i18n.ts. The English dictionary has the type of the Persian one, so a key
 * that is missing in one language fails the type check.
 */
const fa = {
    "site.name": "HandyWeb",
    "site.tagline": "ابزارهای کاربردی وب، روی دستگاه خود شما",
    "site.description":
        "ابزارهای آنلاین رایگان و متن‌باز که در مرورگر خودتان کار می‌کنند: تبدیل تاریخ شمسی، Base64، هش فایل و یکسان‌سازی متن فارسی. چیزی به سرور فرستاده نمی‌شود.",
    "nav.home": "خانه",
    "nav.tools": "همه ابزارها",
    "nav.categories": "دسته‌ها",
    "nav.about": "درباره",
    "nav.privacy": "حریم خصوصی",
    "nav.opensource": "متن‌باز",
    "nav.contribute": "همکاری",
    "nav.skip": "رفتن به بخش اصلی",
    "nav.breadcrumbs": "جایگاه این برگه",
    "lang.switch": "English",
    "lang.switchLabel": "زبان دیگر",
    "theme.label": "پوسته",
    "theme.system": "همانند دستگاه",
    "theme.light": "روشن",
    "theme.dark": "تیره",
    "nav.main": "منوی اصلی",
    "nav.footer": "پیوندهای پایین برگه",
    "nav.source": "گیت‌هاب",
    "footer.local":
        "ابزارها روی دستگاه خودتان کار می‌کنند. چیزی که وارد می‌کنید جایی نگه داشته یا فرستاده نمی‌شود.",
    "theme.button": "گزینش پوسته",
    "footer.creditBefore": "طراحی، توسعه و نگهداری با ",
    "footer.creditName": "حسام راد",
    "nav.search": "جستجو",
    "nav.toolsShort": "ابزارها",
    "nav.tabs": "پیمایش اصلی",
    "about.title": "درباره HandyWeb",
    "about.body":
        "HandyWeb دسته‌ای از ابزارهای ساده و کاربردی است که همه در مرورگر خودتان کار می‌کنند.",
    "redirect.title": "HandyWeb",
    "redirect.body": "رفتن به برگه فارسی",
} as const;

type Messages = { readonly [K in keyof typeof fa]: string };

const en: Messages = {
    "site.name": "HandyWeb",
    "site.tagline": "Handy web tools that run on your own device",
    "site.description":
        "A free, open-source collection of online tools that run in your browser. Your input is never sent to a server.",
    "nav.home": "Home",
    "nav.tools": "All Tools",
    "nav.categories": "Categories",
    "nav.about": "About",
    "nav.privacy": "Privacy",
    "nav.opensource": "Open Source",
    "nav.contribute": "Contribute",
    "nav.skip": "Skip to main content",
    "nav.breadcrumbs": "Breadcrumbs",
    "lang.switch": "فارسی",
    "lang.switchLabel": "Change the language",
    "theme.label": "Theme",
    "theme.system": "System",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "nav.main": "Main menu",
    "nav.footer": "Footer links",
    "nav.source": "Source code on GitHub",
    "footer.local": "The tools run on your device. No input is stored or sent.",
    "theme.button": "Change the theme",
    "footer.creditBefore": "Designed, built, and maintained by ",
    "footer.creditName": "Hesam Rad",
    "nav.search": "Search",
    "nav.toolsShort": "Tools",
    "nav.tabs": "Main navigation",
    "about.title": "About HandyWeb",
    "about.body":
        "HandyWeb is a collection of simple, useful tools that run entirely in your browser.",
    "redirect.title": "HandyWeb",
    "redirect.body": "Redirecting to the Persian version",
};

const DICTIONARIES: Readonly<Record<Locale, Messages>> = { fa, en };

export type MessageKey = keyof Messages;

/** Returns the translate function of one locale. */
export function useTranslations(locale: Locale): (key: MessageKey) => string {
    const messages = DICTIONARIES[locale];
    return (key) => messages[key];
}
