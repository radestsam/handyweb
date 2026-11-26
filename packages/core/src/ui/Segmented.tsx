import { useId } from "react";
import { cx } from "./cx";

/** A set of mutually exclusive choices, built on native radio buttons. */
export function Segmented<T extends string>({
    legend,
    value,
    options,
    onChange,
}: {
    legend: string;
    value: T;
    options: ReadonlyArray<{ value: T; label: string }>;
    onChange: (value: T) => void;
}) {
    const name = useId();
    return (
        <fieldset className="flex flex-col gap-1.5">
            <legend className="mb-2 text-sm font-semibold text-muted">{legend}</legend>
            <div className="inline-flex w-fit max-w-full flex-wrap rounded-full bg-surface-2 p-1">
                {options.map((option) => (
                    <label
                        key={option.value}
                        className={cx(
                            "inline-flex min-h-9 cursor-pointer items-center rounded-full px-4 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-focus",
                            option.value === value
                                ? "bg-surface font-semibold text-text shadow-[0_0_0_1px_var(--hw-border)]"
                                : "text-muted hover:text-text",
                        )}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={option.value === value}
                            onChange={() => onChange(option.value)}
                            className="sr-only"
                        />
                        {option.label}
                    </label>
                ))}
            </div>
        </fieldset>
    );
}
