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
