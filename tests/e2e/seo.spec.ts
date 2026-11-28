import { expect, test } from "@playwright/test";

// Every page in the sitemap: a unique title and description, a canonical URL
// that points at itself, one h1, a share image, and structured data that parses.
// On a tool or category page the page title starts with the h1.
test("sitemap pages have unique, complete metadata", async ({ request, browserName }, info) => {
    test.skip(browserName !== "chromium" || info.project.name !== "chromium", "Runs once.");
    const xml = await (await request.get("/sitemap.xml")).text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
        (m) => new URL(m[1] as string).pathname,
    );
    expect(urls.length).toBeGreaterThan(10);

    const titles = new Map<string, string>();
    const images = new Set<string>();
    const descriptions = new Map<string, string>();
    for (const path of urls) {
        const html = await (await request.get(path)).text();
        const title = /<title>([^<]+)<\/title>/.exec(html)?.[1] ?? "";
        const description = /<meta name="description" content="([^"]+)"/.exec(html)?.[1] ?? "";
        const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1] ?? "";
        expect(title, path).not.toBe("");
        expect(title.length, `${path} title length`).toBeLessThanOrEqual(60);
        expect(description.length, `${path} description length`).toBeGreaterThanOrEqual(50);
        expect(description.length, `${path} description length`).toBeLessThanOrEqual(170);
        expect(new URL(canonical).pathname, path).toBe(path);
        expect(html.match(/<h1[\s>]/g)?.length, `${path} h1 count`).toBe(1);
        const types: string[] = [];
        for (const block of html.matchAll(
            /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
        )) {
            expect(() => JSON.parse(block[1] as string), `${path} JSON-LD`).not.toThrow();
            types.push((JSON.parse(block[1] as string) as { "@type": string })["@type"]);
        }
        expect(types, `${path} SearchAction`).not.toContain("SearchAction");
        const image = /<meta property="og:image" content="([^"]+)"/.exec(html)?.[1] ?? "";
        expect(image, `${path} og:image`).toMatch(/^https:\/\/handyweb\.ir\/og\/.+\.png$/);
        images.add(new URL(image).pathname);
        expect(html, `${path} twitter:card`).toContain(
            '<meta name="twitter:card" content="summary_large_image"',
        );
        if (/^\/(fa|en)\/(tools|categories)\/[^/]+\/$/.test(path)) {
            const h1 = decode(/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1] ?? "");
            expect(decode(title).startsWith(h1), `${path} title starts with the h1 "${h1}"`).toBe(
                true,
            );
            expect(types, `${path} breadcrumbs`).toContain("BreadcrumbList");
        }
        if (/^\/(fa|en)\/categories\//.test(path) || /^\/(fa|en)\/tools\/$/.test(path))
            expect(types, `${path} CollectionPage`).toContain("CollectionPage");
        if (/^\/(fa|en)\/$/.test(path)) {
            expect(types, `${path} WebSite`).toContain("WebSite");
            expect(types, `${path} Organization`).toContain("Organization");
        }
        expect(titles.get(title), `duplicate title: ${title}`).toBeUndefined();
        expect(descriptions.get(description), `duplicate description on ${path}`).toBeUndefined();
        titles.set(title, path);
        descriptions.set(description, path);
    }
    for (const image of images) {
        const response = await request.get(image);
        expect(response.status(), image).toBe(200);
        expect(response.headers()["content-type"], image).toContain("image/png");
    }
});

/** The text of an HTML fragment: no tags, and the entities that Astro writes decoded. */
function decode(html: string): string {
    return html
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
}
