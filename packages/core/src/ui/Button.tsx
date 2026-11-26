import type { ButtonHTMLAttributes } from "react";
import { cx } from "./cx";

type Variant = "primary" | "secondary" | "ghost";

const VARIANTS: Record<Variant, string> = {
    primary: "bg-primary text-primary-fg hover:bg-primary-hover border-transparent",
    secondary: "bg-surface-2 text-text hover:bg-border/60 border-transparent",
    ghost: "bg-transparent text-muted hover:text-text hover:bg-surface-2 border-transparent",
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
                "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border px-5 text-sm font-semibold transition-[color,background-color,transform] duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:active:scale-100 disabled:opacity-40",
                VARIANTS[variant],
                className,
            )}
            {...props}
        />
    );
}
