import type { Progress } from "../runtime/context";
import { fail, ok, standardError, type ToolResult } from "../runtime/result";
import { isProtocolMessage, PROTOCOL_VERSION, type FromWorker, type ToWorker } from "./protocol";

/** The parts of Worker that the host uses. Tests pass a fake. */
export interface WorkerLike {
    postMessage(message: unknown, transfer?: Transferable[]): void;
    terminate(): void;
    addEventListener(type: "message", listener: (event: MessageEvent) => void): void;
    addEventListener(type: "error" | "messageerror", listener: (event: Event) => void): void;
}

export interface RunInWorkerOptions {
    signal?: AbortSignal | undefined;
    onProgress?: ((progress: Progress) => void) | undefined;
    /** Stops the worker after this many milliseconds. */
    timeoutMs?: number | undefined;
    /** Buffers to move into the worker instead of copying them. */
    transfer?: Transferable[] | undefined;
}

let nextId = 1;

/**
 * Runs one job in a new worker and always terminates the worker afterwards:
 * on the result, on an error, on cancel, and on timeout. One worker per job
 * keeps no state and no large buffer alive between runs.
 */
export function runInWorker<I, O>(
    createWorker: () => WorkerLike,
    input: I,
    options: RunInWorkerOptions = {},
): Promise<ToolResult<O>> {
    const { signal, onProgress, timeoutMs, transfer } = options;
    if (signal?.aborted) return Promise.resolve(fail(standardError("canceled")));

    const id = nextId++;
    const worker = createWorker();

    return new Promise<ToolResult<O>>((resolve) => {
        let settled = false;
        let timer: ReturnType<typeof setTimeout> | undefined;

        const finish = (result: ToolResult<O>) => {
            if (settled) return;
            settled = true;
            if (timer !== undefined) clearTimeout(timer);
            signal?.removeEventListener("abort", onAbort);
            worker.terminate();
            resolve(result);
        };

        const onAbort = () => finish(fail(standardError("canceled")));
        signal?.addEventListener("abort", onAbort, { once: true });

        if (timeoutMs !== undefined) {
            timer = setTimeout(() => finish(fail(standardError("timeout"))), timeoutMs);
        }

        worker.addEventListener("message", (event: MessageEvent) => {
            const data: unknown = event.data;
            if (!isProtocolMessage(data) || data.id !== id) return;
            const message = data as FromWorker<O>;
            if (message.type === "progress") {
                onProgress?.({
                    completed: message.completed,
                    total: message.total,
                    message: message.message,
                });
            } else if (message.type === "result") {
                finish(ok(message.value));
            } else if (message.type === "error") {
                finish(fail(message.error));
            }
        });

        worker.addEventListener("error", () =>
            finish(fail(standardError("internal", "worker-error"))),
        );
        worker.addEventListener("messageerror", () =>
            finish(fail(standardError("internal", "worker-message-error"))),
        );

        const run: ToWorker<I> = { v: PROTOCOL_VERSION, type: "run", id, input };
        worker.postMessage(run, transfer ?? []);
    });
}
