import type { APIRoute } from "astro";
import { LOCALES, normalizeForSearch } from "@handyweb/core";
import { categories, tools } from "../i18n/tools";

/*
 * The search index: one entry per published tool, built at build time. The
 * client fetches it once, on the first search, and searches it locally. The
 * query never leaves the browser.
 */
export interface SearchEntry {
    slug: string;
    category: string;
    title: { fa: string; en: string };
    description: { fa: string; en: string };
    /** Normalized text, in priority order: titles, keywords and aliases, descriptions. */
    titles: string;
    terms: string;
    text: string;
}

export const GET: APIRoute = () => {
    const entries: SearchEntry[] = tools.map((tool) => {
        const category = categories.find((c) => c.id === tool.category);
        return {
            slug: tool.slug,
            category: category ? `${category.title.fa} / ${category.title.en}` : "",
            title: tool.title,
            description: tool.description,
            titles: normalizeForSearch(
                [
                    ...LOCALES.map((l) => tool.title[l]),
                    ...tool.presets.flatMap((p) => LOCALES.map((l) => p.title[l])),
                ].join(" | "),
            ),
            terms: normalizeForSearch(
                [
                    ...tool.keywords.fa,
                    ...tool.keywords.en,
                    ...tool.presets.flatMap((p) => [...p.keywords.fa, ...p.keywords.en]),
                    tool.slug.replace(/-/g, " "),
                    ...tool.aliases.map((a) => a.replace(/-/g, " ")),
                    ...tool.tags,
                ].join(" | "),
            ),
            text: normalizeForSearch(LOCALES.map((l) => tool.description[l]).join(" | ")),
        };
    });
    return new Response(JSON.stringify(entries), {
        headers: { "Content-Type": "application/json" },
    });
};
