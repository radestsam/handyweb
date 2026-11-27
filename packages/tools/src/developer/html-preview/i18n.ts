import type { LocalizedText } from "@handyweb/core";

export const strings = {
    html: { fa: "کد HTML", en: "HTML code" },
    preview: { fa: "پیش‌نمایش", en: "Preview" },
    scripts: { fa: "اجرای اسکریپت‌های درون صفحه", en: "Run inline scripts" },
    rtl: { fa: "راست‌به‌چپ", en: "Right to left" },
    note: {
        fa: "پیش‌نمایش در یک قاب جدا و بسته اجرا می‌شود: به این صفحه دسترسی ندارد و هیچ درخواستی به اینترنت نمی‌فرستد، پس تصویر و فایل‌های بیرونی بارگیری نمی‌شوند.",
        en: "The preview runs in a separate, sandboxed frame: it cannot reach this page and sends no request to the internet, so remote images and files do not load.",
    },
} as const satisfies Record<string, LocalizedText>;
