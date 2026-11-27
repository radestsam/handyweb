/*
 * CSS lengths in CSS pixels. Absolute units follow CSS Values and Units
 * Level 4: 1in = 96px, 1cm = 96/2.54px, 1pt = 1/72in, 1pc = 12pt. Relative
 * units need the context: the root font size (rem), the element font size
 * (em), the viewport (vw, vh), and the parent size (%).
 */

export const UNITS = ["px", "rem", "em", "%", "vw", "vh", "pt", "pc", "in", "cm", "mm"] as const;
export type CssUnit = (typeof UNITS)[number];

export interface Context {
    rootFontSize: number;
    fontSize: number;
    viewportWidth: number;
    viewportHeight: number;
    parentSize: number;
}

export const DEFAULT_CONTEXT: Context = {
    rootFontSize: 16,
    fontSize: 16,
    viewportWidth: 1440,
    viewportHeight: 900,
    parentSize: 1200,
};

/** The size of one unit in CSS pixels. */
export function pixelsPerUnit(unit: CssUnit, context: Context): number {
    switch (unit) {
        case "px":
            return 1;
        case "rem":
            return context.rootFontSize;
        case "em":
            return context.fontSize;
        case "%":
            return context.parentSize / 100;
        case "vw":
            return context.viewportWidth / 100;
        case "vh":
            return context.viewportHeight / 100;
        case "in":
            return 96;
        case "cm":
            return 96 / 2.54;
        case "mm":
            return 96 / 25.4;
        case "pt":
            return 96 / 72;
        case "pc":
            return 16;
    }
}

export function convertCss(value: number, from: CssUnit, to: CssUnit, context: Context): number {
    return (value * pixelsPerUnit(from, context)) / pixelsPerUnit(to, context);
}

/** "1.5rem", with up to 4 decimal places and no trailing zeros. */
export function cssValue(value: number, unit: CssUnit): string {
    return `${Number(value.toFixed(4))}${unit}`;
}
