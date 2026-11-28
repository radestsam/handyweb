# HandyWeb

Free, open-source browser tools in Persian and English. Every tool runs on your device. The site has no backend and no accounts.

## Contents

- [HandyWeb](#handyweb)
    - [Contents](#contents)
    - [What You Get](#what-you-get)
    - [Run It on Your Machine](#run-it-on-your-machine)
    - [Make Your First Change](#make-your-first-change)
        - [Browser Tests](#browser-tests)
    - [Commands](#commands)
    - [Project Map](#project-map)
    - [Documentation](#documentation)
    - [Privacy Promise](#privacy-promise)
    - [Get Help or Report a Problem](#get-help-or-report-a-problem)
    - [License](#license)

## What You Get

- More than 100 tools: text, developer, image, PDF, calculators, QR codes, network, encoding, hashing, and Persian text. See the [full list](docs/tools.md).
- Persian (right to left) and English (left to right) on every page.
- A static site. Nothing runs on a server, and tools keep working offline after the first visit.

## Run It on Your Machine

You need [Node](https://nodejs.org) 24.22.2 (Node 26 also works), [Yarn](https://classic.yarnpkg.com) 1.22.22, `make`, and Git.

1. Fork the repository on GitHub, then clone your fork:

    ```bash
    git clone https://github.com/<your-name>/handyweb.git
    cd handyweb
    ```

2. Install Yarn if you do not have it:

    ```bash
    npm install --global yarn@1.22.22
    ```

3. Install the packages and turn on the git hooks:

    ```bash
    make install
    make hooks
    ```

4. Start the development server:

    ```bash
    make dev
    ```

5. Open http://localhost:4321/fa/ for Persian or http://localhost:4321/en/ for English.

The page reloads when you save a file.

## Make Your First Change

1. Create a branch: `git switch -c fix/short-name`.
2. Change the code. Find the right folder in the [project map](#project-map).
3. Check your work:

    ```bash
    make lint
    make test
    make test-e2e
    ```

4. Commit with a short imperative subject, for example `fix: handle empty input in the base64 tool`. No commit body.
5. Push your branch and open a pull request to `main`. Fill in the checklist. CI must pass before a merge.

Read [CONTRIBUTING.md](CONTRIBUTING.md) for the rules every change follows, and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for how we work together.

Want to add a tool? Follow [Add a Tool](docs/tools.md#add-a-tool).

### Browser Tests

`make test-e2e` needs Playwright browsers. Install them once with `npx playwright install`.

If the download is blocked where you live (it returns `403` from Iran), point the tests at a Chromium-based browser you already have. Only the Chromium projects run then. CI runs every browser.

```bash
export PW_CHROMIUM_PATH="/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
make test-e2e
```

## Commands

| Command         | What it does                                                         |
| --------------- | -------------------------------------------------------------------- |
| `make install`  | Installs the packages with the lockfile                              |
| `make hooks`    | Turns on the git hooks in `.githooks/`                               |
| `make dev`      | Starts the development server at http://localhost:4321               |
| `make build`    | Builds the static site into `apps/web/dist/`                         |
| `make preview`  | Builds, then serves `apps/web/dist/`                                 |
| `make test`     | Runs the unit tests (Vitest)                                         |
| `make test-e2e` | Runs the browser tests (Playwright) on the production build          |
| `make lint`     | Runs the format check, ESLint, the CSS and notices checks, and types |
| `make format`   | Formats every file with Prettier                                     |

## Project Map

| Path                               | What it holds                                                            |
| ---------------------------------- | ------------------------------------------------------------------------ |
| [`apps/web`](apps/web)             | The Astro site: routes, layouts, static pages, generated tool pages      |
| [`packages/tools`](packages/tools) | Every tool: metadata, logic, tests, UI, translations                     |
| [`packages/core`](packages/core)   | Types, registry helpers, runtime, workers, file helpers, i18n, shared UI |
| [`tests`](tests)                   | Browser tests: end-to-end, privacy, accessibility                        |
| [`docs`](docs)                     | Technical documents                                                      |
| [`scripts`](scripts)               | Build checks and generators                                              |

Imports go one way: `apps/web` to `packages/tools` to `packages/core`. ESLint stops the other direction.

Each tool lives in `packages/tools/src/<category>/<id>/`. [`base64`](packages/tools/src/encoding/base64) is a complete example.

## Documentation

| Read this                                                | When you want to                                                          |
| -------------------------------------------------------- | ------------------------------------------------------------------------- |
| [CONTRIBUTING.md](CONTRIBUTING.md)                       | Learn the rules and open a pull request                                   |
| [docs/tools.md](docs/tools.md)                           | See every tool and add a new one                                          |
| [docs/architecture.md](docs/architecture.md)             | Understand design, languages, pages, search metadata, search, and offline |
| [docs/ci.md](docs/ci.md)                                 | Understand the CI jobs and the JavaScript size budgets                    |
| [docs/security-headers.md](docs/security-headers.md)     | Change the Content-Security-Policy and headers                            |
| [docs/infrastructure.md](docs/infrastructure.md)         | Learn how the site is built and hosted                                    |
| [docs/offline-operations.md](docs/offline-operations.md) | Follow the outage runbook                                                 |
| [docs/reference-data.md](docs/reference-data.md)         | Find the sources of the data tables                                       |
| [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)         | See every dependency that ships to the browser                            |
| [CHANGELOG.md](CHANGELOG.md)                             | See what changed                                                          |

## Releases and Hosting

The site is live at <https://handyweb.ir/>. GitHub Pages serves it.

A release is a tag `vMAJOR.MINOR.PATCH` on a commit of `main`. The version in `package.json` must match the tag. To make a release:

```bash
git checkout main && git pull
git tag -a v1.0.0 -m "v1.0.0"
git push origin v1.0.0
```

The `Deploy` workflow (`.github/workflows/deploy.yml`) runs the checks, builds the site, attaches the build to a GitHub release, and deploys it. To deploy an older release again (rollback), run the `Deploy` workflow by hand and enter the tag. See [docs/infrastructure.md](docs/infrastructure.md).

## Deviations From the Starter Kit

| Kit rule                                   | What HandyWeb does                                                                                                                                                         | Reason                                                                                                                                      |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Docker image, VPS, deploy key, deploy gate | A static build goes to GitHub Pages. There is no server and no image.                                                                                                      | The site has no backend. The kit stack is Laravel.                                                                                          |
| Response headers set by the server         | GitHub Pages cannot set custom headers. The Content-Security-Policy is a `<meta>` tag in each page. `_headers` and the nginx snippets are built but not used on this host. | `frame-ancestors` and `Permissions-Policy` do not work in a meta tag. Move to a host with header support to enforce them (task T2.2, T2.3). |
| `/` answers with a 301                     | `/` is a page with a meta refresh to `/fa/`.                                                                                                                               | GitHub Pages does not read `_redirects`.                                                                                                    |
| Release deploys to the production server   | The release job attaches the build as `handyweb-vX.Y.Z.tar.gz`. The deploy job uses the `production` environment.                                                          | The same build can go to a second host later.                                                                                               |

## Privacy Promise

- A tool marked `local` never sends its input, its output, or a file name over the network.
- No analytics, trackers, remote fonts, or third-party scripts.
- The only browser storage keys are `handyweb:theme` and `handyweb:locale`. The site stores no user content.
- A strict Content-Security-Policy blocks everything that does not come from the site.

Tests enforce these rules on every published tool. See [Privacy Checks](docs/architecture.md#privacy-checks).

## Get Help or Report a Problem

- Found a bug? Use the "Report a problem on GitHub" link on the tool page, or [open an issue](https://github.com/radestsam/handyweb/issues/new/choose).
- Want a new tool or a better translation? The issue forms cover both.
- Found a security problem? Do not open a public issue. Read [SECURITY.md](SECURITY.md).

## License

Apache License 2.0. See [LICENSE](LICENSE).
