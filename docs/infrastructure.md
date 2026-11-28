# Infrastructure

This document describes the system as the code defines it. Update it in the same pull request as a change to the build, the CI, or the hosting.

## Build

| Part         | Where                                         | What it does                                                                                                                                                                                                                                                                                        |
| ------------ | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Workspaces   | `package.json`                                | Yarn 1 workspaces: `apps/web`, `packages/core`, `packages/tools`                                                                                                                                                                                                                                    |
| Site         | `apps/web`                                    | Astro, static output only. `yarn build` writes `apps/web/dist/`                                                                                                                                                                                                                                     |
| Islands      | `apps/web/src/components/tool/ToolIsland.tsx` | The only React island. The tool UI is rendered into the HTML at build time (`client:load`), and React takes it over when the tool chunk (from `packages/tools/src/loaders.ts`) arrives, so the page does not move. Random values are drawn in the browser only (`useClient` in `@handyweb/core/ui`) |
| Styles       | `apps/web/src/styles/`                        | Tailwind CSS 4, color tokens, self-hosted fonts. No CSS or script is inlined into HTML, except the hashed theme script and the Astro island bootstrap                                                                                                                                               |
| Output check | `scripts/ci/build.sh`                         | Fails when the build writes a server entry point                                                                                                                                                                                                                                                    |

## Routes

| Path                             | Source                                                                                                   |
| -------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `/`                              | `pages/index.astro`: meta refresh to `/fa/`. Hosts that read `public/_redirects` answer with a 301 first |
| `/{fa,en}/` and the static pages | `pages/[locale]/*.astro`                                                                                 |
| `/{fa,en}/tools/`                | Directory of published tools                                                                             |
| `/{fa,en}/tools/<slug>/`         | One page per published tool. Each alias slug is a redirect page with `noindex`                           |
| `/{fa,en}/categories/<slug>/`    | Only categories with a published tool                                                                    |
| `/sitemap.xml`                   | Canonical pages only, with `hreflang` alternates                                                         |

## CI

| Workflow                       | Trigger                                | Jobs                                                                                                                                                                                                         |
| ------------------------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.github/workflows/ci.yml`     | Pull request to `main`, push to `main` | Lint, test and build (`scripts/ci/test.sh`, `audit-js.sh`, `build.sh`); browser tests on Chromium, Firefox, WebKit, and a mobile viewport; shell, workflow (actionlint), and workflow security (zizmor) lint |
| `.github/workflows/deploy.yml` | Push of a tag `vX.Y.Z`, manual run     | Check the tag is on `main` and matches `package.json`; test and build; GitHub release with the build; deploy to GitHub Pages                                                                                 |

Dependabot (`.github/dependabot.yml`) proposes npm and Actions updates weekly, after a 7-day cooldown.

## Hosting

| Part     | Value                                                                                                                                                              |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Host     | GitHub Pages, source "GitHub Actions". No branch is published.                                                                                                     |
| Domain   | `handyweb.ir`. The apex `A` records point to GitHub Pages. The custom domain is set in the repository Pages settings.                                              |
| HTTPS    | GitHub issues the certificate. "Enforce HTTPS" is on.                                                                                                              |
| Release  | Push a tag `vX.Y.Z` on a commit of `main`. `.github/workflows/deploy.yml` checks, builds, creates the GitHub release, and deploys to the `production` environment. |
| Rollback | Run the `Deploy` workflow by hand with an older tag.                                                                                                               |
| Headers  | GitHub Pages sets its own headers. It ignores `dist/_headers` and `dist/_redirects`. The CSP comes from the meta tag in each page.                                 |

The headers come from `apps/web/security-headers.json`. The build writes `dist/_headers` (Cloudflare Pages), nginx snippets in `apps/web/dist-headers/`, and a CSP meta tag in each page. See `security-headers.md`.

Not done yet: a second host in Iran, the reachability test, and a separate origin for the HTML Previewer and Markdown Editor frames. See `TASKS.md`.

## Browser Storage

Only `handyweb:theme` and `handyweb:locale` in `localStorage`. `tests/privacy/tools.spec.ts` fails on any other key, on cookies, on IndexedDB, and on Cache Storage.
