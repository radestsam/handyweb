import type { LocalizedText } from "@handyweb/core";
import data from "./data.json";

export interface MediaType {
    type: string;
    extensions: string[];
    description: LocalizedText;
    group: string;
}

export const DATASET = data as { version: string; source: string; entries: MediaType[] };

/**
 * Entries that match an extension (".jpg", "jpg", or "photo.jpg"), a type
 * ("image/png" or "image/"), or words in either language.
 */
export function searchMime(query: string, entries: MediaType[] = DATASET.entries): MediaType[] {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    // A file name or an extension.
    const extension =
        /^[^/\s]*\.([a-z0-9]+)$/.exec(q)?.[1] ?? (/^[a-z0-9]{1,12}$/.test(q) ? q : null);
    if (extension) {
        const exact = entries.filter((entry) => entry.extensions.includes(extension));
        if (exact.length > 0) return exact;
    }
    if (q.includes("/")) return entries.filter((entry) => entry.type.startsWith(q));
    const words = q.split(/\s+/);
    return entries.filter((entry) => {
        const text =
            `${entry.type} ${entry.extensions.join(" ")} ${entry.description.en} ${entry.description.fa}`.toLowerCase();
        return words.every((word) => text.includes(word));
    });
}
