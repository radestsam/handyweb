import { contrastRatio, type Rgba } from "../../developer/color-converter/logic";

/*
 * WCAG 2.2 contrast checks. Text needs 4.5:1 (AA) or 7:1 (AAA). Large text
 * (24px, or 18.66px bold) needs 3:1 (AA) or 4.5:1 (AAA). Parts of the
 * interface, such as icons and field borders, need 3:1 (success criterion
 * 1.4.11).
 */

export interface Checks {
    ratio: number;
    normalAA: boolean;
    normalAAA: boolean;
    largeAA: boolean;
    largeAAA: boolean;
    ui: boolean;
}

/** A transparent foreground is first drawn over the background. */
export function flatten(foreground: Rgba, background: Rgba): Rgba {
    const a = foreground.a;
    return {
        r: foreground.r * a + background.r * (1 - a),
        g: foreground.g * a + background.g * (1 - a),
        b: foreground.b * a + background.b * (1 - a),
        a: 1,
    };
}

export function check(foreground: Rgba, background: Rgba): Checks {
    const ratio = contrastRatio(flatten(foreground, { ...background, a: 1 }), {
        ...background,
        a: 1,
    });
    // WCAG does not round: 4.499 fails 4.5.
    return {
        ratio,
        normalAA: ratio >= 4.5,
        normalAAA: ratio >= 7,
        largeAA: ratio >= 3,
        largeAAA: ratio >= 4.5,
        ui: ratio >= 3,
    };
}

/**
 * The closest foreground that reaches the target ratio, found by mixing the
 * color toward black or toward white in steps of 1%. Returns null when even
 * black or white does not reach it.
 */
export function suggest(foreground: Rgba, background: Rgba, target: number): Rgba | null {
    const options: Array<{ color: Rgba; step: number }> = [];
    for (const end of [0, 255]) {
        for (let step = 1; step <= 100; step++) {
            const t = step / 100;
            const color = {
                r: Math.round(foreground.r + (end - foreground.r) * t),
                g: Math.round(foreground.g + (end - foreground.g) * t),
                b: Math.round(foreground.b + (end - foreground.b) * t),
                a: 1,
            };
            if (contrastRatio(color, { ...background, a: 1 }) >= target) {
                options.push({ color, step });
                break;
            }
        }
    }
    options.sort((x, y) => x.step - y.step);
    return options[0]?.color ?? null;
}
