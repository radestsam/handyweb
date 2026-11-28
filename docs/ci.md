# Continuous Integration

The CI workflow and the size budgets of the site.

`.github/workflows/ci.yml` runs on every push to `main` and on every pull request to `main`. It has three jobs:

- **Lint, Test & Build:** the format check, ESLint, the type check, the unit tests, a package audit, and the static build, with the JavaScript budget check (`scripts/check-budget.mjs`).

The budget check allows 15 KB of start JavaScript on a page without a tool, 90 KB on a tool page, and 60 KB for each tool chunk (gzip). The PDF library chunk (`pdf-lib.*.js`) has its own budget of 260 KB. No PDF writer fits in 60 KB (`@cantoo/pdf-lib` is about 250 KB). The chunk loads only when a PDF tool opens a file, and the service worker caches it after the first use. The owner approved this budget on 2026-11-27.

pdf.js (`pdfjs-dist`), the PDF renderer, has two budgets of its own: 150 KB for its main chunk (`pdfjs.*.js`) and 400 KB for its worker (`pdf.worker-*.js`). They are about 130 KB and 360 KB. Both load only when a PDF tool that renders pages opens a file. The owner approved these budgets on 2026-11-28.

The password strength worker (`zxcvbn.worker-*.js`) has a budget of 870 KB. It holds zxcvbn-ts with all of its common and English dictionaries, about 860 KB. The smaller choice, without the English words and names, was about 250 KB. The owner chose the full set on 2026-11-28 for better detection. The worker loads only on the password strength page.

- **Browser Tests:** Playwright in Chromium, Firefox, and WebKit, on desktop and mobile viewports.
- **Lint Scripts & Workflows:** shellcheck and shfmt on `scripts/`, actionlint and zizmor on the workflows.

Dependabot proposes weekly updates for npm packages and GitHub Actions.
