import { useId, useLayoutEffect, useRef, useState } from "react";
import { cx } from "./cx";

/**
 * Mutually exclusive choices on native radio buttons. A raised thumb slides to
 * the chosen option, so the change is visible. It measures the chosen label,
 * so it works in both directions and at any width.
 */
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
    const track = useRef<HTMLDivElement>(null);
    const [thumb, setThumb] = useState<{ left: number; width: number } | null>(null);

    useLayoutEffect(() => {
        const element = track.current;
        if (!element) return;
        const measure = () => {
            const active = element.querySelector<HTMLElement>("[data-active='true']");
            if (active) setThumb({ left: active.offsetLeft, width: active.offsetWidth });
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        return () => observer.disconnect();
    }, [value, options]);

    return (
        <fieldset className="flex min-w-0 flex-col">
            <legend className="mb-2 text-xs font-semibold text-muted">{legend}</legend>
            <div
                ref={track}
                className="relative inline-flex w-fit max-w-full flex-wrap rounded-full border border-border bg-surface-2 p-1"
            >
                {thumb && (
                    <span
                        aria-hidden="true"
                        className="absolute top-1 bottom-1 rounded-full bg-surface shadow-[0_1px_2px_rgb(0_0_0/0.08),0_0_0_1px_var(--hw-border)] transition-[left,width] duration-300 ease-[cubic-bezier(0.3,0.7,0.2,1)]"
                        style={{ left: thumb.left, width: thumb.width }}
                    />
                )}
                {options.map((option) => {
                    const active = option.value === value;
                    return (
                        <label
                            key={option.value}
                            data-active={active}
                            className={cx(
                                "relative z-10 inline-flex min-h-9 cursor-pointer items-center rounded-full px-4 text-sm transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-focus",
                                active ? "font-semibold text-text" : "text-muted hover:text-text",
                                // Before the first measurement, mark the choice without the thumb.
                                active && !thumb && "bg-surface",
                            )}
                        >
                            <input
                                type="radio"
                                name={name}
                                value={option.value}
                                checked={active}
                                onChange={() => onChange(option.value)}
                                className="sr-only"
                            />
                            {option.label}
                        </label>
                    );
                })}
            </div>
        </fieldset>
    );
}
