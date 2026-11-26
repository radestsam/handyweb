import type { ToolCategory, ToolDefinition, ToolLoader } from "../types/tool";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface Registry {
    categories: readonly ToolCategory[];
    tools: readonly ToolDefinition[];
    loaders: Readonly<Record<string, ToolLoader>>;
}

/**
 * Checks the whole registry and returns every problem it finds. An empty list
 * means the registry is valid. The build and the unit tests call it, so a bad
 * entry stops the build (plan section 4.1).
 */
export function validateRegistry({ categories, tools, loaders }: Registry): string[] {
    const errors: string[] = [];
    const fail = (message: string) => errors.push(message);

    const categoryIds = new Set<string>();
    const categorySlugs = new Set<string>();
    for (const category of categories) {
        if (categoryIds.has(category.id)) fail(`Category id "${category.id}" is used twice.`);
        if (categorySlugs.has(category.slug))
            fail(`Category slug "${category.slug}" is used twice.`);
        if (!SLUG.test(category.slug))
            fail(`Category slug "${category.slug}" is not a valid slug.`);
        categoryIds.add(category.id);
        categorySlugs.add(category.slug);
        checkText(`Category "${category.id}" title`, category.title, fail);
        checkText(`Category "${category.id}" description`, category.description, fail);
    }

    const toolIds = new Set<string>();
    const routes = new Map<string, string>();
    for (const tool of tools) {
        const name = `Tool "${tool.id}"`;
        if (toolIds.has(tool.id)) fail(`${name}: the id is used twice.`);
        toolIds.add(tool.id);

        for (const slug of [tool.slug, ...tool.aliases]) {
            if (!SLUG.test(slug)) fail(`${name}: "${slug}" is not a valid slug.`);
            const owner = routes.get(slug);
            if (owner !== undefined)
                fail(`${name}: the slug "${slug}" is also used by "${owner}".`);
            routes.set(slug, tool.id);
        }

        checkText(`${name} title`, tool.title, fail);
        checkText(`${name} description`, tool.description, fail);
        if (tool.limitations) checkText(`${name} limitations`, tool.limitations, fail);
        if (tool.keywords.fa.length === 0) fail(`${name}: no Persian keywords.`);
        if (tool.keywords.en.length === 0) fail(`${name}: no English keywords.`);

        if (!categoryIds.has(tool.category)) fail(`${name}: unknown category "${tool.category}".`);
        for (const other of tool.alsoIn) {
            if (!categoryIds.has(other)) fail(`${name}: unknown category "${other}" in alsoIn.`);
            if (other === tool.category) fail(`${name}: alsoIn repeats the primary category.`);
        }

        const presetIds = new Set<string>();
        for (const preset of tool.presets) {
            if (!SLUG.test(preset.id))
                fail(`${name}: preset id "${preset.id}" is not a valid slug.`);
            if (presetIds.has(preset.id)) fail(`${name}: preset "${preset.id}" is used twice.`);
            presetIds.add(preset.id);
            checkText(`${name} preset "${preset.id}" title`, preset.title, fail);
        }

        if (tool.inputKinds.length === 0) fail(`${name}: no input kinds.`);
        if (tool.outputKinds.length === 0) fail(`${name}: no output kinds.`);
        if (
            tool.privacy === "local" &&
            tool.execution === "local-ai" &&
            tool.networkUse === "none"
        ) {
            fail(`${name}: a local AI tool downloads a model, so networkUse cannot be "none".`);
        }
        if (tool.status === "published" && !(tool.id in loaders)) {
            fail(`${name}: published, but it has no loader.`);
        }
        if (tool.featured && tool.status !== "published")
            fail(`${name}: featured, but not published.`);
    }

    for (const tool of tools) {
        for (const id of tool.related) {
            if (!toolIds.has(id)) fail(`Tool "${tool.id}": unknown related tool "${id}".`);
            if (id === tool.id) fail(`Tool "${tool.id}": lists itself as related.`);
        }
    }

    for (const id of Object.keys(loaders)) {
        if (!toolIds.has(id)) fail(`Loader "${id}" has no tool definition.`);
    }

    return errors;
}

function checkText(label: string, text: { fa: string; en: string }, fail: (m: string) => void) {
    if (text.fa.trim() === "") fail(`${label}: the Persian text is empty.`);
    if (text.en.trim() === "") fail(`${label}: the English text is empty.`);
}
