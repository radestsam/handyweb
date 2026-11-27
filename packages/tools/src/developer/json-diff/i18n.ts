import type { LocalizedText } from "@handyweb/core";
import type { ChangeKind } from "./logic";

export const strings = {
    left: { fa: "JSON نخست", en: "First JSON" },
    right: { fa: "JSON دوم", en: "Second JSON" },
    ignoreArrayOrder: { fa: "ترتیب آرایه‌ها مهم نیست", en: "Ignore array order" },
    changes: { fa: "تفاوت‌ها", en: "Differences" },
    identical: {
        fa: "دو JSON از نظر ساختار یکسان‌اند.",
        en: "The two JSON documents are the same in structure.",
    },
    path: { fa: "مسیر", en: "Path" },
    before: { fa: "پیش", en: "Before" },
    after: { fa: "پس", en: "After" },
    truncated: {
        fa: "تنها ۱٬۰۰۰ تفاوت نخست نشان داده می‌شوند. همه در متن کپی هستند.",
        en: "Only the first 1,000 differences are shown. The copied text has all of them.",
    },
} as const satisfies Record<string, LocalizedText>;

export const kindLabels: Record<ChangeKind, LocalizedText> = {
    added: { fa: "افزوده", en: "Added" },
    removed: { fa: "برداشته", en: "Removed" },
    changed: { fa: "دگرگون", en: "Changed" },
    type: { fa: "نوع دگرگون", en: "Type changed" },
};
