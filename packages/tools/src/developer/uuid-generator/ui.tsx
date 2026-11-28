import { useId, useMemo, useState } from "react";
import { toToolError, type ToolResult } from "@handyweb/core/runtime";
import {
    Button,
    Checkbox,
    CopyButton,
    ErrorMessage,
    Ltr,
    Pane,
    Segmented,
    type ToolUiProps,
    useClient,
} from "@handyweb/core/ui";
import { kindLabels, strings, variantLabels } from "./i18n";
import { ID_KINDS, MAX_COUNT, generateIds, inspectId, type IdKind, type Inspection } from "./logic";

const FIELD =
    "min-h-11 rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";

export default function UuidGenerator({ locale, presetOptions }: ToolUiProps) {
    const preset = presetOptions?.["kind"];
    const [kind, setKind] = useState<IdKind>(ID_KINDS.find((value) => value === preset) ?? "v4");
    const [count, setCount] = useState("1");
    const [uppercase, setUppercase] = useState(false);
    const [hyphens, setHyphens] = useState(true);
    // The clock and a fresh draw are taken on each request, not on each render.
    const [draw, setDraw] = useState(() => ({ now: Date.now(), round: 0 }));
    const [probe, setProbe] = useState("");
    const countId = useId();
    const probeId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];
    const redraw = () => setDraw({ now: Date.now(), round: draw.round + 1 });

    // The IDs are drawn in the browser only, so the static HTML holds none.
    const client = useClient();
    const result = useMemo((): ToolResult<string> => {
        if (!client) return { ok: true, value: "" };
        try {
            return {
                ok: true,
                value: generateIds(kind, Number(count), draw.now, { uppercase, hyphens }),
            };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [client, kind, count, uppercase, hyphens, draw]);

    const inspection = useMemo((): ToolResult<Inspection> | null => {
        if (probe.trim() === "") return null;
        try {
            return { ok: true, value: inspectId(probe) };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [probe]);

    const date = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en", {
        dateStyle: "full",
        timeStyle: "medium",
    });
    const output = result.ok ? result.value : "";
    const info = inspection?.ok ? inspection.value : null;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                <Segmented<IdKind>
                    legend={t("kind")}
                    value={kind}
                    onChange={(next) => {
                        setKind(next);
                        redraw();
                    }}
                    options={ID_KINDS.map((value) => ({ value, label: kindLabels[value][locale] }))}
                />
                <div className="flex flex-col gap-1.5">
                    <label htmlFor={countId} className="text-xs font-semibold text-muted">
                        {t("count")}
                    </label>
                    <input
                        id={countId}
                        type="number"
                        dir="ltr"
                        inputMode="numeric"
                        min={1}
                        max={MAX_COUNT}
                        value={count}
                        onChange={(event) => {
                            setCount(event.target.value);
                            redraw();
                        }}
                        className={`${FIELD} w-24 tabular-nums`}
                        data-tool-input=""
                    />
                </div>
                {kind !== "ulid" && (
                    <div className="flex flex-wrap gap-x-5 gap-y-1 pb-1">
                        <Checkbox
                            label={t("uppercase")}
                            checked={uppercase}
                            onChange={setUppercase}
                        />
                        <Checkbox label={t("hyphens")} checked={hyphens} onChange={setHyphens} />
                    </div>
                )}
            </div>

            {!result.ok && <ErrorMessage error={result.error} locale={locale} />}

            <Pane
                label={t("output")}
                locale={locale}
                code
                readOnly
                stats={false}
                value={output}
                className="min-h-28"
                actions={<CopyButton text={output} locale={locale} compact />}
                data-tool-output=""
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted">{t("note")}</p>
                <Button variant="primary" onClick={redraw}>
                    {t("regenerate")}
                </Button>
            </div>

            <section className="flex flex-col gap-3 rounded-2xl border border-border bg-bg p-4">
                <label htmlFor={probeId} className="text-sm font-semibold">
                    {t("inspect")}
                </label>
                <input
                    id={probeId}
                    dir="ltr"
                    value={probe}
                    onChange={(event) => setProbe(event.target.value)}
                    placeholder={t("inspectPlaceholder")}
                    autoComplete="off"
                    spellCheck={false}
                    className={`${FIELD} font-mono text-sm placeholder:font-sans`}
                />
                {inspection && !inspection.ok && (
                    <ErrorMessage error={inspection.error} locale={locale} />
                )}
                {info && (
                    <dl
                        className="grid gap-x-4 gap-y-2 text-sm sm:grid-cols-[auto_1fr]"
                        data-tool-inspect
                    >
                        <dt className="text-muted">{t("type")}</dt>
                        <dd data-field="type">
                            {info.special
                                ? t(info.special)
                                : info.kind === "ulid"
                                  ? "ULID"
                                  : `UUID v${info.version}`}
                        </dd>
                        {info.variant && (
                            <>
                                <dt className="text-muted">{t("variant")}</dt>
                                <dd>{variantLabels[info.variant][locale]}</dd>
                            </>
                        )}
                        {info.timeMs !== null && (
                            <>
                                <dt className="text-muted">{t("time")}</dt>
                                <dd data-field="time">
                                    {date.format(new Date(info.timeMs))}{" "}
                                    <Ltr className="text-xs text-muted">({info.timeMs} ms)</Ltr>
                                </dd>
                            </>
                        )}
                        <dt className="text-muted">{t("canonical")}</dt>
                        <dd>
                            <Ltr as="code" className="font-mono break-all">
                                {info.canonical}
                            </Ltr>
                        </dd>
                    </dl>
                )}
            </section>
        </div>
    );
}
