// Fails when a page of the build loads more JavaScript than its budget.
// It follows every script that a page loads at start: <script src>, the
// island component and renderer, and their static imports. Sizes are gzip.
// Tool code that loads on demand (import()) is checked per chunk.
//
//   node scripts/check-budget.mjs [dist]
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { gzipSync } from "node:zlib";

const DIST = process.argv[2] ?? "apps/web/dist";
const KB = 1024;
const BUDGET = {
    // A page without a tool: the theme, language, and search scripts only.
    page: 15 * KB,
    // A tool page: React, the island, and the shared tool UI.
    toolPage: 90 * KB,
    // One tool chunk, loaded on demand.
    chunk: 60 * KB,
    // The PDF library chunk (pdf-lib.*.js). Only PDF tool pages load it, on
    // demand. Owner decision of 2026-11-27, see README.md ("Deviations").
    pdfLib: 260 * KB,
};

const gz = (path) => gzipSync(readFileSync(path)).length;
const files = (dir) =>
    readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        return statSync(path).isDirectory() ? files(path) : [path];
    });

function staticImports(path, seen) {
    if (seen.has(path)) return;
    seen.add(path);
    const code = readFileSync(path, "utf8");
    for (const match of code.matchAll(
        /(?:^|[;\s])import\s*(?:[^"'()]*?from\s*)?["'](\.{1,2}\/[^"']+\.js)["']/g,
    )) {
        staticImports(join(path, "..", match[1]), seen);
    }
}

const failures = [];
const report = [];
// Files that load at the start of a page. They count in the page budget, not
// in the budget of an on-demand chunk.
const startFiles = new Set();
for (const html of files(DIST).filter((f) => f.endsWith(".html"))) {
    const text = readFileSync(html, "utf8");
    const urls = [
        ...[...text.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]),
        ...[...text.matchAll(/(?:component|renderer)-url="([^"]+)"/g)].map((m) => m[1]),
    ];
    const seen = new Set();
    for (const url of urls) staticImports(join(DIST, url), seen);
    for (const file of seen) startFiles.add(file);
    const inline = [...text.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)]
        .map((m) => gzipSync(m[1]).length)
        .reduce((a, b) => a + b, 0);
    const total = [...seen].map(gz).reduce((a, b) => a + b, 0) + inline;
    const isTool = text.includes("<astro-island");
    const budget = isTool ? BUDGET.toolPage : BUDGET.page;
    const page = relative(DIST, html);
    report.push([total, page]);
    if (total > budget) failures.push(`${page}: ${(total / KB).toFixed(1)} KB > ${budget / KB} KB`);
}

// The React renderer (client.*.js) loads at the start of a tool page, so it
// counts in the tool page budget. Skip it here, also when no tool page exists.
for (const chunk of files(join(DIST, "_astro")).filter(
    (f) => f.endsWith(".js") && !startFiles.has(f) && !/[\/]client\.[\w-]+\.js$/.test(f),
)) {
    const size = gz(chunk);
    const budget = /[\/]pdf-lib\.[\w-]+\.js$/.test(chunk) ? BUDGET.pdfLib : BUDGET.chunk;
    if (size > budget)
        failures.push(`${relative(DIST, chunk)}: ${(size / KB).toFixed(1)} KB > ${budget / KB} KB`);
}

report.sort((a, b) => b[0] - a[0]);
console.log("Largest and smallest pages (gzip JS at start):");
for (const [size, page] of [...report.slice(0, 3), ...report.slice(-2)])
    console.log(`  ${(size / KB).toFixed(1).padStart(6)} KB  ${page}`);

if (failures.length > 0) {
    console.error("\nOver budget:");
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
}
