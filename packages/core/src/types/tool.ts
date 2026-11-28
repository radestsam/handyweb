import type { LocalizedText } from "../i18n/locales";

/** Where a tool does its work (plan section 2.3). */
export type ToolExecutionMode = "main-thread" | "worker" | "wasm-worker" | "local-ai";

/**
 * Where the input of a tool goes. `local`: nowhere, it stays in the browser.
 * `external-consent-required`: to a named service after an explicit consent
 * step. No tool uses the second mode in the initial release.
 */
export type ToolPrivacyMode = "local" | "external-consent-required";

/**
 * The network use of a tool, apart from the static files of the site.
 * `one-time-asset-download` is a model or WASM file. It is never user input.
 */
export type ToolNetworkUse = "none" | "one-time-asset-download";

export type ToolDataKind = "text" | "file" | "image" | "audio" | "video" | "structured";

/** A set of initial options that turns a general tool into a specific one. */
export interface ToolPreset {
    /** Used as `?preset=<id>`. */
    id: string;
    title: LocalizedText;
    keywords: { fa: string[]; en: string[] };
    /** Initial option values for the tool UI. */
    options: Readonly<Record<string, unknown>>;
}

/** A category of tools. */
export interface ToolCategory {
    id: string;
    slug: string;
    title: LocalizedText;
    /** The page title in search results, without the site name. It starts with `title`. */
    seoTitle: LocalizedText;
    description: LocalizedText;
    /** Sort order on the home page and the directory. */
    order: number;
}

/**
 * The metadata of one tool. It holds no code, so pages, search, and the
 * sitemap can read it without loading the tool (plan section 4.1).
 */
export interface ToolDefinition {
    /** Canonical id. Never reused for another tool. */
    id: string;
    /** English, stable, the same in both locales. */
    slug: string;
    /** More slugs that redirect to this tool. */
    aliases: string[];
    /** The primary category. The tool has one route. */
    category: string;
    /** Other categories that also list this tool. */
    alsoIn: string[];
    /** Related tool ids. */
    related: string[];
    tags: string[];
    /** The short name: the h1, the tool lists, and the breadcrumbs. */
    title: LocalizedText;
    /**
     * The page title in search results, without the site name. It starts
     * with `title`, so the h1 and the page title agree. Use the words that
     * people search for. Keep it at 49 characters or fewer, because the site
     * name adds 11.
     */
    seoTitle: LocalizedText;
    description: LocalizedText;
    keywords: { fa: string[]; en: string[] };
    presets: ToolPreset[];
    execution: ToolExecutionMode;
    privacy: ToolPrivacyMode;
    networkUse: ToolNetworkUse;
    maturity: "stable" | "beta" | "experimental";
    /** `draft`: built, but not in the navigation, the search, or the sitemap. */
    status: "published" | "draft";
    /** On the curated "popular tools" list (D12). */
    featured: boolean;
    inputKinds: ToolDataKind[];
    outputKinds: ToolDataKind[];
    limits?: { maxInputBytes?: number; maxFileBytes?: number };
    limitations?: LocalizedText;
    /** How to use the tool, and answers to common questions. Shown on the tool page. */
    guide?: {
        steps: LocalizedText[];
        faq: Array<{ question: LocalizedText; answer: LocalizedText }>;
    };
    /**
     * A link to another product of the same creator, shown under the tool.
     * `text` comes first, then the link with `label`. Only a link: the page
     * loads nothing from `href`.
     */
    externalLink?: { href: string; label: string; text: LocalizedText };
    /** A typical text input. The shared browser tests run the tool with it. */
    example?: string;
}

/** Loads the UI module of a tool. The module is a separate chunk. */
export type ToolLoader = () => Promise<{ default: unknown }>;
