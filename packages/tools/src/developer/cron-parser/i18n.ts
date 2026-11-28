import type { LocalizedText } from "@handyweb/core";
import type { FieldName } from "./logic";

export const strings = {
    expression: { fa: "عبارت cron", en: "Cron expression" },
    hint: {
        fa: "پنج بخش: دقیقه، ساعت، روز ماه، ماه، روز هفته. نمونه:",
        en: "Five fields: minute, hour, day of month, month, day of week. Example:",
    },
    meaning: { fa: "معنا", en: "Meaning" },
    fields: { fa: "بخش‌ها", en: "Fields" },
    next: { fa: "اجراهای بعدی", en: "Next runs" },
    none: { fa: "در پنج سال آینده اجرایی نیست.", en: "No run in the next five years." },
    zone: { fa: "به وقت این دستگاه", en: "In the time zone of this device" },
} as const satisfies Record<string, LocalizedText>;

export const fieldLabels: Record<FieldName, LocalizedText> = {
    minute: { fa: "دقیقه", en: "Minute" },
    hour: { fa: "ساعت", en: "Hour" },
    dayOfMonth: { fa: "روز ماه", en: "Day of month" },
    month: { fa: "ماه", en: "Month" },
    dayOfWeek: { fa: "روز هفته", en: "Day of week" },
};
