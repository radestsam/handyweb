import type { ToolCategory, ToolDefinition } from "../types/tool";

/** Tools that appear in the navigation, the search, and the sitemap. */
export function publishedTools(tools: readonly ToolDefinition[]): ToolDefinition[] {
    return tools.filter((tool) => tool.status === "published");
}

/** Finds a tool by its slug or by one of its aliases. */
export function findToolBySlug(
    tools: readonly ToolDefinition[],
    slug: string,
): { tool: ToolDefinition; isAlias: boolean } | undefined {
    for (const tool of tools) {
        if (tool.slug === slug) return { tool, isAlias: false };
        if (tool.aliases.includes(slug)) return { tool, isAlias: true };
    }
    return undefined;
}

/** The tools of a category: the primary ones first, then the ones from alsoIn. */
export function toolsInCategory(
    tools: readonly ToolDefinition[],
    categoryId: string,
): ToolDefinition[] {
    const primary = tools.filter((tool) => tool.category === categoryId);
    const secondary = tools.filter((tool) => tool.alsoIn.includes(categoryId));
    return [...primary, ...secondary];
}

/** Categories that hold at least one of the given tools, in their sort order. */
export function nonEmptyCategories(
    categories: readonly ToolCategory[],
    tools: readonly ToolDefinition[],
): ToolCategory[] {
    return [...categories]
        .filter((category) => toolsInCategory(tools, category.id).length > 0)
        .sort((a, b) => a.order - b.order);
}
