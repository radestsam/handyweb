import { useId, useMemo, useState } from "react";
import { toToolError, type ToolResult } from "@handyweb/core/runtime";
import {
    Checkbox,
    CopyButton,
    ErrorMessage,
    Ltr,
    Segmented,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { numberBaseMeta } from "./meta";
import { strings } from "./i18n";
import {
    bitLength,
    formatNumber,
    MAX_BASE,
    MIN_BASE,
    parseNumber,
    type ParsedNumber,
} from "./logic";

type FromChoice = "auto" | "2" | "8" | "10" | "16" | "other";

const MAX = numberBaseMeta.limits?.maxInputBytes ?? Infinity;
const FIELD =
    "min-h-11 rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";

export default function NumberBase({ locale, presetOptions }: ToolUiProps) {
    const presetFrom = presetOptions?.["from"];
    const [text, setText] = useState("");
    const [from, setFrom] = useState<FromChoice>(
        presetFrom === "2" || presetFrom === "16" ? presetFrom : "auto",
    );
    const [otherBase, setOtherBase] = useState("36");
    const [targetBase, setTargetBase] = useState("36");
    const [uppercase, setUppercase] = useState(true);
    const [group, setGroup] = useState(false);
    const inputId = useId();
    const otherId = useId();
    const targetId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];

    const result = useMemo((): ToolResult<ParsedNumber> | null => {
        if (text.trim() === "") return null;
        if (text.length > MAX) {
            return { ok: false, error: { code: "too-large", message: strings.tooLarge } };
        }
        try {
            const base =
                from === "auto" ? "auto" : from === "other" ? Number(otherBase) : Number(from);
            return { ok: true, value: parseNumber(text, base) };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [text, from, otherBase]);

    const parsed = result?.ok ? result.value : null;
    const options = { uppercase, group };
    const target = Number(targetBase);
    const targetValid = Number.isInteger(target) && target >= MIN_BASE && target <= MAX_BASE;
    const rows: Array<{ key: string; label: string; value: string }> = parsed
        ? [
              { key: "2", label: t("binary"), value: formatNumber(parsed.value, 2, options) },
              { key: "8", label: t("octal"), value: formatNumber(parsed.value, 8, options) },
              { key: "10", label: t("decimal"), value: formatNumber(parsed.value, 10, options) },
              { key: "16", label: t("hex"), value: formatNumber(parsed.value, 16, options) },
          ]
        : [];
    const number = (n: number) => new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en").format(n);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
                <label htmlFor={inputId} className="text-xs font-semibold text-muted">
                    {t("input")}
                </label>
                <input
                    id={inputId}
                    dir="ltr"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                    autoCapitalize="off"
                    className={`${FIELD} min-h-12 w-full px-4 font-mono`}
                    data-tool-input=""
                />
            </div>

            <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                <Segmented<FromChoice>
                    legend={t("from")}
                    value={from}
                    onChange={setFrom}
                    options={[
                        { value: "auto", label: t("auto") },
                        { value: "2", label: "2" },
                        { value: "8", label: "8" },
                        { value: "10", label: "10" },
                        { value: "16", label: "16" },
                        { value: "other", label: t("other") },
                    ]}
                />
                {from === "other" && (
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor={otherId} className="text-xs font-semibold text-muted">
                            {t("otherBase")}
                        </label>
                        <input
                            id={otherId}
                            type="number"
                            dir="ltr"
                            min={MIN_BASE}
                            max={MAX_BASE}
                            value={otherBase}
                            onChange={(event) => setOtherBase(event.target.value)}
                            className={`${FIELD} w-24 tabular-nums`}
                        />
                    </div>
                )}
            </div>
            {from === "auto" && <p className="-mt-3 text-xs text-muted">{t("autoHint")}</p>}

            <div className="flex flex-wrap gap-x-6 gap-y-1">
                <Checkbox label={t("uppercase")} checked={uppercase} onChange={setUppercase} />
                <Checkbox label={t("group")} checked={group} onChange={setGroup} />
            </div>

            {result && !result.ok && <ErrorMessage error={result.error} locale={locale} />}

            {parsed && (
                <section className="overflow-hidden rounded-2xl border border-border bg-bg">
                    <p
                        className="border-b border-border/70 px-4 py-2.5 text-xs text-muted"
                        data-tool-meta
                    >
                        {t("readAs")} {number(parsed.base)} · {number(bitLength(parsed.value))}{" "}
                        {t("bits")}
                    </p>
                    <dl className="divide-y divide-border/50">
                        {rows.map((row) => (
                            <div key={row.key} className="flex items-center gap-3 px-4 py-2.5">
                                <dt className="w-28 shrink-0 text-xs text-muted">{row.label}</dt>
                                <dd className="min-w-0 flex-1" data-base={row.key}>
                                    <Ltr as="code" className="font-mono break-all">
                                        {row.value}
                                    </Ltr>
                                </dd>
                                <CopyButton text={row.value} locale={locale} compact />
                            </div>
                        ))}
                        <div className="flex flex-wrap items-center gap-3 px-4 py-2.5">
                            <dt className="flex w-28 shrink-0 flex-col gap-1">
                                <label htmlFor={targetId} className="text-xs text-muted">
                                    {t("target")}
                                </label>
                                <input
                                    id={targetId}
                                    type="number"
                                    dir="ltr"
                                    min={MIN_BASE}
                                    max={MAX_BASE}
                                    value={targetBase}
                                    onChange={(event) => setTargetBase(event.target.value)}
                                    className={`${FIELD} min-h-9 w-20 tabular-nums`}
                                />
                            </dt>
                            <dd className="min-w-0 flex-1" data-base="target">
                                {targetValid && (
                                    <Ltr as="code" className="font-mono break-all">
                                        {formatNumber(parsed.value, target, options)}
                                    </Ltr>
                                )}
                            </dd>
                            {targetValid && (
                                <CopyButton
                                    text={formatNumber(parsed.value, target, options)}
                                    locale={locale}
                                    compact
                                />
                            )}
                        </div>
                    </dl>
                </section>
            )}
            <input
                type="hidden"
                value={
                    parsed ? formatNumber(parsed.value, 16, { uppercase: false, group: false }) : ""
                }
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
