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
        "مجموعه‌ای رایگان و متن‌باز از ابزارهای آنلاین که روی مرورگر شما اجرا می‌شوند. ورودی شما به هیچ سروری ارسال نمی‌شود.",
    "nav.home": "خانه",
    "nav.tools": "همه ابزارها",
    "nav.categories": "دسته‌ها",
    "nav.about": "درباره",
    "nav.privacy": "حریم خصوصی",
    "nav.opensource": "متن‌باز",
    "nav.contribute": "مشارکت",
    "nav.skip": "رفتن به محتوای اصلی",
    "nav.breadcrumbs": "مسیر صفحه",
    "lang.switch": "English",
    "lang.switchLabel": "تغییر زبان به انگلیسی",
    "theme.label": "پوسته",
    "theme.system": "سیستم",
    "theme.light": "روشن",
    "theme.dark": "تیره",
    "about.title": "درباره HandyWeb",
    "about.body":
        "HandyWeb مجموعه‌ای از ابزارهای ساده و کاربردی است که کاملا در مرورگر شما اجرا می‌شوند.",
    "redirect.title": "HandyWeb",
    "redirect.body": "در حال انتقال به نسخه فارسی",
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
    "lang.switchLabel": "Switch the language to Persian",
    "theme.label": "Theme",
    "theme.system": "System",
    "theme.light": "Light",
    "theme.dark": "Dark",
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
