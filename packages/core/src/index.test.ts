import { describe, expect, it } from "vitest";
import { coreVersion } from "./index";

describe("core", () => {
    it("exports a version", () => {
        expect(coreVersion).toMatch(/^\d+\.\d+\.\d+$/);
    });
});
