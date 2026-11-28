import { describe, expect, it } from "vitest";
import { check, flatten, suggest } from "./logic";
import { contrastRatio } from "../../developer/color-converter/logic";

const c = (r: number, g: number, b: number, a = 1) => ({ r, g, b, a });

describe("contrast checks", () => {
    it("checks black on white and a near miss", () => {
        expect(check(c(0, 0, 0), c(255, 255, 255))).toMatchObject({
            normalAA: true,
            normalAAA: true,
        });
        expect(check(c(0, 0, 0), c(255, 255, 255)).ratio).toBeCloseTo(21, 5);
        // #777 on white is 4.48:1, just below AA.
        const gray = check(c(0x77, 0x77, 0x77), c(255, 255, 255));
        expect(gray.ratio).toBeCloseTo(4.48, 2);
        expect(gray).toMatchObject({ normalAA: false, largeAA: true, ui: true });
    });

    it("flattens a transparent foreground", () => {
        expect(flatten(c(0, 0, 0, 0.5), c(255, 255, 255))).toEqual(c(127.5, 127.5, 127.5));
    });

    it("suggests the closest passing color", () => {
        const fixed = suggest(c(0x77, 0x77, 0x77), c(255, 255, 255), 4.5);
        expect(fixed).not.toBeNull();
        expect(contrastRatio(fixed!, c(255, 255, 255))).toBeGreaterThanOrEqual(4.5);
        expect(fixed!.r).toBeLessThan(0x77);
        expect(fixed!.r).toBeGreaterThan(0x60);
        expect(suggest(c(128, 128, 128), c(128, 128, 128), 22)).toBeNull();
    });
});
