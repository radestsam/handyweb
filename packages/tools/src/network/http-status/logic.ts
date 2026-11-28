import type { LocalizedText } from "@handyweb/core";
import data from "./data.json";

export interface Status {
    code: number;
    name: LocalizedText;
    description: LocalizedText;
    reference: string;
}

export const DATASET = data as { version: string; source: string; entries: Status[] };

export const CLASSES: Array<{ digit: number; label: LocalizedText }> = [
    { digit: 1, label: { fa: "۱xx اطلاعاتی", en: "1xx Informational" } },
    { digit: 2, label: { fa: "۲xx موفق", en: "2xx Success" } },
    { digit: 3, label: { fa: "۳xx هدایت", en: "3xx Redirection" } },
    { digit: 4, label: { fa: "۴xx خطای کاربر", en: "4xx Client error" } },
    { digit: 5, label: { fa: "۵xx خطای سرور", en: "5xx Server error" } },
];

const fold = (text: string) =>
    text.toLowerCase().replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));

/** Statuses that match a code, a part of a code (such as 4 or 40), or words in either language. */
export function searchStatus(query: string, entries: Status[] = DATASET.entries): Status[] {
    const q = fold(query.trim());
    if (!q) return entries;
    if (/^\d{1,3}$/.test(q)) return entries.filter((entry) => String(entry.code).startsWith(q));
    const words = q.split(/\s+/);
    return entries.filter((entry) => {
        const text = fold(
            `${entry.name.en} ${entry.name.fa} ${entry.description.en} ${entry.description.fa}`,
        );
        return words.every((word) => text.includes(word));
    });
}
