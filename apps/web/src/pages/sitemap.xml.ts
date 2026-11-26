import type { APIRoute } from "astro";
import {
    LANGUAGE_TAG,
    LOCALES,
    localePath,
    nonEmptyCategories,
    toolsInCategory,
} from "@handyweb/core";
import { categories, tools } from "../i18n/tools";

/*
 * The sitemap lists the canonical page of every published tool, every
 * non-empty category, and the static pages, once per locale, with hreflang
 * alternates. Alias pages and drafts are not in it (plan section 14).
 */
const STATIC_PATHS = ["/", "/tools", "/about", "/privacy", "/opensource", "/contribute"];

export const GET: APIRoute = ({ site }) => {
    const base = site ?? new URL("https://handyweb.ir");
    const paths = [
        ...STATIC_PATHS,
        ...nonEmptyCategories(categories, tools)
            .filter((category) => toolsInCategory(tools, category.id).length > 0)
            .map((category) => `/categories/${category.slug}`),
        ...tools.map((tool) => `/tools/${tool.slug}`),
    ];

    const url = (path: string) =>
        LOCALES.map((locale) => {
            const alternates = LOCALES.map(
                (other) =>
                    `<xhtml:link rel="alternate" hreflang="${LANGUAGE_TAG[other]}" href="${new URL(localePath(other, path), base).href}"/>`,
            ).join("");
            const xDefault = `<xhtml:link rel="alternate" hreflang="x-default" href="${new URL(localePath("fa", path), base).href}"/>`;
            return `<url><loc>${new URL(localePath(locale, path), base).href}</loc>${alternates}${xDefault}</url>`;
        }).join("");

    const body =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">` +
        paths.map(url).join("") +
        `</urlset>\n`;

    return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
