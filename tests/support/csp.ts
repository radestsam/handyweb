import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Page } from "@playwright/test";

const DIST = join(import.meta.dirname, "../../apps/web/dist");

interface Rule {
    path: string;
    set: [string, string][];
    remove: string[];
}

/** Reads dist/_headers, which scripts/generate-headers.mjs writes. */
export function readHeaderRules(): Rule[] {
    const rules: Rule[] = [];
    for (const line of readFileSync(join(DIST, "_headers"), "utf8").split("\n")) {
        if (!line.trim() || line.startsWith("#")) continue;
        if (!line.startsWith(" ")) {
            rules.push({ path: line.trim(), set: [], remove: [] });
            continue;
        }
        const rule = rules.at(-1);
        if (!rule) throw new Error("_headers: a header before the first path");
        const text = line.trim();
        if (text.startsWith("! ")) rule.remove.push(text.slice(2).toLowerCase());
        else {
            const index = text.indexOf(":");
            rule.set.push([text.slice(0, index).toLowerCase(), text.slice(index + 1).trim()]);
        }
    }
    return rules;
}

const matches = (pattern: string, path: string) =>
    pattern.endsWith("*") ? path.startsWith(pattern.slice(0, -1)) : pattern === path;

/** The headers that a host with this _headers file sends for a path, as Cloudflare Pages does. */
export function headersFor(rules: Rule[], path: string): Record<string, string> {
    const headers: Record<string, string> = {};
    for (const rule of rules) {
        if (!matches(rule.path, path)) continue;
        for (const name of rule.remove) delete headers[name];
        for (const [name, value] of rule.set) {
            headers[name] = headers[name] ? `${headers[name]}, ${value}` : value;
        }
    }
    return headers;
}

/**
 * Serves the pages of this origin with the generated headers, and records
 * every CSP violation of the page, its frames, and its workers.
 */
export async function serveWithHeaders(page: Page, origin: string): Promise<string[]> {
    const rules = readHeaderRules();
    const violations: string[] = [];
    await page.route(`${origin}/**`, async (route) => {
        const response = await route.fetch();
        const path = new URL(route.request().url()).pathname;
        await route.fulfill({
            response,
            headers: { ...response.headers(), ...headersFor(rules, path) },
        });
    });
    await page.addInitScript(() => {
        document.addEventListener("securitypolicyviolation", (event) => {
            console.error(
                `CSP violation: ${event.violatedDirective} blocked ${event.blockedURI || "inline"}`,
            );
        });
    });
    page.on("console", (message) => {
        const text = message.text();
        if (/Content.Security.Policy|CSP violation|Refused to/i.test(text)) violations.push(text);
    });
    return violations;
}
