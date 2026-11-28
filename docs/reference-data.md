# Reference Data

Some tools ship data tables. Each table is a JSON file next to the tool, with a `version` (the date it was checked) and a `source`. Update the table, its `version`, and this page together.

| Tool                                                              | File                                                             | Source                                                                                                                                                                        | Version    |
| ----------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| HTTP Status Code Reference (`http-status`)                        | `packages/tools/src/network/http-status/data.json`               | [IANA HTTP Status Code Registry](https://www.iana.org/assignments/http-status-codes/)                                                                                         | 2026-11-27 |
| IP Subnet Calculator and IP Ranges (`ip-calculator`, `ip-ranges`) | `SPECIAL` in `packages/tools/src/network/ip-calculator/logic.ts` | [IANA IPv4](https://www.iana.org/assignments/iana-ipv4-special-registry/) and [IPv6](https://www.iana.org/assignments/iana-ipv6-special-registry/) special-purpose registries | 2026-11-27 |
| MIME Type and File Extension Lookup (`mime-types`)                | `packages/tools/src/network/mime-types/data.json`                | [IANA Media Types](https://www.iana.org/assignments/media-types/), with common extensions from the WHATWG MIME Sniffing standard and web server defaults                      | 2026-11-27 |

## How to Update

1. Compare the table with its source.
2. Add, change, or remove entries. Write the Persian and the English text.
3. Set `version` to the date of the check.
4. Run `make test`. The data tests check the order, the duplicates, and that both languages are present.
