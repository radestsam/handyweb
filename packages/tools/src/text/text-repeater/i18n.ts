import type { LocalizedText } from "@handyweb/core";

export const strings = {
    count: { fa: "شمار تکرار", en: "Repeat count" },
    separator: { fa: "جداکننده", en: "Separator" },
    newline: { fa: "خط تازه", en: "New line" },
    space: { fa: "اسپیس", en: "Space" },
    nothing: { fa: "هیچ", en: "None" },
    custom: { fa: "دلخواه", en: "Custom" },
    customSeparator: { fa: "جداکننده دلخواه", en: "Custom separator" },
} as const satisfies Record<string, LocalizedText>;
