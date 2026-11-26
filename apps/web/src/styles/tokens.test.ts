import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// WCAG 2.x contrast of every text/background pair that the UI uses, in both
// themes. Text needs 4.5:1 (AA). Focus rings and other non-text UI need 3:1.

const css = readFileSync(new URL("./tokens.css", import.meta.url), "utf8");

function block(selector: string): Record<string, string> {
    const start = css.indexOf(`${selector} {`);
    if (start < 0) throw new Error(`No block for ${selector}`);
    const body = css.slice(start, css.indexOf("}", start));
    const vars: Record<string, string> = {};
    for (const match of body.matchAll(/--hw-([a-z0-9-]+):\s*(#[0-9a-f]{6});/g)) {
        vars[match[1] as string] = match[2] as string;
    }
    return vars;
}

function luminance(hex: string): number {
    const [r, g, b] = [1, 3, 5].map((i) => {
        const c = parseInt(hex.slice(i, i + 2), 16) / 255;
        return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    }) as [number, number, number];
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
    const [dark, light] = [luminance(a), luminance(b)].sort((x, y) => x - y) as [number, number];
    return (light + 0.05) / (dark + 0.05);
}

const TEXT = 4.5;
const UI = 3;

const pairs: Array<[foreground: string, background: string, minimum: number]> = [
    ["text", "bg", TEXT],
    ["text", "surface", TEXT],
    ["text", "surface-2", TEXT],
    ["text-muted", "bg", TEXT],
    ["text-muted", "surface", TEXT],
    ["text-muted", "surface-2", TEXT],
    ["primary-text", "bg", TEXT],
    ["primary-text", "surface", TEXT],
    ["primary-fg", "primary", TEXT],
    ["primary-fg", "primary-hover", TEXT],
    ["error", "bg", TEXT],
    ["error", "surface", TEXT],
    ["error", "error-bg", TEXT],
    ["success", "bg", TEXT],
    ["success", "surface", TEXT],
    ["primary-text", "primary-soft", TEXT],
    ["text", "primary-soft", TEXT],
    ["focus", "bg", UI],
    ["focus", "surface", UI],
];

const light = block(":root");
const dark = { ...light, ...block(':root[data-theme="dark"]') };
const systemDark = { ...light, ...block(":root:not([data-theme])") };

describe.each([
    ["light", light],
    ["dark", dark],
])("%s theme", (_name, theme) => {
    it.each(pairs)("%s on %s reaches %d:1", (fg, bg, minimum) => {
        const a = theme[fg];
        const b = theme[bg];
        expect(a, `--hw-${fg}`).toBeDefined();
        expect(b, `--hw-${bg}`).toBeDefined();
        expect(contrast(a as string, b as string)).toBeGreaterThanOrEqual(minimum);
    });
});

describe("tokens", () => {
    it("keeps the brand color", () => {
        expect(light["primary"]).toBe("#bc4a3c");
        expect(dark["primary"]).toBe("#bc4a3c");
    });

    it("uses the same dark values with and without scripts", () => {
        expect(systemDark).toEqual(dark);
    });
});
