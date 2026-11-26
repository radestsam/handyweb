// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// The site is static. The build writes HTML, CSS, JS and assets to dist/ only.
export default defineConfig({
    site: "https://handyweb.ir",
    output: "static",
    trailingSlash: "ignore",
    integrations: [react()],
});
