# Security Policy

## Report a Vulnerability

Report a security problem privately through GitHub: open https://github.com/radestsam/handyweb/security/advisories/new. Do not open a public issue.

Include the page or tool, the steps to reproduce, and the effect. Do not include real secrets or personal data.

You get an answer within 7 days. A fix is published as soon as it is ready, and the advisory credits you unless you ask otherwise.

## Scope

HandyWeb is a static website. The tools run in the browser of the visitor. These problems are in scope:

- A tool sends user input, output, or a file name over the network.
- Script runs from user input in the HandyWeb origin (for example through Markdown, HTML, or SVG previews).
- A cryptographic tool gives a wrong or unsafe result, or uses weak randomness.
- A dependency with a known vulnerability ships to visitors.
