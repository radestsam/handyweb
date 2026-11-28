import { useId, useState } from "react";
import { toToolError } from "@handyweb/core/runtime";
import { Button, ErrorMessage, Ltr, type ToolUiProps } from "@handyweb/core/ui";
import { formatColor, parseColor, type Rgba } from "../../developer/color-converter/logic";
import { strings } from "./i18n";
import { check, flatten, suggest } from "./logic";

const FIELD =
    "min-h-11 w-full min-w-0 rounded-xl border border-border bg-surface-2/60 px-3 font-mono text-base text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";

function read(text: string): { color: Rgba | null; error: ReturnType<typeof toToolError> | null } {
    if (!text.trim()) return { color: null, error: null };
    try {
        return { color: parseColor(text), error: null };
    } catch (caught) {
        return { color: null, error: toToolError(caught) };
    }
}

export default function ColorContrast({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const [fg, setFg] = useState("");
    const [bg, setBg] = useState("#ffffff");
    const ids = { fg: useId(), bg: useId() };
    const f = read(fg);
    const b = read(bg);
    const result = f.color && b.color ? check(f.color, b.color) : null;
    const better =
        f.color && b.color && result && !result.normalAA
            ? suggest(flatten(f.color, { ...b.color, a: 1 }), b.color, 4.5)
            : null;
    const hex = (color: Rgba) => formatColor(color).hex.slice(0, 7);

    const field = (
        id: string,
        label: string,
        value: string,
        set: (value: string) => void,
        color: Rgba | null,
        extra?: Record<string, string>,
    ) => (
        <label
            htmlFor={id}
            className="flex min-w-0 flex-col gap-1.5 text-xs font-semibold text-muted"
        >
            {label}
            <span className="flex items-center gap-2">
                <input
                    type="color"
                    aria-label={label}
                    value={color ? hex(color) : "#000000"}
                    onChange={(event) => set(event.target.value)}
                    className="h-11 w-12 shrink-0 rounded-lg border border-border"
                />
                <input
                    id={id}
                    dir="ltr"
                    autoComplete="off"
                    spellCheck={false}
                    value={value}
                    onChange={(event) => set(event.target.value)}
                    className={FIELD}
                    {...extra}
                />
            </span>
        </label>
    );

    const row = (label: string, aa: boolean, aaa: boolean | null) => (
        <div className="flex items-center justify-between gap-3 px-4 py-2">
            <dt className="text-sm">{label}</dt>
            <dd className="flex gap-2 text-xs font-semibold">
                <span className={aa ? "text-success" : "text-error"}>
                    AA {aa ? t("pass") : t("fail")}
                </span>
                {aaa !== null && (
                    <span className={aaa ? "text-success" : "text-error"}>
                        AAA {aaa ? t("pass") : t("fail")}
                    </span>
                )}
            </dd>
        </div>
    );

    return (
        <div className="flex flex-col gap-5">
            <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
                {field(ids.fg, t("foreground"), fg, setFg, f.color, {
                    "data-tool-input": "",
                    placeholder: "#777777",
                })}
                <Button
                    onClick={() => {
                        setFg(bg);
                        setBg(fg);
                    }}
                >
                    ⇄ {t("swap")}
                </Button>
                {field(ids.bg, t("background"), bg, setBg, b.color)}
            </div>
            {(f.error ?? b.error) && <ErrorMessage error={(f.error ?? b.error)!} locale={locale} />}
            {result && f.color && b.color && (
                <>
                    <div
                        className="rounded-2xl border border-border p-5 text-lg"
                        style={{
                            color: formatColor(f.color).rgb,
                            backgroundColor: formatColor({ ...b.color, a: 1 }).rgb,
                        }}
                    >
                        <p dir="auto">{t("sample")}</p>
                        <p dir="auto" className="mt-2 text-sm">
                            {t("sample")}
                        </p>
                    </div>
                    <section className="overflow-hidden rounded-2xl border border-border bg-bg">
                        <p className="border-b border-border/70 px-4 py-3">
                            <span className="text-xs text-muted">{t("ratio")}</span>{" "}
                            <span
                                className="text-2xl font-semibold tabular-nums"
                                data-contrast="ratio"
                            >
                                <Ltr>{`${(Math.floor(result.ratio * 100) / 100).toFixed(2)}:1`}</Ltr>
                            </span>
                        </p>
                        <dl className="divide-y divide-border/50">
                            {row(t("normal"), result.normalAA, result.normalAAA)}
                            {row(t("large"), result.largeAA, result.largeAAA)}
                            {row(t("ui"), result.ui, null)}
                        </dl>
                    </section>
                    {better && (
                        <p
                            className="flex flex-wrap items-center gap-2 text-sm"
                            data-contrast="suggestion"
                        >
                            {t("suggestion")}
                            <span
                                className="inline-block size-5 rounded border border-border"
                                style={{ backgroundColor: hex(better) }}
                            />
                            <Ltr as="code" className="font-mono">
                                {hex(better)}
                            </Ltr>
                            <Button onClick={() => setFg(hex(better))}>{t("use")}</Button>
                        </p>
                    )}
                </>
            )}
            <input
                type="hidden"
                value={result ? result.ratio.toFixed(2) : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
