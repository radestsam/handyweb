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
                    // The PDF libraries go into named chunks. Only PDF tools load
                    // them, and scripts/check-budget.mjs gives them their own budgets.
                    manualChunks(id) {
                        if (
                            /[\\/]node_modules[\\/](@cantoo[\\/]pdf-lib|fflate|culori|node-html-better-parser|html-entities)[\\/]/.test(
                                id,
                            )
                        )
                            return "pdf-lib";
                        // pdf.js (the PDF renderer). Its worker is a separate file.
                        if (/[\\/]node_modules[\\/]pdfjs-dist[\\/]/.test(id)) return "pdfjs";
                        return undefined;
                    },
                },
            },
        },
    },
});
