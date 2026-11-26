import type { LocalizedText } from "../i18n/locales";

/**
 * The kinds of failure that a tool reports. The UI shows the localized
 * message. It never shows user input in an error, and nothing is sent anywhere.
 */
export type ToolErrorCode =
    "invalid-input" | "too-large" | "unsupported" | "canceled" | "timeout" | "internal";

export interface ToolError {
    code: ToolErrorCode;
    message: LocalizedText;
    /** Technical detail for the user to copy into a bug report, without input. */
    detail?: string | undefined;
}

export type ToolResult<T> = { ok: true; value: T } | { ok: false; error: ToolError };

export const ok = <T>(value: T): ToolResult<T> => ({ ok: true, value });

export const fail = <T = never>(error: ToolError): ToolResult<T> => ({ ok: false, error });

/** Thrown inside a tool to report an expected failure with a localized message. */
export class ToolFailure extends Error {
    constructor(
        readonly code: ToolErrorCode,
        readonly localized: LocalizedText,
        readonly detail?: string,
    ) {
        super(localized.en);
        this.name = "ToolFailure";
    }

    toToolError(): ToolError {
        return { code: this.code, message: this.localized, detail: this.detail };
    }
}

const GENERIC: Record<Exclude<ToolErrorCode, "invalid-input">, LocalizedText> = {
    "too-large": {
        fa: "ورودی بزرگ‌تر از اندازه‌ای است که این ابزار می‌پذیرد.",
        en: "The input is larger than this tool allows.",
    },
    unsupported: {
        fa: "مرورگر شما این کار را پشتیبانی نمی‌کند.",
        en: "Your browser does not support this operation.",
    },
    canceled: { fa: "کار به خواست شما ایستاد.", en: "The operation was canceled." },
    timeout: {
        fa: "کار بیش از اندازه به درازا کشید و ایستاد.",
        en: "The operation took too long and was stopped.",
    },
    internal: {
        fa: "کار با شکست روبه‌رو شد. ورودی شما به جایی فرستاده نشد.",
        en: "An unexpected error occurred. Your input was not sent anywhere.",
    },
};

/** A standard error with the generic message of its code. */
export function standardError(
    code: Exclude<ToolErrorCode, "invalid-input">,
    detail?: string,
): ToolError {
    return { code, message: GENERIC[code], detail };
}

/** Turns anything that a tool threw into a user-safe ToolError. */
export function toToolError(error: unknown): ToolError {
    if (error instanceof ToolFailure) return error.toToolError();
    if (error instanceof DOMException && error.name === "AbortError")
        return standardError("canceled");
    // The message of an unknown error can quote the input, so only its type is kept.
    const type = error instanceof Error ? error.name : typeof error;
    return standardError("internal", type);
}
