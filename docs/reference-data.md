# Reference Data

Some tools ship data tables. Each table is a JSON file next to the tool, with a `version` (the date it was checked) and a `source`. Update the table, its `version`, and this page together.

| Tool                                       | File                                               | Source                                                                                | Version    |
| ------------------------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------- |
| HTTP Status Code Reference (`http-status`) | `packages/tools/src/network/http-status/data.json` | [IANA HTTP Status Code Registry](https://www.iana.org/assignments/http-status-codes/) | 2026-11-27 |

## How to Update

1. Compare the table with its source.
2. Add, change, or remove entries. Write the Persian and the English text.
3. Set `version` to the date of the check.
4. Run `make test`. The data tests check the order, the duplicates, and that both languages are present.
