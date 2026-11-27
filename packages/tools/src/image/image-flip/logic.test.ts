import { describe, expect, it } from "vitest";
import { rotatedSize } from "./logic";

// The shared logic is tested in ../transform/logic.test.ts.
describe("image-flip", () => {
    it("uses the shared transform logic", () => {
        expect(rotatedSize(2, 1, 90)).toEqual({ width: 1, height: 2 });
    });
});
