import type { ButtonHTMLAttributes } from "react";
import { cx } from "./cx";
import { Icon, type IconName } from "./icons";

/** A small labeled action in a pane header: an icon and a short word. */
export function PaneAction({
    icon,
    label,
    className,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon: IconName; label: string }) {
    return (
        <button
            type="button"
            className={cx(
                "inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-muted transition-[color,background-color,transform] duration-150 hover:bg-surface-2 hover:text-text active:scale-[0.96] disabled:pointer-events-none disabled:opacity-35",
                className,
            )}
            {...props}
        >
            <Icon name={icon} className="size-3.5" />
            <span>{label}</span>
        </button>
    );
}
