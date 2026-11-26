import type { Progress } from "../runtime/context";
import { toToolError } from "../runtime/result";
import { isProtocolMessage, PROTOCOL_VERSION, type FromWorker, type ToWorker } from "./protocol";

/** The parts of the worker global scope that exposeWorker uses. */
export interface WorkerScopeLike {
    postMessage(message: unknown, transfer?: Transferable[]): void;
    addEventListener(type: "message", listener: (event: MessageEvent) => void): void;
}

export interface WorkerJobContext {
    signal: AbortSignal;
    progress: (progress: Progress) => void;
}

export type WorkerHandler<I, O> = (input: I, context: WorkerJobContext) => O | Promise<O>;

/**
 * Connects a handler to the worker message protocol. Call it once at the top
 * level of a worker module:
 *
 *     exposeWorker<Input, Output>(async (input, { signal, progress }) => { ... });
 *
 * `transferResult` names the buffers of the result to move, not copy.
 */
export function exposeWorker<I, O>(
    handler: WorkerHandler<I, O>,
    options: {
        scope?: WorkerScopeLike;
        transferResult?: (value: O) => Transferable[];
    } = {},
): void {
    const scope = options.scope ?? (globalThis as unknown as WorkerScopeLike);
    const jobs = new Map<number, AbortController>();

    const send = (message: FromWorker<O>, transfer: Transferable[] = []) =>
        scope.postMessage(message, transfer);

    scope.addEventListener("message", (event: MessageEvent) => {
        const data: unknown = event.data;
        if (!isProtocolMessage(data)) return;
        const message = data as ToWorker<I>;

        if (message.type === "cancel") {
            jobs.get(message.id)?.abort();
            return;
        }
        if (message.type !== "run") return;

        const { id } = message;
        const controller = new AbortController();
        jobs.set(id, controller);

        const progress = ({ completed, total, message: text }: Progress) =>
            send({ v: PROTOCOL_VERSION, type: "progress", id, completed, total, message: text });

        Promise.resolve()
            .then(() => handler(message.input, { signal: controller.signal, progress }))
            .then(
                (value) =>
                    send(
                        { v: PROTOCOL_VERSION, type: "result", id, value },
                        options.transferResult?.(value) ?? [],
                    ),
                (error: unknown) =>
                    send({ v: PROTOCOL_VERSION, type: "error", id, error: toToolError(error) }),
            )
            .finally(() => jobs.delete(id));
    });
}
