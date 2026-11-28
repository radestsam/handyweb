import type { LocalizedText } from "@handyweb/core";

export const strings = {
    script: { fa: "حروف", en: "Letters" },
    latin: { fa: "لاتین (فینگلیش)", en: "Latin only" },
    persian: { fa: "فارسی", en: "Keep Persian" },
    separator: { fa: "جداکننده", en: "Separator" },
    lowercase: { fa: "حروف کوچک", en: "Lowercase" },
    maxLength: { fa: "بیشینه درازا (۰ = بی‌مرز)", en: "Max length (0 = no limit)" },
    title: { fa: "عنوان", en: "Title" },
    slug: { fa: "Slug", en: "Slug" },
    oneLine: {
        fa: "هر خط یک slug جدا می‌شود.",
        en: "Each line becomes its own slug.",
    },
} as const satisfies Record<string, LocalizedText>;
