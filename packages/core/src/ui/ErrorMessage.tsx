import type { Locale } from "../i18n/locales";
import type { ToolError } from "../runtime/result";
import { UI_STRINGS } from "./strings";

/** Shows a tool error. The icon and the title make it clear without color. */
export function ErrorMessage({ error, locale }: { error: ToolError; locale: Locale }) {
    return (
        <div
            role="alert"
            className="flex gap-2 rounded-xl bg-error-bg px-4 py-3 text-sm text-error"
        >
            <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="mt-0.5 size-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v6M12 16.5v.5" strokeLinecap="round" />
            </svg>
            <div>
                <strong>{UI_STRINGS.errorTitle[locale]}: </strong>
                {error.message[locale]}
                {error.detail && (
                    <span dir="ltr" className="ms-1 font-mono text-xs">
                        ({error.detail})
                    </span>
                )}
            </div>
        </div>
    );
}
