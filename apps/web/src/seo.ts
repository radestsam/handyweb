import { localePath, type Locale, type ToolDefinition } from "@handyweb/core";

/*
 * Structured data (schema.org) that more than one page uses. Each builder
 * describes only content that the page also shows.
 */

export const SITE = new URL("https://handyweb.ir");

/** The repository of the site. The Organization lists it in `sameAs`. */
export const REPOSITORY = "https://github.com/radestsam/handyweb";

/** The share image for each locale (1200 × 630 PNG in public/og/). */
export const SHARE_IMAGE = {
    width: 1200,
    height: 630,
    path: (locale: Locale) => `/og/handyweb-${locale}.png`,
    alt: {
        fa: "HandyWeb: ابزارهای آنلاین رایگان که روی دستگاه خودتان کار می‌کنند",
        en: "HandyWeb: free online tools that run on your own device",
    },
} as const;

const url = (locale: Locale, path: string, site: URL) =>
    new URL(localePath(locale, path), site).href;

/** A breadcrumb trail that starts at the home page. The last item is the current page. */
export function breadcrumbList(
    locale: Locale,
    site: URL,
    items: ReadonlyArray<{ name: string; path: string }>,
) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: url(locale, item.path, site),
        })),
    };
}

/** A page that lists tools, with the tools in the order the page shows them. */
export function collectionPage(
    locale: Locale,
    site: URL,
    page: { name: string; description: string; path: string },
    tools: readonly ToolDefinition[],
) {
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: page.name,
        description: page.description,
        url: url(locale, page.path, site),
        inLanguage: locale === "fa" ? "fa-IR" : "en",
        isPartOf: { "@type": "WebSite", name: "HandyWeb", url: SITE.href },
        mainEntity: {
            "@type": "ItemList",
            numberOfItems: tools.length,
            itemListElement: tools.map((tool, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: tool.title[locale],
                url: url(locale, `/tools/${tool.slug}`, site),
            })),
        },
    };
}

/**
 * The site name and the publisher, for the home page. Google reads the site
 * name from the WebSite of the domain home page, so `url` is the domain root.
 */
export function homeJsonLd(locale: Locale, site: URL, description: string) {
    return [
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "HandyWeb",
            url: new URL("/", site).href,
            inLanguage: locale === "fa" ? "fa-IR" : "en",
            description,
            publisher: { "@id": new URL("/#organization", site).href },
        },
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": new URL("/#organization", site).href,
            name: "HandyWeb",
            url: new URL("/", site).href,
            logo: new URL("/icon-512.png", site).href,
            sameAs: [REPOSITORY],
        },
    ];
}
