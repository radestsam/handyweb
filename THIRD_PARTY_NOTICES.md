# Third-Party Notices

HandyWeb is licensed under the Apache License 2.0 (see `LICENSE`). It ships the third-party components below. Each one keeps its own license.

## Fonts

| Component | Version                                | License                   | Source                                            | Shipped files                           |
| --------- | -------------------------------------- | ------------------------- | ------------------------------------------------- | --------------------------------------- |
| Noto Sans | `@fontsource-variable/noto-sans` 5.3.0 | SIL Open Font License 1.1 | https://github.com/notofonts/latin-greek-cyrillic | Latin and Latin Extended variable WOFF2 |
| Estedad   | `@fontsource-variable/estedad` 5.3.0   | SIL Open Font License 1.1 | https://github.com/aminabedi68/Estedad            | Arabic-script variable WOFF2            |

The full license text of each font is in its package: `node_modules/@fontsource-variable/<name>/LICENSE`.

## Data

| Component                  | Version    | License            | Source                       | Shipped files                                                               |
| -------------------------- | ---------- | ------------------ | ---------------------------- | --------------------------------------------------------------------------- |
| Unicode Character Database | Unicode 15 | Unicode License V3 | https://www.unicode.org/ucd/ | Character names in `packages/tools/src/text/unicode-explorer/names.ts`      |
| EFF large wordlist         | 2016-07-18 | CC BY 3.0 US       | https://www.eff.org/dice     | Passphrase words in `packages/tools/src/crypto/password-generator/words.ts` |

The character names of the Unicode Character Inspector come from the Unicode Character Database. Copyright © 1991-2023 Unicode, Inc. The license is at https://www.unicode.org/license.txt.

The passphrase words come from the EFF large wordlist by the Electronic Frontier Foundation, under the Creative Commons Attribution 3.0 US license: https://creativecommons.org/licenses/by/3.0/us/.

## npm Packages

`scripts/check-notices.mjs` fails the build when a package in a `dependencies` field is missing here.

| Package                          | License                                                             | Ships to visitors                              |
| -------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------- |
| `astro`                          | MIT                                                                 | Yes: the island runtime                        |
| `@astrojs/react`                 | MIT                                                                 | Yes: the React renderer of islands             |
| `react`                          | MIT                                                                 | Yes                                            |
| `react-dom`                      | MIT                                                                 | Yes                                            |
| `tailwindcss`                    | MIT                                                                 | Yes: the generated CSS                         |
| `@tailwindcss/vite`              | MIT                                                                 | No: build step only                            |
| `diff`                           | BSD-3-Clause                                                        | Yes: the Persian normalizer and the text diff  |
| `hash-wasm`                      | MIT                                                                 | Yes: streaming SHA-256 for files (WebAssembly) |
| `jalaali-js`                     | MIT                                                                 | Yes: Jalali and Gregorian conversion           |
| `uqr`                            | MIT (includes the QR Code generator library by Project Nayuki, MIT) | Yes: QR code encoding                          |
| `@fontsource-variable/noto-sans` | SIL OFL 1.1 (font), MIT (package)                                   | Yes: the font files                            |
| `@fontsource-variable/estedad`   | SIL OFL 1.1 (font), MIT (package)                                   | Yes: the font files                            |

Development tools (TypeScript, ESLint, Prettier, Vitest, Playwright, and others) are not shipped to visitors. Their licenses are in `node_modules/`.
