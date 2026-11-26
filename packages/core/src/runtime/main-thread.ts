import type { ToolContext } from "./context";
import { ok, fail, toToolError, standardError, type ToolResult } from "./result";

/**
 * Runs a small, fast tool function on the main thread and wraps the outcome
 * in a result envelope. Use a worker for anything that can take more than a
 * few milliseconds (plan section 2.3).
 */
export async function runOnMainThread<I, O>(
    run: (input: I, context: ToolContext) => O | Promise<O>,
    input: I,
    context: ToolContext,
): Promise<ToolResult<O>> {
    if (context.signal.aborted) return fail(standardError("canceled"));
    try {
        return ok(await run(input, context));
    } catch (error) {
        return fail(toToolError(error));
    }
}
