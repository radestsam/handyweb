import type { LocalizedText } from "@handyweb/core";
import type { DirectionMode } from "./logic";

export const strings = {
    mode: { fa: "کار", en: "Action" },
    before: { fa: "پیش‌نمایش ورودی", en: "Input preview" },
    after: { fa: "پیش‌نمایش خروجی", en: "Output preview" },
    added: { fa: "نشانه افزوده شد", en: "marks added" },
    removed: { fa: "نشانه برداشته شد", en: "marks removed" },
    previewNote: {
        fa: "پیش‌نمایش در یک بند راست‌به‌چپ نشان داده می‌شود، همان‌گونه که در یک صفحه فارسی دیده می‌شود.",
        en: "The previews show the text in a right-to-left paragraph, as on a Persian page.",
    },
} as const satisfies Record<string, LocalizedText>;

export const modeLabels: Record<DirectionMode, LocalizedText> = {
    lrm: { fa: "LRM", en: "LRM" },
    isolate: { fa: "جداسازی", en: "Isolate" },
    remove: { fa: "پاک کردن", en: "Remove" },
};
