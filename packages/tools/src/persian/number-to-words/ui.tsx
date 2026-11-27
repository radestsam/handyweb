import { useId, useMemo, useState } from "react";
import { toToolError, type ToolResult } from "@handyweb/core/runtime";
import {
    Checkbox,
    CopyButton,
    ErrorMessage,
    Segmented,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { strings } from "./i18n";
import { numberToWords, type Unit } from "./logic";

export default function NumberToWords({ locale, presetOptions }: ToolUiProps) {
    const [text, setText] = useState("");
    const [ordinal, setOrdinal] = useState(false);
    const [unit, setUnit] = useState<Unit>(
        presetOptions?.["unit"] === "toman" || presetOptions?.["unit"] === "rial"
            ? presetOptions["unit"]
            : "none",
    );
    const inputId = useId();
    const outputId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];

    const result = useMemo((): ToolResult<string> | null => {
        if (text.trim() === "") return null;
        try {
            return { ok: true, value: numberToWords(text, { ordinal, unit }) };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [text, ordinal, unit]);
    const output = result?.ok ? result.value : "";

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
                <label htmlFor={inputId} className="text-xs font-semibold text-muted">
                    {t("number")}
                </label>
                <input
                    id={inputId}
                    dir="ltr"
                    inputMode="decimal"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    autoComplete="off"
                    aria-describedby={`${inputId}-hint`}
                    className="min-h-12 w-full rounded-xl border border-border bg-surface-2/60 px-4 text-lg tabular-nums text-text outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]"
                    data-tool-input=""
                />
                <p id={`${inputId}-hint`} className="text-xs text-muted">
                    {t("hint")}
                </p>
            </div>
            <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                <Segmented<Unit>
                    legend={t("unit")}
                    value={unit}
                    onChange={setUnit}
                    options={(["none", "rial", "toman"] as const).map((value) => ({
                        value,
                        label: t(value),
                    }))}
                />
                <div className="pb-1">
                    <Checkbox label={t("ordinal")} checked={ordinal} onChange={setOrdinal} />
                </div>
            </div>
            {result && !result.ok && <ErrorMessage error={result.error} locale={locale} />}
            <section
                className="overflow-hidden rounded-2xl border border-border bg-bg"
                aria-labelledby={outputId}
            >
                <div className="flex min-h-11 items-center justify-between gap-2 border-b border-border/70 ps-4 pe-1.5">
                    <span id={outputId} className="text-xs font-semibold text-muted">
                        {t("words")}
                    </span>
                    <CopyButton text={output} locale={locale} compact />
                </div>
                <p
                    dir="rtl"
                    lang="fa"
                    className="min-h-20 px-4 py-5 text-xl leading-loose font-semibold sm:text-2xl"
                    data-tool-words
                >
                    {output || (
                        <span dir="auto" className="text-base font-normal text-muted">
                            {UI_STRINGS.outputHere[locale]}
                        </span>
                    )}
                </p>
                <input type="hidden" value={output} readOnly data-tool-output="" />
            </section>
        </div>
    );
}
