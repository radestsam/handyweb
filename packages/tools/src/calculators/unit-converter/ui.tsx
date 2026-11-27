import { useId, useState } from "react";
import { toToolError } from "@handyweb/core/runtime";
import { CopyButton, ErrorMessage, Ltr, type ToolUiProps } from "@handyweb/core/ui";
import { strings } from "./i18n";
import { convert, findKind, formatAmount, parseAmount, plainAmount } from "./logic";
import { KINDS } from "./units";

const FIELD =
    "min-h-11 w-full rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";

export default function UnitConverter({ locale, presetOptions }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const [kindId, setKindId] = useState(findKind(presetOptions?.["kind"]).id);
    const kind = findKind(kindId);
    const [fromId, setFromId] = useState(() => {
        const preset = presetOptions?.["from"];
        return kind.units.find((u) => u.id === preset)?.id ?? (kind.units[0]?.id as string);
    });
    const [text, setText] = useState("1");
    const ids = { kind: useId(), value: useId(), from: useId() };
    const from = kind.units.find((u) => u.id === fromId) ?? kind.units[0];

    let value: number | null = null;
    let error = null;
    if (text.trim() !== "") {
        try {
            value = parseAmount(text);
        } catch (caught) {
            error = toToolError(caught);
        }
    }

    const changeKind = (id: string) => {
        setKindId(id);
        setFromId(findKind(id).units[0]?.id as string);
    };

    const rows =
        value !== null && from
            ? kind.units
                  .filter((unit) => unit.id !== from.id)
                  .map((unit) => ({ unit, result: convert(value as number, kind, from, unit) }))
            : [];

    return (
        <div className="flex flex-col gap-5">
            <div className="grid gap-3 sm:grid-cols-3">
                <label
                    htmlFor={ids.kind}
                    className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
                >
                    {t("kind")}
                    <select
                        id={ids.kind}
                        value={kind.id}
                        onChange={(event) => changeKind(event.target.value)}
                        className={FIELD}
                        data-unit-kind=""
                    >
                        {KINDS.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.label[locale]}
                            </option>
                        ))}
                    </select>
                </label>
                <label
                    htmlFor={ids.value}
                    className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
                >
                    {t("value")}
                    <input
                        id={ids.value}
                        inputMode="decimal"
                        dir="ltr"
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        className={FIELD}
                        autoComplete="off"
                        data-tool-input=""
                    />
                </label>
                <label
                    htmlFor={ids.from}
                    className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
                >
                    {t("from")}
                    <select
                        id={ids.from}
                        value={from?.id}
                        onChange={(event) => setFromId(event.target.value)}
                        className={FIELD}
                        data-unit-from=""
                    >
                        {kind.units.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                                {unit.label[locale]} ({unit.symbol})
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            {error && <ErrorMessage error={error} locale={locale} />}
            {rows.length > 0 && (
                <section
                    className="overflow-hidden rounded-2xl border border-border bg-bg"
                    aria-live="polite"
                >
                    <h2 className="border-b border-border/70 px-4 py-2.5 text-sm font-semibold">
                        {t("results")}
                    </h2>
                    <ul className="divide-y divide-border/50 text-sm" data-unit-results="">
                        {rows.map(({ unit, result }) => (
                            <li
                                key={unit.id}
                                className="flex items-center gap-3 px-4 py-1.5"
                                data-unit={unit.id}
                            >
                                <span className="min-w-0 flex-1">{unit.label[locale]}</span>
                                <span className="font-semibold tabular-nums" data-unit-value="">
                                    {formatAmount(result, locale)}
                                </span>
                                <Ltr className="w-14 text-xs text-muted">{unit.symbol}</Ltr>
                                <CopyButton text={plainAmount(result)} locale={locale} compact />
                            </li>
                        ))}
                    </ul>
                </section>
            )}
            <p className="text-xs text-muted">{t("note")}</p>
            <input
                type="hidden"
                value={rows.map((row) => `${row.unit.id}=${plainAmount(row.result)}`).join(";")}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
