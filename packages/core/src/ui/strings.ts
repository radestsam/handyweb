import type { LocalizedText } from "../i18n/locales";

/** Strings of the shared tool UI. Each tool keeps its own strings in its i18n.ts. */
export const UI_STRINGS = {
    input: { fa: "ورودی", en: "Input" },
    output: { fa: "خروجی", en: "Output" },
    options: { fa: "تنظیمات", en: "Options" },
    copy: { fa: "کپی", en: "Copy" },
    copied: { fa: "کپی شد", en: "Copied" },
    copyFailed: {
        fa: "کپی نشد. متن را دستی انتخاب کنید.",
        en: "Could not copy. Select the text by hand.",
    },
    clear: { fa: "پاک کردن", en: "Clear" },
    download: { fa: "دانلود", en: "Download" },
    cancel: { fa: "لغو", en: "Cancel" },
    example: { fa: "نمونه", en: "Example" },
    chooseFile: { fa: "انتخاب فایل", en: "Choose a file" },
    dropFile: { fa: "یا فایل را اینجا رها کنید", en: "or drop a file here" },
    working: { fa: "در حال پردازش…", en: "Working…" },
    errorTitle: { fa: "خطا", en: "Error" },
    characters: { fa: "نویسه", en: "characters" },
} as const satisfies Record<string, LocalizedText>;
