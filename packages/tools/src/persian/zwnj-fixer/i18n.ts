import type { LocalizedText } from "@handyweb/core";
import type { ZwnjRule } from "./logic";

export const strings = {
    rules: { fa: "کجا نیم‌فاصله گذاشته شود", en: "Where to add a ZWNJ" },
    changes: { fa: "ویرایش‌ها", en: "Changes" },
    noChanges: { fa: "نیازی به ویرایش نبود.", en: "No changes were needed." },
    diffTooLarge: {
        fa: "نوشته برای نشان دادن تک‌تک ویرایش‌ها بزرگ است. شمار ویرایش‌ها در بالا آمده است.",
        en: "The text is too large to show each change. The counts are above.",
    },
} as const satisfies Record<string, LocalizedText>;

export const ruleLabels: Record<ZwnjRule, LocalizedText> = {
    prefix: { fa: "می و نمی (می روم ← می‌روم)", en: "می and نمی prefixes (می روم → می‌روم)" },
    plural: { fa: "ها و های (کتاب ها ← کتاب‌ها)", en: "Plural ها and های (کتاب ها → کتاب‌ها)" },
    comparative: { fa: "تر و ترین (بزرگ تر ← بزرگ‌تر)", en: "تر and ترین (بزرگ تر → بزرگ‌تر)" },
    heSuffix: {
        fa: "ای، ام، اند پس از ه (خانه ای ← خانه‌ای)",
        en: "ای, ام, اند after ه (خانه ای → خانه‌ای)",
    },
};
