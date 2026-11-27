import { ToolFailure } from "@handyweb/core/runtime";
import { cryptoSource, randomInt, type RandomSource } from "../../crypto/password-generator/logic";
import { LATIN_START, LATIN_WORDS, PERSIAN_WORDS } from "./words";

export type Language = "fa" | "la";
export type Unit = "paragraphs" | "sentences" | "words";

export interface LoremOptions {
    language: Language;
    unit: Unit;
    count: number;
    /** Latin only: start with "Lorem ipsum dolor sit amet, …". */
    classicStart: boolean;
}

export const MAX_COUNT = 500;

function pick(list: readonly string[], random: RandomSource): string {
    return list[randomInt(list.length, random)] as string;
}

function range(min: number, max: number, random: RandomSource): number {
    return min + randomInt(max - min + 1, random);
}

function sentence(language: Language, random: RandomSource): string {
    const list = language === "fa" ? PERSIAN_WORDS : LATIN_WORDS;
    const words = Array.from({ length: range(6, 14, random) }, () => pick(list, random));
    // A comma after a middle word in some sentences, as in real text.
    if (words.length > 8 && randomInt(2, random) === 0) {
        const at = range(3, words.length - 4, random);
        words[at] = `${words[at] as string}${language === "fa" ? "،" : ","}`;
    }
    let text = words.join(" ");
    if (language === "la") text = text.charAt(0).toUpperCase() + text.slice(1);
    return `${text}.`;
}

function paragraph(language: Language, random: RandomSource): string {
    return Array.from({ length: range(3, 6, random) }, () => sentence(language, random)).join(" ");
}

export function generateLorem(options: LoremOptions, random: RandomSource = cryptoSource): string {
    const { count, language, unit } = options;
    if (!Number.isInteger(count) || count < 1 || count > MAX_COUNT) {
        throw new ToolFailure(
            "invalid-input",
            { fa: "شمار باید میان ۱ و ۵۰۰ باشد.", en: "The count must be from 1 to 500." },
            "count",
        );
    }
    let text: string;
    if (unit === "words") {
        const list = language === "fa" ? PERSIAN_WORDS : LATIN_WORDS;
        text = Array.from({ length: count }, () => pick(list, random)).join(" ");
    } else if (unit === "sentences") {
        text = Array.from({ length: count }, () => sentence(language, random)).join(" ");
    } else {
        text = Array.from({ length: count }, () => paragraph(language, random)).join("\n\n");
    }
    if (language === "la" && options.classicStart) {
        const start = LATIN_START.split(" ");
        if (unit === "words") {
            const rest = text.split(" ").slice(start.length);
            text = [...start.map((w) => w.replace(",", "")).slice(0, count), ...rest].join(" ");
        } else {
            text = `${LATIN_START}, ${text.charAt(0).toLowerCase()}${text.slice(1)}`;
        }
    }
    return text;
}
