// Fails when a package that ships to visitors is missing from
// THIRD_PARTY_NOTICES.md. A shipped package is a "dependencies" entry of a
// workspace package that is not itself a workspace package.
//
//   node scripts/check-notices.mjs
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const notices = readFileSync("THIRD_PARTY_NOTICES.md", "utf8");
const manifests = ["apps", "packages"].flatMap((dir) =>
    readdirSync(dir)
        .map((name) => join(dir, name, "package.json"))
        .filter((path) => existsSync(path)),
);

const workspaces = new Set(manifests.map((path) => JSON.parse(readFileSync(path, "utf8")).name));
const missing = new Set();

for (const path of manifests) {
    const manifest = JSON.parse(readFileSync(path, "utf8"));
    for (const name of Object.keys(manifest.dependencies ?? {})) {
        if (workspaces.has(name)) continue;
        if (
            !notices.includes(`\`${name}\``) &&
            !notices.includes(`| ${name} `) &&
            !notices.includes(`${name},`)
        ) {
            missing.add(`${name} (${path})`);
        }
    }
}

if (missing.size > 0) {
    console.error("These shipped packages are missing from THIRD_PARTY_NOTICES.md:");
    for (const entry of missing) console.error(`  - ${entry}`);
    process.exit(1);
}
