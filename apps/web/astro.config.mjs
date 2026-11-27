// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import serviceWorker from "./integrations/service-worker.mjs";

// The site is static. The build writes HTML, CSS, JS and assets to dist/ only.
export default defineConfig({
    site: "https://handyweb.ir",
    output: "static",
    trailingSlash: "always",
    integrations: [react(), serviceWorker()],
    build: {
        // Never inline CSS into the HTML. The CSP allows styles from 'self' only.
        inlineStylesheets: "never",
    },
    vite: {
        plugins: [tailwindcss()],
        build: {
            // Never inline a script or an asset as a data: URI or an inline
            // <script>. The CSP allows scripts from 'self' only, plus the one
            // hashed theme script.
            assetsInlineLimit: 0,
            rollupOptions: {
                output: {
                    // The PDF library and the packages that only it uses go into
                    // one named chunk. Only PDF tools load it, and
                    // scripts/check-budget.mjs gives it its own budget.
                    manualChunks(id) {
                        if (
                            /[\\/]node_modules[\\/](@cantoo[\\/]pdf-lib|fflate|culori|node-html-better-parser|html-entities)[\\/]/.test(
                                id,
                            )
                        )
                            return "pdf-lib";
                        return undefined;
                    },
                },
            },
        },
    },
});
