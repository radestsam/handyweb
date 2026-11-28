import type { LocalizedText } from "@handyweb/core";

export const strings = {
    input: { fa: "عدد یا عدد رومی", en: "Number or Roman numeral" },
    roman: { fa: "رومی", en: "Roman" },
    number: { fa: "عدد", en: "Number" },
    table: { fa: "نمادها", en: "Symbols" },
} as const satisfies Record<string, LocalizedText>;
