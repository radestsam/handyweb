import type { LocalizedText } from "@handyweb/core";

export const strings = {
    markdown: { fa: "Markdown", en: "Markdown" },
    preview: { fa: "پیش‌نمایش", en: "Preview" },
    rtl: { fa: "راست‌به‌چپ", en: "Right to left" },
    copyHtml: { fa: "کپی HTML", en: "Copy HTML" },
    downloadHtml: { fa: "دانلود HTML", en: "Download HTML" },
    downloadMd: { fa: "دانلود Markdown", en: "Download Markdown" },
    note: {
        fa: "خروجی پاک‌سازی می‌شود: اسکریپت و پیوندهای javascript: برداشته می‌شوند. تصویرهای اینترنتی در پیش‌نمایش بارگیری نمی‌شوند.",
        en: "The output is sanitized: scripts and javascript: links are removed. Internet images do not load in the preview.",
    },
} as const satisfies Record<string, LocalizedText>;
