import { useId, useMemo, useState } from "react";
import { toToolError, type ToolResult } from "@handyweb/core/runtime";
import { CopyButton, ErrorMessage, Ltr, type ToolUiProps } from "@handyweb/core/ui";
import { fieldLabels, strings } from "./i18n";
import { describe, FIELDS, nextRuns, parseCron, type Cron } from "./logic";

export default function CronParser({ locale }: ToolUiProps) {
    const [text, setTextState] = useState("");
    // The clock is read when the expression changes, not on each render.
    const [now, setNow] = useState(() => Date.now());
    const inputId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];
    const setText = (value: string) => {
        setNow(Date.now());
        setTextState(value);
    };

    const result = useMemo((): ToolResult<Cron> | null => {
        if (text.trim() === "") return null;
        try {
            return { ok: true, value: parseCron(text) };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [text]);
    const cron = result?.ok ? result.value : null;
    const meaning = cron ? describe(cron, locale) : "";
    const runs = useMemo(() => (cron ? nextRuns(cron, new Date(now), 10) : []), [cron, now]);
    const date = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en", {
        dateStyle: "full",
        timeStyle: "short",
    });

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
                <label htmlFor={inputId} className="text-xs font-semibold text-muted">
                    {t("expression")}
                </label>
                <input
                    id={inputId}
                    dir="ltr"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="*/15 9-17 * * 1-5"
                    aria-describedby={`${inputId}-hint`}
                    className="min-h-12 w-full rounded-xl border border-border bg-surface-2/60 px-4 font-mono text-lg text-text outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]"
                    data-tool-input=""
                />
                <p id={`${inputId}-hint`} className="text-xs text-muted">
                    {t("hint")}{" "}
                    <Ltr as="code" className="font-mono">
                        */15 9-17 * * 1-5
                    </Ltr>
                </p>
            </div>
            {result && !result.ok && <ErrorMessage error={result.error} locale={locale} />}
            {cron && (
                <>
                    <section className="overflow-hidden rounded-2xl border border-border bg-bg">
                        <div className="flex min-h-11 items-center justify-between gap-2 border-b border-border/70 ps-4 pe-1.5">
                            <h2 className="text-xs font-semibold text-muted">{t("meaning")}</h2>
                            <CopyButton text={meaning} locale={locale} compact />
                        </div>
                        <p className="px-4 py-4 text-lg font-semibold" data-tool-meaning>
                            {meaning}
                        </p>
                        <dl className="grid grid-cols-5 gap-px border-t border-border/70 bg-border/70 text-center">
                            {FIELDS.map((field) => (
                                <div key={field} className="flex flex-col gap-0.5 bg-bg px-1 py-2">
                                    <dt className="text-[0.7rem] text-muted">
                                        {fieldLabels[field][locale]}
                                    </dt>
                                    <dd>
                                        <Ltr as="code" className="font-mono text-sm break-all">
                                            {cron[field].source}
                                        </Ltr>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                    <section className="overflow-hidden rounded-2xl border border-border bg-bg">
                        <h2 className="border-b border-border/70 px-4 py-2.5 text-xs font-semibold text-muted">
                            {t("next")} · {t("zone")}
                        </h2>
                        {runs.length === 0 ? (
                            <p className="px-4 py-3 text-muted">{t("none")}</p>
                        ) : (
                            <ol className="divide-y divide-border/50 text-sm" data-tool-runs>
                                {runs.map((run) => (
                                    <li key={run.getTime()} className="px-4 py-2">
                                        {date.format(run)}
                                    </li>
                                ))}
                            </ol>
                        )}
                    </section>
                </>
            )}
            <input type="hidden" value={meaning} readOnly data-tool-output="" />
        </div>
    );
}
