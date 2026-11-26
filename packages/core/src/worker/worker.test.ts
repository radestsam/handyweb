import { describe, expect, it, vi } from "vitest";
import { ToolFailure } from "../runtime/result";
import { exposeWorker, type WorkerHandler } from "./expose";
import { runInWorker, type WorkerLike } from "./host";
import { PROTOCOL_VERSION } from "./protocol";

/** A worker and its scope joined in memory, with asynchronous delivery. */
function fakeWorker<I, O>(handler: WorkerHandler<I, O>) {
    const toScope: Array<(event: MessageEvent) => void> = [];
    const toHost: Array<(event: MessageEvent) => void> = [];
    const errorListeners: Array<(event: Event) => void> = [];
    const state = { terminated: false, received: [] as unknown[] };

    const deliver = (listeners: Array<(event: MessageEvent) => void>, data: unknown) =>
        queueMicrotask(() => {
            if (state.terminated) return;
            for (const listener of listeners) listener({ data } as MessageEvent);
        });

    exposeWorker(handler, {
        scope: {
            postMessage: (message) => deliver(toHost, message),
            addEventListener: (_type, listener) => toScope.push(listener),
        },
    });

    const worker: WorkerLike = {
        postMessage: (message) => {
            state.received.push(message);
            deliver(toScope, message);
        },
        terminate: () => {
            state.terminated = true;
        },
        addEventListener: (type: string, listener: (event: never) => void) => {
            if (type === "message") toHost.push(listener as (event: MessageEvent) => void);
            else errorListeners.push(listener as (event: Event) => void);
        },
    };
    return { worker, state, crash: () => errorListeners.forEach((l) => l(new Event("error"))) };
}

describe("runInWorker", () => {
    it("returns the result and terminates the worker", async () => {
        const { worker, state } = fakeWorker<string, string>((input) => input.toUpperCase());
        const result = await runInWorker<string, string>(() => worker, "abc");
        expect(result).toEqual({ ok: true, value: "ABC" });
        expect(state.terminated).toBe(true);
    });

    it("reports progress", async () => {
        const { worker } = fakeWorker<number, number>(async (total, { progress }) => {
            for (let i = 1; i <= total; i++) progress({ completed: i, total });
            await new Promise((r) => setTimeout(r, 0));
            return total;
        });
        const onProgress = vi.fn();
        await runInWorker<number, number>(() => worker, 3, { onProgress });
        expect(onProgress.mock.calls.map(([p]) => p.completed)).toEqual([1, 2, 3]);
    });

    it("turns a ToolFailure into a typed error", async () => {
        const { worker } = fakeWorker<string, string>(() => {
            throw new ToolFailure("invalid-input", { fa: "نامعتبر", en: "Invalid" }, "line 3");
        });
        const result = await runInWorker<string, string>(() => worker, "x");
        expect(result).toEqual({
            ok: false,
            error: {
                code: "invalid-input",
                message: { fa: "نامعتبر", en: "Invalid" },
                detail: "line 3",
            },
        });
    });

    it("never puts the message of an unknown error in the result", async () => {
        const { worker } = fakeWorker<string, string>((input) => {
            throw new Error(`secret ${input}`);
        });
        const result = await runInWorker<string, string>(() => worker, "password123");
        expect(JSON.stringify(result)).not.toContain("password123");
        expect(result.ok || result.error.code).toBe("internal");
    });

    it("cancels: resolves at once and terminates the worker", async () => {
        const { worker, state } = fakeWorker<string, string>(
            () => new Promise<string>(() => undefined),
        );
        const controller = new AbortController();
        const pending = runInWorker<string, string>(() => worker, "x", {
            signal: controller.signal,
        });
        controller.abort();
        const result = await pending;
        expect(result.ok || result.error.code).toBe("canceled");
        expect(state.terminated).toBe(true);
    });

    it("does not start a worker when the signal is already aborted", async () => {
        const create = vi.fn();
        const controller = new AbortController();
        controller.abort();
        const result = await runInWorker(create, "x", { signal: controller.signal });
        expect(result.ok || result.error.code).toBe("canceled");
        expect(create).not.toHaveBeenCalled();
    });

    it("times out and terminates the worker", async () => {
        vi.useFakeTimers();
        const { worker, state } = fakeWorker<string, string>(
            () => new Promise<string>(() => undefined),
        );
        const pending = runInWorker<string, string>(() => worker, "x", { timeoutMs: 1000 });
        await vi.advanceTimersByTimeAsync(1001);
        const result = await pending;
        vi.useRealTimers();
        expect(result.ok || result.error.code).toBe("timeout");
        expect(state.terminated).toBe(true);
    });

    it("reports a crash of the worker", async () => {
        const { worker, crash, state } = fakeWorker<string, string>(
            () => new Promise<string>(() => undefined),
        );
        const pending = runInWorker<string, string>(() => worker, "x");
        crash();
        const result = await pending;
        expect(result.ok || result.error.code).toBe("internal");
        expect(state.terminated).toBe(true);
    });

    it("sends a versioned run message", async () => {
        const { worker, state } = fakeWorker<string, string>((input) => input);
        await runInWorker<string, string>(() => worker, "x");
        expect(state.received[0]).toMatchObject({ v: PROTOCOL_VERSION, type: "run", input: "x" });
    });
});

describe("exposeWorker", () => {
    it("ignores a message of another protocol version", async () => {
        const handler = vi.fn();
        const listeners: Array<(event: MessageEvent) => void> = [];
        exposeWorker(handler, {
            scope: { postMessage: vi.fn(), addEventListener: (_t, l) => listeners.push(l) },
        });
        listeners[0]?.({ data: { v: 999, type: "run", id: 1, input: "x" } } as MessageEvent);
        await new Promise((r) => setTimeout(r, 0));
        expect(handler).not.toHaveBeenCalled();
    });
});
