import { useId, type InputHTMLAttributes } from "react";

const FIELD =
    "min-h-11 w-full rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text tabular-nums outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";

/**
 * A labeled text field for a number. It is a text field, not type="number",
 * so Persian digits and the Persian decimal mark (٫) can be typed. The calling
 * tool reads the value with parseAmount.
 */
export function NumberField({
    label,
    value,
    onChange,
    suffix,
    ...props
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    suffix?: string | undefined;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
    const id = useId();
    return (
        <label
            htmlFor={id}
            className="flex min-w-0 flex-col gap-1.5 text-xs font-semibold text-muted"
        >
            {label}
            <span className="flex items-center gap-2">
                <input
                    id={id}
                    inputMode="decimal"
                    dir="ltr"
                    autoComplete="off"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className={FIELD}
                    {...props}
                />
                {suffix && <span className="shrink-0 text-sm text-text">{suffix}</span>}
            </span>
        </label>
    );
}
