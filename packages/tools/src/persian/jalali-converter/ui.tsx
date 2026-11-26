import { useId, useMemo, useState } from "react";
import { isLeapJalaaliYear } from "jalaali-js";
import { toToolError, type ToolResult } from "@handyweb/core/runtime";
import {
    Button,
    CopyButton,
    ErrorMessage,
    Icon,
    Segmented,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { strings } from "./i18n";
import {
    convert,
    formatNumeric,
    GREGORIAN_MONTHS,
    gregorianToJalali,
    isGregorianLeap,
    JALALI_MONTHS,
    todayGregorian,
    WEEKDAYS,
    type Conversion,
    type Direction,
} from "./logic";

export default function JalaliConverter({ locale, presetOptions }: ToolUiProps) {
    const [direction, setDirection] = useState<Direction>(
        presetOptions?.["direction"] === "to-jalali" ? "to-jalali" : "to-gregorian",
    );
    const [text, setText] = useState("");
    const inputId = useId();
    const outputId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];
    const number = (n: number) =>
        new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en", { useGrouping: false }).format(n);

    const result = useMemo((): ToolResult<Conversion> | null => {
        if (text.trim() === "") return null;
        try {
            return { ok: true, value: convert(text, direction) };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [text, direction]);

    const today = () => {
        const gregorian = todayGregorian();
        setText(
            formatNumeric(direction === "to-jalali" ? gregorian : gregorianToJalali(gregorian)),
        );
    };

    const swap = () => {
        if (result?.ok) {
            setText(
                formatNumeric(
                    direction === "to-gregorian" ? result.value.gregorian : result.value.jalali,
                ),
            );
        }
        setDirection(direction === "to-gregorian" ? "to-jalali" : "to-gregorian");
    };

    const value = result?.ok ? result.value : null;
    const target = value ? (direction === "to-gregorian" ? value.gregorian : value.jalali) : null;
    const output = target ? formatNumeric(target) : "";
    const long = value
        ? direction === "to-gregorian"
            ? `${WEEKDAYS[locale][value.weekday]}، ${number(value.gregorian.day)} ${GREGORIAN_MONTHS[locale][value.gregorian.month - 1]} ${number(value.gregorian.year)}`
            : `${WEEKDAYS[locale][value.weekday]}، ${number(value.jalali.day)} ${JALALI_MONTHS[locale][value.jalali.month - 1]} ${number(value.jalali.year)}`
        : "";
    const longText = locale === "en" ? long.replace("،", ",") : long;
    const leap = target
        ? direction === "to-gregorian"
            ? isGregorianLeap(target.year)
            : isLeapJalaaliYear(target.year)
        : false;

    return (
        <div className="flex flex-col gap-5">
            <Segmented<Direction>
                legend={t("direction")}
                value={direction}
                onChange={setDirection}
                options={[
                    { value: "to-gregorian", label: t("toGregorian") },
                    { value: "to-jalali", label: t("toJalali") },
                ]}
            />

            <div className="flex flex-col gap-1.5">
                <label htmlFor={inputId} className="text-sm font-semibold">
                    {direction === "to-gregorian" ? t("jalaliDate") : t("gregorianDate")}
                </label>
                <div className="flex gap-2">
                    <input
                        id={inputId}
                        dir="ltr"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder={direction === "to-gregorian" ? "1404/09/05" : "2025/11/26"}
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        className="min-h-12 w-0 min-w-0 flex-1 rounded-xl sm:w-60 sm:flex-none border border-border bg-surface-2/60 px-4 text-lg tabular-nums text-text outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]"
                        aria-describedby={`${inputId}-hint`}
                        data-tool-input=""
                    />
                    <Button onClick={today}>{t("today")}</Button>
                    <Button
                        onClick={swap}
                        aria-label={t("swapDirection")}
                        title={t("swapDirection")}
                    >
                        <Icon name="swap" />
                    </Button>
                </div>
                <p id={`${inputId}-hint`} className="text-xs text-muted">
                    {t("hint")}
                </p>
            </div>

            {result && !result.ok && <ErrorMessage error={result.error} locale={locale} />}

            <section
                className="overflow-hidden rounded-2xl border border-border bg-bg"
                aria-labelledby={outputId}
            >
                <div className="flex min-h-11 items-center justify-between gap-2 border-b border-border/70 ps-4 pe-1.5">
                    <span id={outputId} className="text-xs font-semibold text-muted">
                        {t("result")}
                    </span>
                    <CopyButton text={output} locale={locale} compact />
                </div>
                <div className="px-4 py-6 sm:px-6">
                    {value ? (
                        <>
                            <p className="text-2xl font-bold sm:text-3xl" data-tool-long>
                                {longText}
                            </p>
                            <p className="mt-2 flex flex-wrap items-center gap-x-3 text-sm text-muted">
                                <span dir="ltr" className="font-mono">
                                    {output}
                                </span>
                                {leap && <span>{t("leap")}</span>}
                            </p>
                        </>
                    ) : (
                        <p className="text-muted">{UI_STRINGS.outputHere[locale]}</p>
                    )}
                </div>
                <input type="hidden" value={output} readOnly data-tool-output="" />
            </section>
        </div>
    );
}
