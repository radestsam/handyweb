import { LOCALES, publishedTools, type Locale, type ToolDefinition } from "@handyweb/core";
import { catalog } from "@handyweb/tools/catalog";
import { categories } from "@handyweb/tools/categories";

export const tools = publishedTools(catalog);
export { categories };

export function categoryOf(tool: ToolDefinition) {
    return categories.find((category) => category.id === tool.category);
}

/** One page per published tool and locale, plus a redirect page per alias. */
export function toolStaticPaths() {
    return LOCALES.flatMap((locale: Locale) =>
        tools.flatMap((tool) => [
            { params: { locale, slug: tool.slug }, props: { tool, alias: false } },
            ...tool.aliases.map((slug) => ({
                params: { locale, slug },
                props: { tool, alias: true },
            })),
        ]),
    );
}

/*
 * The tools that the home page shows, in this order. The site has no
 * analytics, so this is a hand-picked list of the tools that people need
 * most often, not a measured ranking. Every id must be a published tool:
 * `featuredTools` throws at build time if one is missing.
 */
export const FEATURED = [
    "jalali-converter",
    "persian-normalizer",
    "text-counter",
    "base64",
    "json-formatter",
    "password-generator",
    "qr-generator",
    "image-compressor",
    "image-resize",
    "pdf-merge",
    "unit-converter",
    "hash",
] as const;

export function featuredTools(): ToolDefinition[] {
    return FEATURED.map((slug) => {
        const tool = tools.find((t) => t.slug === slug);
        if (!tool) throw new Error(`Featured tool "${slug}" is not a published tool.`);
        return tool;
    });
}
