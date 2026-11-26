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
        <div className="flex items-center gap-2">
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                className="size-4 accent-primary"
            />
            <label htmlFor={id} className="text-sm">
                {label}
            </label>
        </div>
    );
}
