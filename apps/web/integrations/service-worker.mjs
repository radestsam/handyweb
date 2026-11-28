import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/*
 * An Astro integration that writes dist/sw.js after the build. It precaches
 * the start pages, the CSS, the main fonts, the icons, and the JavaScript
 * that the start pages load. Other files (tool pages and tool code) go into
 * the cache when the user opens them. The version is a hash of the file list,
 * and every file name under _astro/ has a content hash, so a new build gives
 * a new version and the old cache is removed.
 */
export default function serviceWorker() {
    return {
        name: "handyweb:service-worker",
        hooks: {
            "astro:build:done": ({ dir, logger }) => {
                const dist = fileURLToPath(dir);
                const assets = readdirSync(`${dist}_astro`).sort();
                const precache = new Set(["/fa/", "/en/", "/favicon.svg", "/icon-192.png"]);
                for (const page of ["fa/index.html", "en/index.html"]) {
                    const html = readFileSync(`${dist}${page}`, "utf8");
                    for (const match of html.matchAll(
                        /["'](\/_astro\/[^"']+\.(?:js|css|woff2))["']/g,
                    )) {
                        precache.add(match[1]);
                    }
                }
                for (const name of assets) {
                    if (/^(?:estedad-arabic|noto-sans-latin)-wght-normal\..+\.woff2$/.test(name)) {
                        precache.add(`/_astro/${name}`);
                    }
                }
                const list = [...precache].sort();
                const version = createHash("sha256")
                    .update(JSON.stringify([list, assets]))
                    .digest("hex")
                    .slice(0, 16);
                const template = readFileSync(
                    new URL("./service-worker.js", import.meta.url),
                    "utf8",
                );
                writeFileSync(
                    `${dist}sw.js`,
                    template
                        .replace('"__VERSION__"', JSON.stringify(version))
                        .replace("__PRECACHE__", JSON.stringify(list)),
                );
                logger.info(`sw.js ${version}, ${list.length} files to precache`);
            },
        },
    };
}
