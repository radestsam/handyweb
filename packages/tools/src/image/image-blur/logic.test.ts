import { describe, expect, it } from "vitest";
import { boxBlur } from "./logic";

// The shared logic is tested in ../effect/logic.test.ts.
describe("image-blur", () => {
    it("uses the shared blur", () => {
        const data = Uint8ClampedArray.from([0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255]);
        boxBlur(data, 3, 1, 1);
        expect(data[4]).toBeLessThan(255);
    });
});
