import { describe, expect, it } from "vitest";
import { decodeBytes, encodeBytes } from "./logic";

describe("hex", () => {
    it("round-trips the example", () => {
        const out = encodeBytes("سلام HandyWeb", 16, {
            separator: "space",
            prefix: false,
            uppercase: false,
        });
        expect(decodeBytes(out, 16)).toBe("سلام HandyWeb");
    });
});
