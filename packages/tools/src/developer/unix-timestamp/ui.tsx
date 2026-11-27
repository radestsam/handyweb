import { useId, useMemo, useState } from "react";
import { toToolError, type ToolResult } from "@handyweb/core/runtime";
import {
    Button,
    CopyButton,
    ErrorMessage,
    Ltr,
    Segmented,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { strings } from "./i18n";
import { parseInput, relative, type Parsed, type UnitChoice, type Zone } from "./logic";

const EXAMPLES = {
    fa: ["1732700000", "1732700000000", "2025-11-27 10:30", "۱۴۰۴/۰۹/۰۶ ۱۰:۳۰"],
    en: ["1732700000", "1732700000000", "2025-11-27 10:30", "1404/09/06 10:30"],
} as const;

const UNIT_LABELS: Record<Exclude<UnitChoice, "auto">, string> = {
    s: "s",
    ms: "ms",
    us: "µs",
    ns: "ns",
};

export default function UnixTimestamp({ locale }: ToolUiProps) {
    const [text, setTextState] = useState("");
    const [unit, setUnit] = useState<UnitChoice>("auto");
    const [zone, setZone] = useState<Zone>("local");
    // The clock is read when the input changes, for the "from now" line.
    const [now, setNow] = useState(() => Date.now());
    const inputId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];
    const setText = (value: string) => {
        setNow(Date.now());
        setTextState(value);
    };

    const result = useMemo((): ToolResult<Parsed> | null => {
        if (text.trim() === "") return null;
        try {
            return { ok: true, value: parseInput(text, unit, zone) };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [text, unit, zone]);

    const parsed = result?.ok ? result.value : null;
    const tag = locale === "fa" ? "fa-IR" : "en";
    const rows: Array<{ key: keyof typeof strings; value: string; code?: boolean }> = [];
    if (parsed) {
        const date = new Date(parsed.ms);
        const zoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const full = { dateStyle: "full", timeStyle: "long" } as const;
        const rel = relative(parsed.ms, now);
        rows.push(
            { key: "unixSeconds", value: String(Math.floor(parsed.ms / 1000)), code: true },
            { key: "unixMs", value: String(parsed.ms), code: true },
            { key: "iso", value: date.toISOString(), code: true },
            {
                key: "jalaliTime",
                value: new Intl.DateTimeFormat(`${tag}-u-ca-persian`, full).format(date),
            },
            {
                key: "gregorianTime",
                value: new Intl.DateTimeFormat(`${tag}-u-ca-gregory`, full).format(date),
            },
            { key: "zoneName", value: zoneName, code: true },
            {
                key: "relative",
                value: new Intl.RelativeTimeFormat(tag, { numeric: "auto" }).format(
                    rel.value,
                    rel.unit,
                ),
            },
        );
    }
    const unitName = parsed?.unit
        ? {
              s: t("seconds"),
              ms: t("milliseconds"),
              us: t("microseconds"),
              ns: t("nanoseconds"),
          }[parsed.unit]
        : parsed
          ? parsed.jalali
              ? t("jalaliDate")
              : t("gregorianDate")
          : "";

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
                <label htmlFor={inputId} className="text-xs font-semibold text-muted">
                    {t("input")}
                </label>
                <div className="flex gap-2">
                    <input
                        id={inputId}
                        dir="ltr"
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        autoComplete="off"
                        spellCheck={false}
                        aria-describedby={`${inputId}-hint`}
                        className="min-h-12 w-0 min-w-0 flex-1 rounded-xl border border-border bg-surface-2/60 px-4 font-mono text-base text-text outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]"
                        data-tool-input=""
                    />
                    <Button onClick={() => setText(String(Math.floor(Date.now() / 1000)))}>
                        {t("now")}
                    </Button>
                </div>
                <p
                    id={`${inputId}-hint`}
                    className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted"
                >
                    {t("hint")}
                    {EXAMPLES[locale].map((example) => (
                        <Ltr key={example} as="code" className="font-mono">
                            {example}
                        </Ltr>
                    ))}
                </p>
            </div>

            <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                <Segmented<UnitChoice>
                    legend={t("unit")}
                    value={unit}
                    onChange={setUnit}
                    options={[
                        { value: "auto", label: t("auto") },
                        ...(["s", "ms", "us", "ns"] as const).map((value) => ({
                            value,
                            label: UNIT_LABELS[value],
                        })),
                    ]}
                />
                <Segmented<Zone>
                    legend={t("zone")}
                    value={zone}
                    onChange={setZone}
                    options={[
                        { value: "local", label: t("local") },
                        { value: "utc", label: t("utc") },
                    ]}
                />
            </div>

            {result && !result.ok && <ErrorMessage error={result.error} locale={locale} />}

            {parsed && (
                <section className="overflow-hidden rounded-2xl border border-border bg-bg">
                    <p
                        className="border-b border-border/70 px-4 py-2.5 text-xs text-muted"
                        data-tool-detected
                    >
                        {t("detected")}: <span className="font-semibold text-text">{unitName}</span>
                    </p>
                    <dl className="divide-y divide-border/50">
                        {rows.map((row) => (
                            <div
                                key={row.key}
                                className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5"
                            >
                                <dt className="w-36 shrink-0 text-xs text-muted">{t(row.key)}</dt>
                                <dd className="min-w-0 flex-1 break-words" data-row={row.key}>
                                    {row.code ? (
                                        <Ltr as="code" className="font-mono">
                                            {row.value}
                                        </Ltr>
                                    ) : (
                                        row.value
                                    )}
                                </dd>
                                <CopyButton text={row.value} locale={locale} compact />
                            </div>
                        ))}
                    </dl>
                </section>
            )}
            <input
                type="hidden"
                value={parsed ? new Date(parsed.ms).toISOString() : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
