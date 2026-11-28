# Offline Operations

The outage runbook of HandyWeb. It covers an outage of the international internet while the Iranian network still works. See also the "Mirrors and Outages" document of the starter kit.

## Outside Services

| Service                | Used for                     | During an outage                                                                | Tested                                 |
| ---------------------- | ---------------------------- | ------------------------------------------------------------------------------- | -------------------------------------- |
| npm registry           | Installing packages to build | Use the kit mirror (below) for a local build                                    | Not tested                             |
| GitHub                 | Source, CI, releases         | No push, no CI. Build and upload by hand                                        | Not tested                             |
| Playwright browser CDN | Browser tests                | Already blocked from Iran. Use `PW_CHROMIUM_PATH` with a local Chromium browser | Tested 2026-11-26: the CDN returns 403 |
| Global static host     | Serving the site             | May be unreachable from Iran                                                    | Not deployed yet                       |
| Iranian static host    | Serving the site             | Serves the site                                                                 | Not deployed yet                       |

The site itself calls no outside service at runtime. Fonts and all assets are self-hosted.

A visitor who opened the site before an outage can still use it when no host is reachable: the service worker keeps the start pages and every tool page and tool file that the visitor opened. See [Offline Use](architecture.md#offline-use).

## Build During an Outage

1. Install the packages through the npm mirror of the starter kit:

    ```bash
    scripts/install-mirror.sh
    ```

    The script rewrites the download URLs in `yarn.lock` for this install only and restores the file afterwards. `yarn.lock` holds a checksum for each package, so a mirror cannot change the code without failing the install. A mirror that fetches a package for the first time can fail with an HTTP error. Run the script again; the second run works.

2. Run `make lint`, `make test`, and `make build`.
3. Upload `apps/web/dist/` to the Iranian host. The steps are added at the launch gate (T2.2).
4. When the internet returns, release the same commit through CI, so the hosts serve a CI build again.

Status: step 1 was tested on 2026-11-26 with an empty Yarn cache. The first run failed with a mirror error, the second run installed every package. Step 3 is not written yet.
