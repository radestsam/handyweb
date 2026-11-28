# Architecture

How the site is built: design, languages, pages, tool pages, search, privacy checks, and offline use.

## Design

- Color tokens are in `apps/web/src/styles/tokens.css`. `tokens.test.ts` checks the contrast of every text and background pair in both themes.
- The fonts (Noto Sans and Estedad) are self-hosted. The site loads nothing from another origin.
- Until the fonts load, the text uses system fonts (Arial, Helvetica, or Roboto for Latin; Tahoma, Geeza Pro, or Noto Naskh Arabic for Persian) with `size-adjust` and metric overrides, so the font swap moves almost nothing. `tests/e2e/fonts.spec.ts` measures the layout shift. It skips on a machine without these fonts.
- The theme follows the system until the visitor picks one. The choice is stored in `handyweb:theme`.
- Layout CSS uses logical properties only (`ms-*`, `me-*`, `start`, `end`). `scripts/check-logical-css.mjs` stops physical ones.
- Every page has the tool sidebar (`apps/web/src/components/Sidebar.astro`). It lists all tools by category and highlights the open tool. Each name is one line, cut with an ellipsis when it is too long, so the list does not move when the web font loads. On wide screens (64rem and up) it is a column at the inline start of the page, with the logo at the top and the footer at the bottom: the on-device promise, the site links, the credit, and the release tag of the build, which links to its GitHub release. Beside it, above the content, a header band holds the breadcrumbs, the language link, and the theme button.
- On narrower screens the header band also has the logo and the menu button, and the breadcrumbs move to a second row. The sidebar is a drawer with the tool list and the footer. The menu button in the header or the Tools tab opens it. Esc, the close button, or a tap outside closes it. On phones, a bottom tab bar has Home and Tools.
- The filter field at the top of the sidebar narrows the list as you type. It runs on the device and sends or stores nothing. Enter opens the first match. See [Search](#search).
- The home page shows a short list of popular tools and links to all tools. The site has no analytics, so the list is chosen by hand: `FEATURED` in `apps/web/src/i18n/tools.ts`. The build fails if an id in it is not a published tool.

## Languages

Persian (`fa`, right to left) is the default language. English (`en`, left to right) is the second. Site strings are in `apps/web/src/i18n/site.ts`, with a typed `t(key)`. Show code, hashes, URLs, and file names with the `Ltr` component, so they stay left to right on Persian pages.

Every page has a Persian and an English URL: `/fa/...` and `/en/...`. `/` goes to `/fa/` (`apps/web/public/_redirects` on the host, and a meta refresh in the page). Each page lists its other-language version with `hreflang`. The language switcher stores the last choice in `handyweb:locale`. It never redirects a visitor.

## Pages

| Path                           | Page                                                                 |
| ------------------------------ | -------------------------------------------------------------------- |
| `/<locale>/`                   | Home: the published tools by category                                |
| `/<locale>/tools/`             | All tools                                                            |
| `/<locale>/categories/<slug>/` | One category (only categories with a published tool)                 |
| `/<locale>/tools/<slug>/`      | One tool                                                             |
| `/<locale>/about/`             | About the project                                                    |
| `/<locale>/privacy/`           | What the site stores and sends (nothing but the two preference keys) |
| `/<locale>/opensource/`        | License and dependencies                                             |
| `/<locale>/contribute/`        | How to help                                                          |

`/sitemap.xml` lists every canonical page in both languages.

### Search Metadata

- Each page has a canonical URL, `hreflang` links for both languages (`x-default` is Persian), Open Graph and Twitter tags, and a share image per language (`apps/web/public/og/handyweb-<locale>.png`, 1200 × 630).
- A tool page title is `seoTitle` from `meta.ts` plus ` | HandyWeb`. `seoTitle` starts with `title` (the h1) and has 49 characters or fewer, so the page title has 60 or fewer. A category has a `seoTitle` with the same rules in `packages/tools/src/categories.ts`. `validateRegistry` checks both.
- Structured data: `WebSite` and `Organization` on the home page; `CollectionPage` with an `ItemList` on the tools page and each category page; `BreadcrumbList` on category and tool pages; `WebApplication`, `BreadcrumbList`, and `FAQPage` (when the tool has questions) on a tool page. The builders are in `apps/web/src/seo.ts`.
- `tests/e2e/seo.spec.ts` checks every page in the sitemap for these rules.

## Tool Pages

Each published tool gets a page per language at `/<locale>/tools/<slug>/`. An alias slug is a redirect page to the canonical one, and the sitemap leaves it out. `?preset=<id>` opens a tool with the options of one of its presets. The tool code loads on demand, so a page never loads the code of another tool.

## Source Links

Each tool page links to the source folder of the tool at the release tag `v<version>`. `<version>` is the `version` field of the root `package.json`. The link is set in `apps/web/src/release.ts`. Tag each release `v<version>` on the commit that is deployed, so every link opens the code that the site runs.

## Problem Reports

Each tool page has a "Report a problem on GitHub" link. It opens the bug form (`.github/ISSUE_TEMPLATE/bug.yml`) with these fields filled in: the title prefix `[<tool id>]`, the page URL, the tool name with its id and privacy mode, and the release tag. The link holds only static facts about the tool. It never holds the input or the output of the tool. `toolIssueUrl` in `apps/web/src/release.ts` makes the link. Each query key is the id of a field in the bug form, so rename both together.

## Links to Other Products

A tool can name one other product of the same creator in `externalLink` in `meta.ts` (`href`, `label`, and a Persian and an English `text`). The tool page shows it as one line under the tool. It is a plain link: the page loads nothing from it. The QR Code Generator and the QR Code and Barcode Reader link to [pvnd.io](https://pvnd.io) for dynamic QR codes with scan statistics.

## Privacy Text

The site says once, in the footer, that the tools run on the device and that input is not stored or sent, and the privacy page explains it in full. Tool descriptions, FAQs, tool notes, and other pages do not repeat it. The privacy badge on a tool page says only where the tool runs.

## Search

The filter field at the top of the tool sidebar is the site search. Press `/` or `Ctrl+K` (`Cmd+K` on a Mac) to go to it from any page. It matches tool names, aliases, and keywords in both languages. Arabic letters (ي, ك) and Persian or Arabic-Indic digits match their Persian and Latin forms. The build writes the search terms into the page, so the filter loads nothing and sends no query anywhere.

## Privacy Checks

- A tool marked `local` never sends its input, its output, or a file name over the network.
- The site has no analytics, trackers, remote fonts, or third-party scripts.
- The only browser storage keys are `handyweb:theme` and `handyweb:locale`. The site stores no user content.
- A Content-Security-Policy blocks every script, style, font, and request that does not come from the site. The build writes it as headers for the host and as a meta tag in each page, from `apps/web/security-headers.json`. See [security-headers.md](security-headers.md).

`tests/privacy/tools.spec.ts` opens every published tool in both languages and runs it with its example input. It fails on a request to another origin, on a request that contains the input or the result, and on any other stored data. The one exception is the static file cache of the service worker (see "Offline Use"): it may hold only files of the site, with no query string and no tool input or output in the URL.

## Offline Use

The site is a Progressive Web App. Each language has a manifest (`/fa/manifest.webmanifest` and `/en/manifest.webmanifest`), so a phone or a desktop browser can install it.

The production build also writes a service worker to `dist/sw.js` (`apps/web/integrations/service-worker.mjs`). It works as follows:

- When it installs, it saves the start pages, the CSS, the main fonts, the icons, and the scripts of the start pages.
- It saves each page and each tool file when you open it. A tool that you opened once works without a network.
- It saves only GET requests to the site itself. It never saves a request with a query string.
- Pages come from the network first, so a new build shows at once. Without a network, the cached copy shows. A page that you never opened shows the start page of its language.
- Hashed files under `/_astro/` come from the cache first, because they never change.
- A new build gets a new cache name, and the worker removes the old cache.

The development server does not register the worker. `tests/e2e/offline.spec.ts` checks that a tool works offline after one visit (Chromium only).
