import type { Locale } from "../i18n/locales";

export interface Progress {
    completed: number;
    total: number;
    message?: string | undefined;
}

/**
 * What a tool receives when it runs. It is small on purpose: a tool cannot
 * reach the rest of the application (plan section 4.3).
 */
export interface ToolContext {
    locale: Locale;
    signal: AbortSignal;
    onProgress: (progress: Progress) => void;
}

/** Throws an AbortError when the signal is aborted. Call it between steps. */
export function throwIfAborted(signal: AbortSignal): void {
    if (signal.aborted) throw new DOMException("Canceled", "AbortError");
}
