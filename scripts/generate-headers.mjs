// Writes the HTTP headers of the site from apps/web/security-headers.json
// (T2.1). Run it after the build:
//
//   node scripts/generate-headers.mjs [dist]
//
// It writes:
//   - <dist>/_headers: the headers file of Cloudflare Pages (and Netlify).
//   - apps/web/dist-headers/nginx-http.conf and nginx-server.conf: the same
//     headers for nginx.
//   - a CSP <meta> tag at the start of the <head> of each page, for a host
//     that cannot send headers. A meta policy cannot hold frame-ancestors, so
//     the tag leaves it out.
//
// The SHA-256 hash of each inline script and <style> element in the build is
// added to script-src and style-src. JSON-LD blocks are data, not scripts, so
// they get no hash.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = process.argv[2] ?? join(ROOT, "apps/web/dist");
const NGINX_DIR = join(ROOT, "apps/web/dist-headers");
const config = JSON.parse(readFileSync(join(ROOT, "apps/web/security-headers.json"), "utf8"));

const META_MARKER = 'http-equiv="Content-Security-Policy"';

const files = (dir) =>
    readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        return statSync(path).isDirectory() ? files(path) : [path];
    });

/** The URL path of a page file: dist/en/tools/hash/index.html is /en/tools/hash/. */
const urlPath = (file) =>
    "/" +
    relative(DIST, file)
        .split(sep)
        .join("/")
        .replace(/index\.html$/, "");

/** The id of the tool on a tool page, from the props of its island. */
function toolIdOf(html) {
    const match = html.match(/props="\{&quot;toolId&quot;:\[0,&quot;([a-z0-9-]+)&quot;\]/);
    return match ? match[1] : null;
}

const sha256 = (text) => `'sha256-${createHash("sha256").update(text).digest("base64")}'`;

/** The hashes of the inline scripts and the inline <style> elements of a page. */
function inlineHashes(html) {
    const script = [];
    for (const match of html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)) {
        const type = match[1].match(/\btype="([^"]+)"/)?.[1];
        if (type && type !== "module" && type !== "text/javascript") continue;
        script.push(sha256(match[2]));
    }
    const style = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => sha256(m[1]));
    return { script, style };
}

/** The policy as a string. */
function serialize(directives, { meta }) {
    return Object.entries(directives)
        .filter(([name]) => !(meta && name === "frame-ancestors"))
        .map(([name, values]) => [name, ...values].join(" "))
        .join("; ");
}

function policyFor(toolId, hashes) {
    const override = toolId ? config.toolOverrides[toolId] : undefined;
    const directives = { ...config.csp, ...override };
    for (const kind of ["script", "style"]) {
        const name = `${kind}-src`;
        if (!directives[name].includes("'unsafe-inline'")) {
            directives[name] = [...directives[name], ...hashes[kind]];
        }
    }
    return directives;
}

const pages = files(DIST)
    .filter((file) => file.endsWith(".html"))
    .map((file) => ({ file, path: urlPath(file), html: readFileSync(file, "utf8") }));

const unique = (kind) =>
    [...new Set(pages.flatMap((page) => inlineHashes(page.html)[kind]))].sort();
const hashes = { script: unique("script"), style: unique("style") };
const base = policyFor(null, hashes);
const overridden = pages.filter((page) => {
    const id = toolIdOf(page.html);
    return id && config.toolOverrides[id];
});

for (const id of Object.keys(config.toolOverrides)) {
    if (id.startsWith("$")) continue;
    if (!overridden.some((page) => toolIdOf(page.html) === id)) {
        throw new Error(`security-headers.json: no page of the tool "${id}" in the build.`);
    }
}

// The CSP meta tag of each page.
for (const page of pages) {
    if (page.html.includes(META_MARKER)) {
        throw new Error(`${page.path} already has a CSP meta tag. Build again first.`);
    }
    const policy = serialize(policyFor(toolIdOf(page.html), hashes), { meta: true });
    const tag = `<meta ${META_MARKER} content="${policy}">`;
    // After <meta charset>, which must be in the first 1024 bytes.
    const html = page.html.replace(/(<head>(?:<meta charset="[^"]+">)?)/, `$1${tag}`);
    if (html === page.html) throw new Error(`${page.path} has no <head>.`);
    writeFileSync(page.file, html);
}

// dist/_headers. A later rule adds its headers to an earlier one, and
// "! Name" removes a header that an earlier rule set.
const lines = ["# Written by scripts/generate-headers.mjs. Do not edit.", "/*"];
for (const [name, value] of Object.entries(config.headers)) lines.push(`  ${name}: ${value}`);
lines.push(`  Content-Security-Policy: ${serialize(base, { meta: false })}`);
for (const [path, value] of Object.entries(config.cache)) {
    lines.push("", path, `  Cache-Control: ${value}`);
}
for (const page of overridden) {
    lines.push(
        "",
        page.path,
        "  ! Content-Security-Policy",
        `  Content-Security-Policy: ${serialize(policyFor(toolIdOf(page.html), hashes), { meta: false })}`,
    );
}
writeFileSync(join(DIST, "_headers"), lines.join("\n") + "\n");

// nginx. The map goes in the http block, the rest in the server block.
const quote = (value) => `"${value.replace(/"/g, '\\"')}"`;
const http = [
    "# Written by scripts/generate-headers.mjs. Include in the http block.",
    "map $uri $handyweb_csp {",
    `    default ${quote(serialize(base, { meta: false }))};`,
    ...overridden.map(
        (page) =>
            `    ${quote(page.path)} ${quote(serialize(policyFor(toolIdOf(page.html), hashes), { meta: false }))};`,
    ),
    "}",
];
const headerLines = (indent) => [
    ...Object.entries(config.headers).map(
        ([name, value]) => `${indent}add_header ${name} ${quote(value)} always;`,
    ),
    `${indent}add_header Content-Security-Policy $handyweb_csp always;`,
];
const server = [
    "# Written by scripts/generate-headers.mjs. Include in the HTTPS server block.",
    "# nginx drops the add_header lines of the server when a location has its own,",
    "# so each location repeats them.",
    ...headerLines(""),
    ...Object.entries(config.cache).flatMap(([path, value]) => [
        path.endsWith("*") ? `location ^~ ${path.slice(0, -1)} {` : `location = ${path} {`,
        ...headerLines("    "),
        `    add_header Cache-Control ${quote(value)} always;`,
        "}",
    ]),
];
mkdirSync(NGINX_DIR, { recursive: true });
writeFileSync(join(NGINX_DIR, "nginx-http.conf"), http.join("\n") + "\n");
writeFileSync(join(NGINX_DIR, "nginx-server.conf"), server.join("\n") + "\n");

console.log(
    `Headers: ${pages.length} pages, ${hashes.script.length} script and ${hashes.style.length} style hashes, ${overridden.length} pages with a tool override.`,
);
