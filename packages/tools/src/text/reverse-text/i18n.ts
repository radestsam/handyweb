import type { LocalizedText } from "@handyweb/core";
import type { ReverseMode } from "./logic";

export const strings = {
    mode: { fa: "وارونه کردن", en: "Reverse" },
} as const satisfies Record<string, LocalizedText>;

export const modeLabels: Record<ReverseMode, LocalizedText> = {
    characters: { fa: "نویسه‌ها", en: "Characters" },
    words: { fa: "واژه‌ها", en: "Words" },
    lines: { fa: "خط‌ها", en: "Lines" },
};
