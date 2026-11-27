import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { repeatText } from "./logic";

function detail(fn: () => unknown): string | undefined {
    try {
        fn();
    } catch (error) {
        if (error instanceof ToolFailure) return error.detail;
        throw error;
    }
    throw new Error("expected a ToolFailure");
}

describe("repeatText", () => {
    it("repeats with a separator", () => {
        expect(repeatText("سلام", 3, " ")).toBe("سلام سلام سلام");
        expect(repeatText("ab", 2, "")).toBe("abab");
        expect(repeatText("x", 2, "\n")).toBe("x\nx");
        expect(repeatText("", 3, ",")).toBe(",,");
    });

    it("rejects a bad count and a too large result", () => {
        expect(detail(() => repeatText("a", 0, ""))).toBe("count");
        expect(detail(() => repeatText("a", 10_001, ""))).toBe("count");
        expect(detail(() => repeatText("a".repeat(1000), 10_000, ""))).toBe("output");
    });
});
