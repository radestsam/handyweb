import type { LocalizedText } from "@handyweb/core";

export const strings = {
    ofTitle: { fa: "چند درصدِ یک عدد", en: "Percent of a number" },
    percent: { fa: "درصد", en: "Percent" },
    number: { fa: "عدد", en: "Number" },
    whatTitle: { fa: "یک عدد چند درصدِ دیگری است", en: "One number as a percent of another" },
    part: { fa: "بخش", en: "Part" },
    whole: { fa: "کل", en: "Whole" },
    changeTitle: { fa: "درصد تغییر", en: "Percent change" },
    oldValue: { fa: "مقدار پیشین", en: "Old value" },
    newValue: { fa: "مقدار تازه", en: "New value" },
    addTitle: { fa: "افزودن یا کم کردن درصد", en: "Add or take away a percent" },
    change: { fa: "درصد (منفی برای کم کردن)", en: "Percent (negative to take away)" },
    result: { fa: "پاسخ", en: "Answer" },
    none: { fa: "تقسیم بر صفر؛ پاسخی ندارد.", en: "Division by zero; there is no answer." },
    increase: { fa: "افزایش", en: "increase" },
    decrease: { fa: "کاهش", en: "decrease" },
} as const satisfies Record<string, LocalizedText>;
