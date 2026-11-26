import { useId } from "react";

export function Checkbox({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    const id = useId();
    return (
        <div className="flex min-h-9 items-center gap-2.5">
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                className="size-[1.125rem] accent-primary"
            />
            <label htmlFor={id} className="text-sm">
                {label}
            </label>
        </div>
    );
}
