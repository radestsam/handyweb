import { describe, expect, it } from "vitest";
import { pixelate } from "./logic";

// The shared logic is tested in ../effect/logic.test.ts.
describe("image-pixelate", () => {
    it("uses the shared pixelate", () => {
        const data = Uint8ClampedArray.from([0, 0, 0, 255, 100, 100, 100, 255]);
        pixelate(data, 2, 1, 2);
        expect(data[0]).toBe(50);
    });
});
