# Security Headers

The HTTP headers of the site have one source: `apps/web/security-headers.json`. Do not write a header in a host setting or in a hand-written file.

## How It Works

`yarn build` runs `astro build` and then `scripts/generate-headers.mjs`. The generator:

1. Reads `apps/web/security-headers.json`.
2. Finds every inline `<script>` and `<style>` in the built pages and adds its SHA-256 hash to `script-src` or `style-src`. JSON-LD blocks are data, so they get no hash. Today the hashes are for the theme script, the two Astro island scripts, and the Astro island style.
3. Puts a CSP `<meta>` tag at the start of the `<head>` of each page. A host that cannot send headers (GitHub Pages) still gets the policy. A meta policy cannot hold `frame-ancestors`, so the tag leaves it out.
4. Writes `apps/web/dist/_headers` for Cloudflare Pages (and Netlify).
5. Writes `apps/web/dist-headers/nginx-http.conf` (a `map` for the `http` block) and `nginx-server.conf` (the `add_header` lines and the cache locations for the HTTPS `server` block).

## The Policy

| Directive                               | Value                                      | Why                                                                      |
| --------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------ |
| `default-src`                           | `'self'`                                   | Nothing loads from another origin.                                       |
| `script-src`                            | `'self' 'wasm-unsafe-eval'` and the hashes | `hash-wasm` compiles WebAssembly from bytes.                             |
| `style-src`                             | `'self'` and the hashes                    |                                                                          |
| `img-src`                               | `'self' data: blob:`                       | Image tools show results from `blob:` and `data:` URLs.                  |
| `media-src`                             | `'self' blob:`                             |                                                                          |
| `worker-src`                            | `'self'`                                   | Workers of the hash, JSON, diff, and find tools, and the service worker. |
| `manifest-src`                          | `'self'`                                   | The web app manifest.                                                    |
| `frame-src`                             | `'self'`                                   |                                                                          |
| `object-src`, `base-uri`, `form-action` | `'none'`                                   | The site has no plugin, no `<base>`, and no form.                        |
| `frame-ancestors`                       | `'none'`                                   | No other site can frame a page.                                          |

### Tool Overrides

The HTML Previewer and the Markdown Editor show their result in a `srcdoc` frame. A `srcdoc` frame keeps the policy of its page, so these two pages need `'unsafe-inline'`:

- `html-preview`: `script-src` and `style-src`, because the preview can run the inline scripts and styles of the pasted HTML.
- `markdown-editor`: `style-src`, for the style of the preview.

`'unsafe-inline'` turns hashes off, so these pages get no hashes. The frames are sandboxed without `allow-same-origin`, and their own meta policy blocks every network request. A separate origin for the previews would remove the override, but the site has no second origin.

## Other Headers

| Header                      | Value                                                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains`                                                                                                |
| `X-Content-Type-Options`    | `nosniff`                                                                                                                            |
| `X-Frame-Options`           | `DENY`, for browsers without `frame-ancestors`                                                                                       |
| `X-XSS-Protection`          | `0` (the old filter can open holes)                                                                                                  |
| `Referrer-Policy`           | `no-referrer`                                                                                                                        |
| `Permissions-Policy`        | `camera=(self)` for the QR code reader; microphone, geolocation, payment, and USB off                                                |
| `Cache-Control`             | `/_astro/*`: one year, `immutable` (the file names have a content hash). `/sw.js`: `no-cache`, so browsers find a new build quickly. |

The build emits no `.wasm` file: `hash-wasm` keeps its WebAssembly in the JavaScript. If a `.wasm` file is added, check that the host sends `application/wasm`.

## Tests

`tests/e2e/csp.spec.ts` serves every page of the sitemap with the generated `_headers` and fails on any CSP violation. It also checks that an inline script without a hash is blocked and that the HTML Previewer still runs its scripts. Every other browser test runs with the meta policy too, so a tool that breaks the policy fails its own tests.

## Change a Value

1. Edit `apps/web/security-headers.json`.
2. Update this page.
3. Run `yarn build` and `make test-e2e`.
