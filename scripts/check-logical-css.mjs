// Fails when a component uses a physical direction utility or property.
// HandyWeb is RTL in Persian and LTR in English, so layout must use logical
// properties: ms-/me-/ps-/pe-, start-/end-, text-start/text-end.
//
//   node scripts/check-logical-css.mjs
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOTS = ["apps/web/src", "packages/core/src", "packages/tools/src"];
const EXTENSIONS = /\.(astro|tsx|ts|css)$/;

// Tailwind utilities, matched as whole class tokens.
const UTILITY =
    /(?<![\w-])-?(?:ml|mr|pl|pr|left|right|border-l|border-r|rounded-l|rounded-r|rounded-tl|rounded-tr|rounded-bl|rounded-br|scroll-ml|scroll-mr|scroll-pl|scroll-pr)-[\w./[\]-]+|(?<![\w-])(?:text-left|text-right|float-left|float-right|clear-left|clear-right|border-l|border-r)(?![\w-])/g;
// Plain CSS properties.
const PROPERTY =
    /(?<![\w-])(?:margin-left|margin-right|padding-left|padding-right|border-left|border-right|text-align:\s*(?:left|right)|float:\s*(?:left|right))\b|(?<![\w-])(?:left|right)\s*:/g;

function* files(dir) {
    for (const name of readdirSync(dir)) {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) yield* files(path);
        else if (EXTENSIONS.test(name) && !name.endsWith(".test.ts")) yield path;
    }
}

let failed = 0;
for (const root of ROOTS) {
    for (const file of files(root)) {
        const lines = readFileSync(file, "utf8").split("\n");
        lines.forEach((line, index) => {
            if (line.includes("logical-css-ignore")) return;
            const pattern = file.endsWith(".css") ? PROPERTY : UTILITY;
            for (const match of line.matchAll(pattern)) {
                console.error(
                    `${relative(".", file)}:${index + 1}: physical direction "${match[0]}"`,
                );
                failed++;
            }
        });
    }
}

if (failed) {
    console.error(`\n${failed} physical direction use(s). Use logical properties instead.`);
    process.exit(1);
}
