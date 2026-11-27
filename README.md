# HandyWeb

HandyWeb is a free, open-source collection of browser tools for Persian and English users. Every tool runs on your device. The site has no backend, no accounts, and no analytics.

Live site: https://handyweb.ir (not deployed yet)

## Requirements

- Node 24.22.2 (see `.nvmrc`). Node 26 also works for local development.
- Yarn 1.22.22: `npm install --global yarn@1.22.22`

## Setup

```bash
make install
make hooks
make dev
```

## Commands

| Command         | What it does                                                                          |
| --------------- | ------------------------------------------------------------------------------------- |
| `make install`  | Installs the packages with the lockfile                                               |
| `make hooks`    | Turns on the git hooks in `.githooks/`                                                |
| `make dev`      | Starts the development server at http://localhost:4321                                |
| `make build`    | Builds the static site into `apps/web/dist/`                                          |
| `make preview`  | Builds, then serves `apps/web/dist/`                                                  |
| `make test`     | Runs the unit tests (Vitest)                                                          |
| `make test-e2e` | Runs the browser tests (Playwright) on the production build                           |
| `make lint`     | Runs the format check, ESLint, the logical CSS and notices checks, and the type check |
| `make format`   | Formats every file with Prettier                                                      |

### Browser Tests in Iran

The Playwright browser download (`npx playwright install`) returns `403` from Iran. Point the tests at a local Chromium-based browser instead. Only the Chromium projects then run. CI runs every browser.

```bash
export PW_CHROMIUM_PATH="/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
make test-e2e
```

## Repository Layout

| Path             | What it holds                                                                         |
| ---------------- | ------------------------------------------------------------------------------------- |
| `apps/web`       | The Astro site: routes, layouts, static pages, generated tool pages                   |
| `packages/core`  | Types, registry helpers, runtime, worker protocol, file helpers, i18n, shared tool UI |
| `packages/tools` | Every tool: metadata, logic, tests, UI, translations                                  |
| `tests/`         | Browser tests: end-to-end, privacy, accessibility                                     |

The dependency direction is `apps/web` to `packages/tools` to `packages/core`. ESLint stops an import in the other direction.

## Continuous Integration

`.github/workflows/ci.yml` runs on every push to `main` and on every pull request to `main`. It has three jobs:

- **Lint, Test & Build:** the format check, ESLint, the type check, the unit tests, a package audit, and the static build, with the JavaScript budget check (`scripts/check-budget.mjs`).
- **Browser Tests:** Playwright in Chromium, Firefox, and WebKit, on desktop and mobile viewports.
- **Lint Scripts & Workflows:** shellcheck and shfmt on `scripts/`, actionlint and zizmor on the workflows.

Dependabot proposes weekly updates for npm packages and GitHub Actions.

## Design

- Color tokens are in `apps/web/src/styles/tokens.css`. `tokens.test.ts` checks the contrast of every text and background pair in both themes.
- The fonts (Noto Sans and Estedad) are self-hosted. The site loads nothing from another origin.
- The theme follows the system until the visitor picks one. The choice is stored in `handyweb:theme`.
- Layout CSS uses logical properties only (`ms-*`, `me-*`, `start`, `end`). `scripts/check-logical-css.mjs` stops physical ones.
- On phones, a bottom tab bar replaces the header links.

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

## Tools

| Tool                                                  | Category                 | Source                                               | Libraries                                                  |
| ----------------------------------------------------- | ------------------------ | ---------------------------------------------------- | ---------------------------------------------------------- |
| Base64 Encoder and Decoder                            | Encoding                 | `packages/tools/src/encoding/base64`                 | None                                                       |
| JSON Formatter and Validator                          | Developer                | `packages/tools/src/developer/json-formatter`        | None                                                       |
| XML Formatter and Validator                           | Developer                | `packages/tools/src/developer/xml-formatter`         | None                                                       |
| YAML Formatter and Validator                          | Developer                | `packages/tools/src/developer/yaml-formatter`        | `yaml`                                                     |
| JSON and YAML Converter                               | Developer                | `packages/tools/src/developer/json-yaml`             | `yaml`                                                     |
| SQL Formatter                                         | Developer                | `packages/tools/src/developer/sql-formatter`         | `sql-formatter`                                            |
| HTML Formatter                                        | Developer                | `packages/tools/src/developer/html-formatter`        | `js-beautify`                                              |
| CSS Formatter                                         | Developer                | `packages/tools/src/developer/css-formatter`         | `js-beautify`                                              |
| JavaScript Formatter                                  | Developer                | `packages/tools/src/developer/js-formatter`          | `js-beautify`                                              |
| JSON and CSV Converter                                | Developer                | `packages/tools/src/developer/json-csv`              | None                                                       |
| JSON Diff                                             | Developer                | `packages/tools/src/developer/json-diff`             | None                                                       |
| JSON Schema Validator                                 | Developer                | `packages/tools/src/developer/json-schema-validator` | `@cfworker/json-schema`                                    |
| Color Converter                                       | Developer                | `packages/tools/src/developer/color-converter`       | None                                                       |
| URL Parser and Inspector                              | Developer                | `packages/tools/src/developer/url-parser`            | None                                                       |
| Cron Expression Parser                                | Developer                | `packages/tools/src/developer/cron-parser`           | None                                                       |
| HTTP Header Parser                                    | Developer                | `packages/tools/src/developer/http-header-parser`    | None                                                       |
| User-Agent Parser                                     | Developer                | `packages/tools/src/developer/user-agent-parser`     | None                                                       |
| JWT Decoder                                           | Developer                | `packages/tools/src/developer/jwt-decoder`           | None                                                       |
| UUID and ULID Generator                               | Developer                | `packages/tools/src/developer/uuid-generator`        | None                                                       |
| Regex Tester                                          | Developer                | `packages/tools/src/developer/regex-tester`          | None                                                       |
| Unix Timestamp Converter                              | Developer                | `packages/tools/src/developer/unix-timestamp`        | `jalaali-js` (Jalali dates)                                |
| Number Base Converter                                 | Developer                | `packages/tools/src/developer/number-base`           | None                                                       |
| QR Code Generator                                     | QR Codes and Barcodes    | `packages/tools/src/qr/qr-generator`                 | `uqr` (QR encoding)                                        |
| SHA-256 and SHA-512 Hash Generator for Text and Files | Hashing and Cryptography | `packages/tools/src/crypto/hash`                     | `hash-wasm` (file hashing)                                 |
| HMAC Generator and Verifier                           | Hashing and Cryptography | `packages/tools/src/crypto/hmac`                     | None                                                       |
| Password and Passphrase Generator                     | Hashing and Cryptography | `packages/tools/src/crypto/password-generator`       | None (EFF large wordlist, generated)                       |
| Random Token and Bytes Generator                      | Hashing and Cryptography | `packages/tools/src/crypto/random-token`             | None                                                       |
| Persian Text Normalizer and Digit Converter           | Persian                  | `packages/tools/src/persian/persian-normalizer`      | `diff` (change view)                                       |
| Jalali and Gregorian Date Converter                   | Persian                  | `packages/tools/src/persian/jalali-converter`        | `jalaali-js`                                               |
| Number to Persian Words                               | Persian                  | `packages/tools/src/persian/number-to-words`         | None                                                       |
| Persian Half-Space (ZWNJ) Fixer                       | Persian                  | `packages/tools/src/persian/zwnj-fixer`              | `diff` (change view)                                       |
| Persian Punctuation Fixer                             | Persian                  | `packages/tools/src/persian/punctuation-fixer`       | `diff` (change view)                                       |
| Persian Text Direction Fixer                          | Persian                  | `packages/tools/src/persian/direction-fixer`         | None                                                       |
| Word and Character Counter                            | Text                     | `packages/tools/src/text/text-counter`               | None                                                       |
| Case Converter                                        | Text                     | `packages/tools/src/text/case-converter`             | None                                                       |
| Remove Duplicate Lines                                | Text                     | `packages/tools/src/text/remove-duplicate-lines`     | None                                                       |
| Sort Lines Alphabetically                             | Text                     | `packages/tools/src/text/sort-lines`                 | None                                                       |
| Text Cleaner                                          | Text                     | `packages/tools/src/text/text-cleaner`               | None                                                       |
| URL Encoder and Decoder                               | Encoding                 | `packages/tools/src/encoding/url-encoding`           | None                                                       |
| HTML Entity Encoder and Decoder                       | Encoding                 | `packages/tools/src/encoding/html-entities`          | None                                                       |
| Unicode Escape and Unescape                           | Encoding                 | `packages/tools/src/encoding/unicode-escape`         | None                                                       |
| Unicode Character Inspector                           | Text                     | `packages/tools/src/text/unicode-explorer`           | None (names generated from the Unicode Character Database) |
| Text Diff Checker                                     | Text                     | `packages/tools/src/text/text-diff`                  | `diff` (comparison and patch)                              |
| Reverse Text                                          | Text                     | `packages/tools/src/text/reverse-text`               | None                                                       |
| Text Repeater                                         | Text                     | `packages/tools/src/text/text-repeater`              | None                                                       |
| Text Splitter and Joiner                              | Text                     | `packages/tools/src/text/split-join`                 | None                                                       |
| Find and Replace                                      | Text                     | `packages/tools/src/text/find-replace`               | None                                                       |
| Slug Generator                                        | Text                     | `packages/tools/src/text/slug-generator`             | None                                                       |
| Lorem Ipsum Generator                                 | Text                     | `packages/tools/src/text/lorem-ipsum`                | None                                                       |
| Email, URL, and Phone Extractor                       | Text                     | `packages/tools/src/text/text-extractor`             | None                                                       |
| JSON String Escaper and Unescaper                     | Developer                | `packages/tools/src/developer/json-string`           | None                                                       |

### Add a Tool

1. Create `packages/tools/src/<category>/<id>/` with `meta.ts`, `logic.ts`, `logic.test.ts`, `ui.tsx`, and `i18n.ts`.
2. Add the metadata to `packages/tools/src/catalog.ts` and the loader to `packages/tools/src/loaders.ts`. `catalog.ts` imports only `meta.ts` files.
3. Run heavy work through the runtime in `packages/core/src/runtime`, or in a worker with `packages/core/src/worker`.
4. Build the UI from the shared components in `packages/core/src/ui`. Every string has a Persian and an English version.
5. Give the tool an `example` input in `meta.ts`. The privacy tests run every published tool with it.
6. Run `make test` and `make test-e2e`. `packages/tools/src/registry.test.ts` checks the catalog, the categories, and the loaders.

### Tool Pages

Each published tool gets a page per language at `/<locale>/tools/<slug>/`. An alias slug is a redirect page to the canonical one, and the sitemap leaves it out. `?preset=<id>` opens a tool with the options of one of its presets. The tool code loads on demand, so a page never loads the code of another tool.

### Source Links

Each tool page links to the source folder of the tool at the release tag `v<version>`. `<version>` is the `version` field of the root `package.json`. The link is set in `apps/web/src/release.ts`. Tag each release `v<version>` on the commit that is deployed, so every link opens the code that the site runs.

## Privacy

- A tool marked `local` never sends its input, its output, or a file name over the network.
- The site has no analytics, trackers, remote fonts, or third-party scripts.
- The only browser storage keys are `handyweb:theme` and `handyweb:locale`. The site stores no user content.

`tests/privacy/tools.spec.ts` opens every published tool in both languages and runs it with its example input. It fails on a request to another origin, on a request that contains the input or the result, and on any other stored data.

## Search

Press `/` or `Ctrl+K` (`Cmd+K` on a Mac) to search the tools. The index (`/search-index.json`) is built from the catalog at build time. A query matches tool names, aliases, keywords, and descriptions in both languages. Arabic letters (ي, ك) and Persian or Arabic-Indic digits match their Persian and Latin forms. The search runs in the browser and sends no query anywhere.

## Contributing

Read `CONTRIBUTING.md` before you open a pull request, and follow `CODE_OF_CONDUCT.md`. Report a security problem privately, as `SECURITY.md` describes. `CHANGELOG.md` lists the changes. `docs/infrastructure.md` describes the build and the hosting, and `docs/offline-operations.md` is the outage runbook. `THIRD_PARTY_NOTICES.md` lists every dependency that ships to the browser. `make lint` checks that it is complete.

## Deviations From the Starter Kit

This product follows `radestsam/ai-starter-kit`. The differences are below. Recorded on 2026-11-26.

| Kit rule                                                                                    | HandyWeb                                                                                                                                                     | Reason                                                                                           |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| 1 to 5, 9, 10: Docker Compose on one Ubuntu server, one image, state volumes, reverse proxy | No server and no container. The static `dist/` folder is served by managed static hosts.                                                                     | The product has no backend and no state. A server adds cost and operations work with no benefit. |
| 6 to 8: images pinned by digest, CI builds the image, `sha-` tags                           | CI builds `dist/` and attaches it to the run and to the GitHub release. The release tag names the commit.                                                    | There is no image. The build output takes the same role.                                         |
| 13: blue-green deploy                                                                       | Atomic deploys of the static host. A rollback redeploys an older tag.                                                                                        | A static host switches the whole site at once.                                                   |
| 14: backward-compatible migrations; 19: backups                                             | Not applicable.                                                                                                                                              | No database and no user data.                                                                    |
| 15: deploy key with a forced command                                                        | Host API tokens with the smallest scope that can deploy one project.                                                                                         | There is no SSH server.                                                                          |
| 16: works in Iran during an outage                                                          | The Iranian static host serves the site during an outage. The offline deploy is a manual upload of a locally built `dist/`. The host renews the certificate. | There is no server to connect to over SSH.                                                       |
| 17, 18: health checks, watcher every 5 minutes                                              | A scheduled CI job requests the site from each host and opens an issue on failure. Optional until launch.                                                    | There are no containers to check.                                                                |
| Formatting: no JavaScript linter by default                                                 | ESLint for the package boundaries and the React hooks rules.                                                                                                 | The package boundaries need an automated check.                                                  |
| Node 24.22.2 everywhere                                                                     | CI uses Node 24.22.2. `engines` allows `>=24.22.2 <27`, so local development also works on Node 26.                                                          | Yarn 1 stops on an `engines` mismatch, and Node 26 ships no Corepack.                            |

## License

Apache License 2.0. See `LICENSE`.
