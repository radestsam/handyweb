# Third-Party Notices

HandyWeb is licensed under the Apache License 2.0 (see `LICENSE`). It ships the third-party components below. Each one keeps its own license.

## Fonts

| Component | Version                                | License                   | Source                                            | Shipped files                           |
| --------- | -------------------------------------- | ------------------------- | ------------------------------------------------- | --------------------------------------- |
| Noto Sans | `@fontsource-variable/noto-sans` 5.3.0 | SIL Open Font License 1.1 | https://github.com/notofonts/latin-greek-cyrillic | Latin and Latin Extended variable WOFF2 |
| Estedad   | `@fontsource-variable/estedad` 5.3.0   | SIL Open Font License 1.1 | https://github.com/aminabedi68/Estedad            | Arabic-script variable WOFF2            |

The full license text of each font is in its package: `node_modules/@fontsource-variable/<name>/LICENSE`.

## npm Packages

`scripts/check-notices.mjs` fails the build when a package in a `dependencies` field is missing here.

| Package                          | License                           | Ships to visitors                              |
| -------------------------------- | --------------------------------- | ---------------------------------------------- |
| `astro`                          | MIT                               | Yes: the island runtime                        |
| `@astrojs/react`                 | MIT                               | Yes: the React renderer of islands             |
| `react`                          | MIT                               | Yes                                            |
| `react-dom`                      | MIT                               | Yes                                            |
| `tailwindcss`                    | MIT                               | Yes: the generated CSS                         |
| `@tailwindcss/vite`              | MIT                               | No: build step only                            |
| `diff`                           | BSD-3-Clause                      | Yes: the change view of the Persian normalizer |
| `hash-wasm`                      | MIT                               | Yes: streaming SHA-256 for files (WebAssembly) |
| `jalaali-js`                     | MIT                               | Yes: Jalali and Gregorian conversion           |
| `@fontsource-variable/noto-sans` | SIL OFL 1.1 (font), MIT (package) | Yes: the font files                            |
| `@fontsource-variable/estedad`   | SIL OFL 1.1 (font), MIT (package) | Yes: the font files                            |

Development tools (TypeScript, ESLint, Prettier, Vitest, Playwright, and others) are not shipped to visitors. Their licenses are in `node_modules/`.
