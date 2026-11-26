import type { ReactNode } from "react";
import { cx } from "./cx";

/** Shows code, a hash, a URL, or a file name left to right, isolated from RTL text. */
export function Ltr({
    children,
    as: Tag = "span",
    className,
}: {
    children: ReactNode;
    as?: "span" | "code" | "bdi" | "div";
    className?: string;
}) {
    return (
        <Tag dir="ltr" className={cx("ltr-isolate", className)}>
            {children}
        </Tag>
    );
}
