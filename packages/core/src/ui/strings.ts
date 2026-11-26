import type { LocalizedText } from "../i18n/locales";

/** Strings of the shared tool UI. Each tool keeps its own strings in its i18n.ts. */
export const UI_STRINGS = {
    input: { fa: "ورودی", en: "Input" },
    output: { fa: "خروجی", en: "Output" },
    options: { fa: "گزینه‌ها", en: "Options" },
    copy: { fa: "کپی", en: "Copy" },
    copied: { fa: "کپی شد", en: "Copied" },
    copyFailed: {
        fa: "کپی نشد. نوشته را با دست برگزینید و کپی کنید.",
        en: "Could not copy. Select the text by hand.",
    },
    clear: { fa: "پاک کردن", en: "Clear" },
    paste: { fa: "چسباندن", en: "Paste" },
    download: { fa: "دانلود", en: "Download" },
    cancel: { fa: "ایست", en: "Cancel" },
    example: { fa: "نمونه", en: "Example" },
    chooseFile: { fa: "گزینش فایل", en: "Choose a file" },
    dropFile: { fa: "یا فایل را اینجا رها کنید", en: "or drop a file here" },
    working: { fa: "در حال پردازش…", en: "Working…" },
    errorTitle: { fa: "کار انجام نشد", en: "Error" },
    characters: { fa: "نویسه", en: "characters" },
    inputHere: { fa: "نوشته را اینجا بنویسید یا بچسبانید", en: "Type or paste here" },
    outputHere: { fa: "پاسخ اینجا نشان داده می‌شود", en: "The result appears here" },
} as const satisfies Record<string, LocalizedText>;
