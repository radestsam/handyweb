import { describe, expect, it } from "vitest";
import { runOnMainThread } from "./main-thread";
import type { ToolContext } from "./context";

const context = (signal = new AbortController().signal): ToolContext => ({
    locale: "en",
    signal,
    onProgress: () => undefined,
});

describe("runOnMainThread", () => {
    it("wraps a value", async () => {
        expect(await runOnMainThread((s: string) => s.length, "abc", context())).toEqual({
            ok: true,
            value: 3,
        });
    });

    it("wraps a thrown error without its message", async () => {
        const result = await runOnMainThread(
            (s: string) => {
                throw new TypeError(s);
            },
            "secret",
            context(),
        );
        expect(result).toMatchObject({
            ok: false,
            error: { code: "internal", detail: "TypeError" },
        });
        expect(JSON.stringify(result)).not.toContain("secret");
    });

    it("does not run when already canceled", async () => {
        const controller = new AbortController();
        controller.abort();
        let ran = false;
        const result = await runOnMainThread(() => (ran = true), null, context(controller.signal));
        expect(ran).toBe(false);
        expect(result.ok || result.error.code).toBe("canceled");
    });
});
