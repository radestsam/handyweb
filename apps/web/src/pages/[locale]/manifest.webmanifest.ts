import type { APIRoute, GetStaticPaths } from "astro";
import { DIRECTION, LANGUAGE_TAG, LOCALES, type Locale } from "@handyweb/core";
import { useTranslations } from "../../i18n/site";

/* The web app manifest, one per language, so an installed app opens in that language. */
export const getStaticPaths: GetStaticPaths = () =>
    LOCALES.map((locale) => ({ params: { locale } }));

export const GET: APIRoute = ({ params }) => {
    const locale = params.locale as Locale;
    const t = useTranslations(locale);
    const manifest = {
        id: `/${locale}/`,
        name: t("site.name"),
        short_name: t("site.name"),
        description: t("site.tagline"),
        lang: LANGUAGE_TAG[locale],
        dir: DIRECTION[locale],
        start_url: `/${locale}/`,
        scope: "/",
        display: "standalone",
        background_color: "#f6f7f9",
        theme_color: "#bc4a3c",
        icons: [
            { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
            {
                src: "/icon-maskable-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    };
    return new Response(JSON.stringify(manifest), {
        headers: { "Content-Type": "application/manifest+json" },
    });
};
