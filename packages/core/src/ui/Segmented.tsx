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
            <legend className="mb-1.5 text-sm font-semibold">{legend}</legend>
            <div className="inline-flex w-fit rounded-md border border-border bg-surface p-0.5">
                {options.map((option) => (
                    <label
                        key={option.value}
                        className={cx(
                            "cursor-pointer rounded px-3 py-1.5 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-focus",
                            option.value === value
                                ? "bg-primary text-primary-fg"
                                : "text-text hover:bg-surface-2",
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
