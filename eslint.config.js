// ESLint is a deviation from the starter kit. It enforces the package
// boundaries (apps/web to packages/tools to packages/core) and the React hooks
// rules. Formatting belongs to Prettier only.
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import reactHooks from "eslint-plugin-react-hooks";

/** @param {string[]} names */
const forbid = (names) => ({
    "no-restricted-imports": [
        "error",
        {
            patterns: names.map((name) => ({
                group: [name, `${name}/*`],
                message: "This import breaks the package dependency direction.",
            })),
        },
    ],
});

export default tseslint.config(
    {
        ignores: ["**/dist/**", "**/.astro/**", "**/node_modules/**", "**/coverage/**"],
    },
    ...tseslint.configs.recommended,
    ...astro.configs.recommended,
    {
        files: ["**/*.{ts,tsx}"],
        plugins: { "react-hooks": reactHooks },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "@typescript-eslint/consistent-type-imports": "error",
        },
    },
    {
        files: ["packages/core/**"],
        rules: forbid(["@handyweb/tools", "@handyweb/web"]),
    },
    {
        files: ["packages/tools/**"],
        rules: forbid(["@handyweb/web"]),
    },
);
