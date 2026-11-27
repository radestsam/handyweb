// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { minifyPath, optimizeSvg, shortNumber } from "./logic";

const options = { precision: 2, keepTitle: true, sanitize: false };

const INKSCAPE = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Created with Inkscape -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24.000000" height="24.000000" viewBox="0 0 24.000 24.000">
  <metadata><rdf>junk</rdf></metadata>
  <sodipodi:namedview inkscape:zoom="2"/>
  <title>Icon</title>
  <g>
    <g inkscape:label="Layer 1" data-name="Layer 1">
      <path d="M 10.123456,20.000000 L 0.500000 , -3.250000 Z" fill="#bc4a3c" inkscape:connector-curvature="0"/>
    </g>
    <g></g>
  </g>
  <defs/>
</svg>`;

describe("numbers", () => {
    it("writes short numbers", () => {
        expect(shortNumber(0.5, 2)).toBe(".5");
        expect(shortNumber(-0.456, 2)).toBe("-.46");
        expect(shortNumber(-0.0001, 2)).toBe("0");
        expect(shortNumber(24, 3)).toBe("24");
    });

    it("minifies path data", () => {
        expect(minifyPath("M 10.123456,20.000000 L 0.500000 , -3.250000 Z", 2)).toBe(
            "M10.12 20L.5-3.25Z",
        );
    });
});

describe("optimizeSvg", () => {
    it("removes editor data, comments, metadata, empty groups, and rounds numbers", () => {
        const result = optimizeSvg(INKSCAPE, options);
        expect(result.svg).not.toMatch(
            /inkscape|sodipodi|metadata|<!--|<\?xml|version=|data-name|xlink|<defs|<g>/,
        );
        expect(result.svg).toContain('width="24"');
        expect(result.svg).toContain('viewBox="0 0 24 24"');
        expect(result.svg).toContain('d="M10.12 20L.5-3.25Z"');
        expect(result.svg).toContain("<title>Icon</title>");
        // A group with an attribute stays, a plain one is unwrapped.
        expect(result.svg).toMatch(/^<svg[^>]*><title>Icon<\/title><path /);
        expect(result.after).toBeLessThan(result.before / 2);
    });

    it("can remove the title and the unsafe parts", () => {
        const result = optimizeSvg(
            '<svg xmlns="http://www.w3.org/2000/svg" onload="x()"><title>t</title><script>x()</script><rect width="1" height="1"/></svg>',
            {
                ...options,
                keepTitle: false,
                sanitize: true,
            },
        );
        expect(result.svg).toBe(
            '<svg xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1"/></svg>',
        );
    });

    it("keeps xlink when it is used and refuses other text", () => {
        const used = optimizeSvg(
            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><use xlink:href="#a"/></svg>',
            options,
        );
        expect(used.svg).toContain("xmlns:xlink");
        expect(() => optimizeSvg("<p>no</p>", options)).toThrow();
    });
});
