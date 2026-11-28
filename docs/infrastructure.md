# Infrastructure

This document describes the system as the code defines it. Update it in the same pull request as a change to the build, the CI, or the hosting.

## Build

| Part         | Where                                         | What it does                                                                                                                                          |
| ------------ | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Workspaces   | `package.json`                                | Yarn 1 workspaces: `apps/web`, `packages/core`, `packages/tools`                                                                                      |
| Site         | `apps/web`                                    | Astro, static output only. `yarn build` writes `apps/web/dist/`                                                                                       |
| Islands      | `apps/web/src/components/tool/ToolIsland.tsx` | The only React island. Rendered on the client only. Loads one tool chunk through `packages/tools/src/loaders.ts`                                      |
| Styles       | `apps/web/src/styles/`                        | Tailwind CSS 4, color tokens, self-hosted fonts. No CSS or script is inlined into HTML, except the hashed theme script and the Astro island bootstrap |
| Output check | `scripts/ci/build.sh`                         | Fails when the build writes a server entry point                                                                                                      |

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

| Workflow                   | Trigger                                | Jobs                                                                                                                                                                                                         |
| -------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.github/workflows/ci.yml` | Pull request to `main`, push to `main` | Lint, test and build (`scripts/ci/test.sh`, `audit-js.sh`, `build.sh`); browser tests on Chromium, Firefox, WebKit, and a mobile viewport; shell, workflow (actionlint), and workflow security (zizmor) lint |

Dependabot (`.github/dependabot.yml`) proposes npm and Actions updates weekly, after a 7-day cooldown.

## Hosting

Not deployed yet. The launch gate (T2.1 to T2.4) adds the hosts, DNS, and security headers here.

The headers must allow the service worker and the manifest: `worker-src 'self'` and `manifest-src 'self'` in the Content-Security-Policy. Serve `/sw.js` with `Cache-Control: no-cache`, so that browsers find a new build quickly.

## Browser Storage

Only `handyweb:theme` and `handyweb:locale` in `localStorage`. `tests/privacy/tools.spec.ts` fails on any other key, on cookies, on IndexedDB, and on Cache Storage.
