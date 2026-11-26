# Contributing to HandyWeb

Thank you for helping. This guide tells you how to set up the project, add a tool, and open a pull request.

## Set Up

1. Install Node 24.22.2 (see `.nvmrc`) and Yarn 1.22.22: `npm install --global yarn@1.22.22`.
2. Clone the repository and run:

    ```bash
    make install
    make hooks
    make dev
    ```

3. Open http://localhost:4321/fa/.

## Rules That Every Change Follows

- A tool marked `local` must not send its input, its output, or a file name over the network. The privacy tests check this.
- Do not add analytics, trackers, remote fonts, or third-party scripts.
- Every user-visible string has a Persian and an English version.
- Use logical CSS (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`). `make lint` stops `ml-*`, `mr-*`, `left-*`, `right-*`, `text-left`, and `text-right`.
- Show code, hashes, URLs, and file names with the `Ltr` component, so they stay left to right on Persian pages.
- Use `crypto.getRandomValues` or Web Crypto for anything secret. Never use `Math.random()` for it.
- Do not write your own cryptographic algorithm.

## Add a Tool

1. Create `packages/tools/src/<category>/<id>/` with these files:

    | File            | What it holds                                                                                                                                     |
    | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
    | `meta.ts`       | The `ToolDefinition`: id, slug, aliases, category, Persian and English title, description, keywords, privacy mode, limits, and an `example` input |
    | `logic.ts`      | The pure functions of the tool. No DOM, no React                                                                                                  |
    | `logic.test.ts` | Unit tests: empty, typical, invalid, boundary, and Persian or Unicode input                                                                       |
    | `i18n.ts`       | The strings of the tool UI in Persian and English                                                                                                 |
    | `ui.tsx`        | The React UI. The default export receives `ToolUiProps`. Mark the main input with `data-tool-input` and the main output with `data-tool-output`   |

2. Add the metadata to `packages/tools/src/catalog.ts` and the loader to `packages/tools/src/loaders.ts`.
3. Run the checks:

    ```bash
    make lint
    make test
    make test-e2e
    ```

    The registry test, the privacy tests (no request leaves the browser, nothing is stored), and the accessibility tests run on every tool automatically.

4. If the tool adds a package that ships to visitors, add it to `THIRD_PARTY_NOTICES.md` with its license.

## Pull Requests

- Work on a short branch and open a pull request to `main`. CI must pass before a merge.
- Commit messages: a short imperative subject in the Conventional Commits style, for example `feat: add the JSON formatter`. No body.
- Fill in the pull request checklist.

## Translations

Persian and English strings live next to the code: `apps/web/src/i18n/site.ts` for the site, and `i18n.ts` in each tool folder. A missing key in one language fails the type check.

## Security Problems

Do not open a public issue. See `SECURITY.md`.
