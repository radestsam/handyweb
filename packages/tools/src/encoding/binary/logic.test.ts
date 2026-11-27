import { describe, expect, it } from "vitest";
import { decodeBytes, encodeBytes } from "./logic";

describe("binary", () => {
    it("round-trips the example", () => {
        const out = encodeBytes("سلام HandyWeb", 2, {
            separator: "space",
            prefix: false,
            uppercase: false,
        });
        expect(decodeBytes(out, 2)).toBe("سلام HandyWeb");
    });
});
