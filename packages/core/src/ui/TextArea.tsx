import { useId, type TextareaHTMLAttributes } from "react";
import { cx } from "./cx";

/**
 * A labeled text area. User text uses dir="auto", so Persian and English
 * input both read correctly. Code-like content (Base64, JSON, hashes) uses
 * `code`, which is always left to right and monospace.
 */
export function TextArea({
    label,
    code = false,
    hint,
    className,
    ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    code?: boolean;
    hint?: string | undefined;
}) {
    const id = useId();
    const hintId = `${id}-hint`;
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-semibold text-muted">
                {label}
            </label>
            <textarea
                id={id}
                dir={code ? "ltr" : "auto"}
                spellCheck={!code}
                autoCapitalize="off"
                autoComplete="off"
                aria-describedby={hint ? hintId : undefined}
                className={cx(
                    "min-h-44 w-full resize-y rounded-xl border border-transparent bg-surface-2 p-4 text-base text-text outline-none placeholder:text-muted focus-visible:border-focus read-only:bg-transparent read-only:border-border",
                    code && "font-mono text-sm break-all",
                    className,
                )}
                {...props}
            />
            {hint && (
                <p id={hintId} className="text-xs text-muted">
                    {hint}
                </p>
            )}
        </div>
    );
}
