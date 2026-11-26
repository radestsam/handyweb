import type { ButtonHTMLAttributes } from "react";
import { cx } from "./cx";

type Variant = "primary" | "secondary" | "ghost";

const VARIANTS: Record<Variant, string> = {
    primary: "bg-primary text-primary-fg hover:bg-primary-hover border-transparent",
    secondary: "bg-surface text-text hover:bg-surface-2 border-border",
    ghost: "bg-transparent text-text hover:bg-surface-2 border-transparent",
};

export function Button({
    variant = "secondary",
    className,
    type = "button",
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
    return (
        <button
            type={type}
            className={cx(
                "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                VARIANTS[variant],
                className,
            )}
            {...props}
        />
    );
}
