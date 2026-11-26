import type { ToolError } from "../runtime/result";

/**
 * The message protocol between a tool UI and its worker. Both sides check the
 * version and ignore a message of another version, so a cached worker from an
 * older release cannot be misread.
 */
export const PROTOCOL_VERSION = 1;

export type ToWorker<I> =
    | { v: typeof PROTOCOL_VERSION; type: "run"; id: number; input: I }
    | { v: typeof PROTOCOL_VERSION; type: "cancel"; id: number };

export type FromWorker<O> =
    | {
          v: typeof PROTOCOL_VERSION;
          type: "progress";
          id: number;
          completed: number;
          total: number;
          message?: string | undefined;
      }
    | { v: typeof PROTOCOL_VERSION; type: "result"; id: number; value: O }
    | { v: typeof PROTOCOL_VERSION; type: "error"; id: number; error: ToolError };

export function isProtocolMessage(data: unknown): data is { v: number; type: string; id: number } {
    return (
        typeof data === "object" &&
        data !== null &&
        (data as { v?: unknown }).v === PROTOCOL_VERSION &&
        typeof (data as { type?: unknown }).type === "string" &&
        typeof (data as { id?: unknown }).id === "number"
    );
}
