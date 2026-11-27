import { useId, useMemo, useState } from "react";
import { toToolError, type ToolResult } from "@handyweb/core/runtime";
import { CopyButton, ErrorMessage, Ltr, type ToolUiProps } from "@handyweb/core/ui";
import { strings } from "./i18n";
import { contrastRatio, formatColor, parseColor, type ColorFormats, type Rgba } from "./logic";

const ROWS: Array<keyof ColorFormats> = ["hex", "rgb", "hsl", "hwb", "oklch", "cmyk"];
const WHITE: Rgba = { r: 255, g: 255, b: 255, a: 1 };
const BLACK: Rgba = { r: 0, g: 0, b: 0, a: 1 };

export default function ColorConverter({ locale }: ToolUiProps) {
    const [text, setText] = useState("");
    const inputId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];
    const number = (n: number) =>
        new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en", {
            maximumFractionDigits: 2,
        }).format(n);

    const result = useMemo((): ToolResult<{ color: Rgba; formats: ColorFormats }> | null => {
        if (text.trim() === "") return null;
        try {
            const color = parseColor(text);
            return { ok: true, value: { color, formats: formatColor(color) } };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [text]);
    const value = result?.ok ? result.value : null;
    const rating = (ratio: number) =>
        ratio >= 4.5 ? t("pass") : ratio >= 3 ? t("large") : t("failText");

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
                <label htmlFor={inputId} className="text-xs font-semibold text-muted">
                    {t("color")}
                </label>
                <div className="flex gap-2">
                    <input
                        id={inputId}
                        dir="ltr"
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        autoComplete="off"
                        spellCheck={false}
                        placeholder="#bc4a3c"
                        aria-describedby={`${inputId}-hint`}
                        className="min-h-12 w-0 min-w-0 flex-1 rounded-xl border border-border bg-surface-2/60 px-4 font-mono text-base text-text outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]"
                        data-tool-input=""
                    />
                    <input
                        type="color"
                        aria-label={t("picker")}
                        value={value ? value.formats.hex.slice(0, 7) : "#bc4a3c"}
                        onChange={(event) => setText(event.target.value)}
                        className="h-12 w-14 shrink-0 cursor-pointer rounded-xl border border-border bg-surface-2"
                    />
                </div>
                <p id={`${inputId}-hint`} className="text-xs text-muted">
                    {t("hint")}
                </p>
            </div>
            {result && !result.ok && <ErrorMessage error={result.error} locale={locale} />}
            {value && (
                <section className="overflow-hidden rounded-2xl border border-border bg-bg">
                    <div
                        className="h-24 border-b border-border/70"
                        style={{ background: value.formats.rgb }}
                        data-tool-swatch
                    />
                    <dl className="divide-y divide-border/50">
                        {ROWS.map((row) => (
                            <div key={row} className="flex items-center gap-3 px-4 py-2">
                                <dt className="w-16 shrink-0 text-xs font-semibold text-muted uppercase">
                                    {row}
                                </dt>
                                <dd className="min-w-0 flex-1" data-format={row}>
                                    <Ltr as="code" className="font-mono break-all">
                                        {value.formats[row]}
                                    </Ltr>
                                </dd>
                                <CopyButton text={value.formats[row]} locale={locale} compact />
                            </div>
                        ))}
                    </dl>
                    <div className="grid gap-3 border-t border-border/70 px-4 py-3 sm:grid-cols-2">
                        {(
                            [
                                ["onWhite", WHITE, "#ffffff"],
                                ["onBlack", BLACK, "#000000"],
                            ] as const
                        ).map(([key, background, css]) => {
                            const ratio = contrastRatio(value.color, background);
                            return (
                                <div key={key} className="flex items-center gap-3">
                                    <span
                                        className="grid size-12 shrink-0 place-items-center rounded-lg border border-border text-lg font-bold"
                                        style={{ background: css, color: value.formats.rgb }}
                                        aria-hidden="true"
                                    >
                                        Aa
                                    </span>
                                    <div className="text-sm">
                                        <p className="font-semibold">
                                            {t(key)}: {number(ratio)}:1
                                        </p>
                                        <p className="text-xs text-muted">{rating(ratio)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
            <input type="hidden" value={value?.formats.hex ?? ""} readOnly data-tool-output="" />
        </div>
    );
}
