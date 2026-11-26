import { useId, type ReactNode, type TextareaHTMLAttributes } from "react";
import type { Locale } from "../i18n/locales";
import { cx } from "./cx";

/**
 * An editor pane: a header with the label and the actions, the text, and a
 * footer with live measurements. Input and output panes look the same, so the
 * eye reads them as one instrument.
 */
export function Pane({
    label,
    locale,
    code = false,
    actions,
    meta,
    stats = true,
    className,
    value,
    ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    locale: Locale;
    code?: boolean;
    actions?: ReactNode;
    /** Extra footer content, shown before the counts. */
    meta?: ReactNode;
    /** Show the character and byte counts. */
    stats?: boolean;
    value: string;
}) {
    const id = useId();
    const readOnly = props.readOnly === true;
    return (
        <div
            className={cx(
                "group/pane flex min-w-0 flex-col overflow-hidden rounded-2xl border transition-[border-color,box-shadow] duration-200",
                readOnly
                    ? "border-border bg-bg"
                    : "border-border bg-surface-2/60 focus-within:border-focus focus-within:shadow-[0_0_0_4px_var(--hw-glow)]",
            )}
        >
            <div className="flex min-h-11 items-center justify-between gap-2 border-b border-border/70 ps-4 pe-1.5">
                <label htmlFor={id} className="text-xs font-semibold text-muted">
                    {label}
                </label>
                <div className="flex items-center gap-0.5">{actions}</div>
            </div>
            <textarea
                id={id}
                dir={code ? "ltr" : "auto"}
                spellCheck={!code}
                autoCapitalize="off"
                autoComplete="off"
                value={value}
                className={cx(
                    "min-h-52 w-full flex-1 resize-y bg-transparent px-4 py-3.5 text-base text-text outline-none focus-visible:shadow-none focus-visible:outline-none placeholder:font-sans placeholder:tracking-normal placeholder:text-muted/80",
                    code && "font-mono text-[0.9375rem] leading-relaxed break-all",
                    className,
                )}
                {...props}
            />
            {(stats || meta) && (
                <div className="flex min-h-9 flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/70 px-4 py-1.5 text-xs text-muted tabular-nums">
                    {meta}
                    {stats && <Counts value={value} locale={locale} />}
                </div>
            )}
        </div>
    );
}

const encoder = new TextEncoder();

function Counts({ value, locale }: { value: string; locale: Locale }) {
    const format = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en");
    const characters = [...value].length;
    const bytes = value.length > 2_000_000 ? null : encoder.encode(value).length;
    const words =
        locale === "fa"
            ? { characters: "نویسه", bytes: "بایت" }
            : {
                  characters: characters === 1 ? "character" : "characters",
                  bytes: bytes === 1 ? "byte" : "bytes",
              };
    return (
        <span className="ms-auto flex gap-3" aria-live="off">
            <span>
                {format.format(characters)} {words.characters}
            </span>
            {bytes !== null && (
                <span>
                    {format.format(bytes)} {words.bytes}
                </span>
            )}
        </span>
    );
}
