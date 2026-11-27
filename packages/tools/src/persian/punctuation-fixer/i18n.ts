import type { LocalizedText } from "@handyweb/core";
import type { PunctuationRule } from "./logic";

export const strings = {
    rules: { fa: "چه چیزهایی درست شود", en: "Rules" },
    changes: { fa: "ویرایش‌ها", en: "Changes" },
    noChanges: { fa: "نیازی به ویرایش نبود.", en: "No changes were needed." },
} as const satisfies Record<string, LocalizedText>;

export const ruleLabels: Record<PunctuationRule, LocalizedText> = {
    marks: { fa: ", ; ? لاتین به ، ؛ ؟", en: "Latin , ; ? to ، ؛ ؟" },
    quotes: { fa: 'گیومه "…" به «…»', en: 'Quotes "…" to «…»' },
    spacing: { fa: "اسپیس پیش و پس از نشانه‌ها", en: "Spaces before and after marks" },
    brackets: { fa: "اسپیس درون پرانتز و گیومه", en: "Spaces inside brackets and quotes" },
    ellipsis: { fa: "... به …", en: "... to …" },
};
