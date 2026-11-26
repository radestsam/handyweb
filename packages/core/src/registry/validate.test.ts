import { describe, expect, it } from "vitest";
import type { ToolCategory, ToolDefinition } from "../types/tool";
import { validateRegistry } from "./validate";
import { findToolBySlug, nonEmptyCategories, toolsInCategory } from "./lookup";

const category = (id: string, order = 1): ToolCategory => ({
    id,
    slug: id,
    order,
    title: { fa: "دسته", en: "Category" },
    description: { fa: "توضیح", en: "Description" },
});

const tool = (id: string, extra: Partial<ToolDefinition> = {}): ToolDefinition => ({
    id,
    slug: id,
    aliases: [],
    category: "text",
    alsoIn: [],
    related: [],
    tags: [],
    title: { fa: "ابزار", en: "Tool" },
    description: { fa: "توضیح", en: "Description" },
    keywords: { fa: ["ابزار"], en: ["tool"] },
    presets: [],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["text"],
    outputKinds: ["text"],
    ...extra,
});

const noop = async () => ({ default: null });
const categories = [category("text"), category("developer", 2), category("pdf", 3)];

describe("validateRegistry", () => {
    it("accepts a valid registry", () => {
        const tools = [tool("a", { related: ["b"], alsoIn: ["developer"] }), tool("b")];
        expect(validateRegistry({ categories, tools, loaders: { a: noop, b: noop } })).toEqual([]);
    });

    it("rejects a slug that collides with an alias", () => {
        const tools = [tool("a", { aliases: ["b"] }), tool("b")];
        const errors = validateRegistry({ categories, tools, loaders: { a: noop, b: noop } });
        expect(errors).toContain('Tool "b": the slug "b" is also used by "a".');
    });

    it("rejects a missing English title", () => {
        const tools = [tool("a", { title: { fa: "ابزار", en: " " } })];
        expect(validateRegistry({ categories, tools, loaders: { a: noop } })).toContain(
            'Tool "a" title: the English text is empty.',
        );
    });

    it("rejects unknown categories and related tools", () => {
        const tools = [tool("a", { category: "nope", alsoIn: ["text"], related: ["ghost", "a"] })];
        const errors = validateRegistry({ categories, tools, loaders: { a: noop } });
        expect(errors).toEqual([
            'Tool "a": unknown category "nope".',
            'Tool "a": unknown related tool "ghost".',
            'Tool "a": lists itself as related.',
        ]);
    });

    it("rejects a published tool without a loader, and a loader without a tool", () => {
        const errors = validateRegistry({ categories, tools: [tool("a")], loaders: { z: noop } });
        expect(errors).toEqual([
            'Tool "a": published, but it has no loader.',
            'Loader "z" has no tool definition.',
        ]);
    });

    it("allows a draft without a loader, but not a featured draft", () => {
        const draft = tool("a", { status: "draft" });
        expect(validateRegistry({ categories, tools: [draft], loaders: {} })).toEqual([]);
        expect(
            validateRegistry({ categories, tools: [{ ...draft, featured: true }], loaders: {} }),
        ).toEqual(['Tool "a": featured, but not published.']);
    });

    it("rejects bad slugs and duplicate presets", () => {
        const preset = {
            id: "p",
            title: { fa: "پ", en: "P" },
            keywords: { fa: [], en: [] },
            options: {},
        };
        const tools = [tool("Bad_Slug", { presets: [preset, preset] })];
        const errors = validateRegistry({ categories, tools, loaders: { Bad_Slug: noop } });
        expect(errors).toEqual([
            'Tool "Bad_Slug": "Bad_Slug" is not a valid slug.',
            'Tool "Bad_Slug": preset "p" is used twice.',
        ]);
    });
});

describe("lookups", () => {
    const tools = [
        tool("base64", { aliases: ["base64-encoder"], alsoIn: ["developer"] }),
        tool("json", { category: "developer" }),
    ];

    it("finds a tool by slug or alias", () => {
        expect(findToolBySlug(tools, "base64")?.isAlias).toBe(false);
        expect(findToolBySlug(tools, "base64-encoder")?.isAlias).toBe(true);
        expect(findToolBySlug(tools, "nothing")).toBeUndefined();
    });

    it("lists primary tools first, then alsoIn tools", () => {
        expect(toolsInCategory(tools, "developer").map((t) => t.id)).toEqual(["json", "base64"]);
    });

    it("drops empty categories", () => {
        expect(nonEmptyCategories(categories, tools).map((c) => c.id)).toEqual([
            "text",
            "developer",
        ]);
    });
});
