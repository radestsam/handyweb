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
    "lang.switchLabel": "تغییر زبان",
    "theme.label": "پوسته",
    "theme.system": "سیستم",
    "theme.light": "روشن",
    "theme.dark": "تیره",
    "nav.main": "منوی اصلی",
    "nav.footer": "پیوندهای پایین صفحه",
    "nav.source": "کد منبع در GitHub",
    "footer.license": "متن‌باز با مجوز Apache 2.0",
    "footer.local": "ابزارها روی دستگاه شما اجرا می‌شوند. هیچ ورودی‌ای ذخیره یا ارسال نمی‌شود.",
    "theme.button": "تغییر پوسته",
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
    "lang.switchLabel": "Change the language",
    "theme.label": "Theme",
    "theme.system": "System",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "nav.main": "Main menu",
    "nav.footer": "Footer links",
    "nav.source": "Source code on GitHub",
    "footer.license": "Open source under the Apache 2.0 license",
    "footer.local": "The tools run on your device. No input is stored or sent.",
    "theme.button": "Change the theme",
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
