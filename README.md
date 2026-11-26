# HandyWeb

HandyWeb is a free, open-source collection of browser tools for Persian and English users. Every tool runs on your device. The site has no backend, no accounts, and no analytics.

Live site: https://handyweb.ir (not deployed yet)

## Requirements

- Node 24.22.2 (see `.nvmrc`). Node 26 also works for local development.
- Yarn 1.22.22: `npm install --global yarn@1.22.22`

## Setup

```bash
yarn install --frozen-lockfile
yarn dev
```

## Repository Layout

| Path             | What it holds                                        |
| ---------------- | ---------------------------------------------------- |
| `apps/web`       | The Astro site                                       |
| `packages/core`  | Code shared by the site and the tools                |
| `packages/tools` | Every tool: metadata, logic, tests, UI, translations |

The dependency direction is `apps/web` to `packages/tools` to `packages/core`. ESLint stops an import in the other direction.

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
