import { useId, useState } from "react";
import { toToolError, type ToolError } from "@handyweb/core/runtime";
import { Button, ErrorMessage, Ltr, Segmented, type ToolUiProps } from "@handyweb/core/ui";
import {
    formatNumeric,
    gregorianToJalali,
    todayGregorian,
    weekday,
    jalaliToGregorian,
    WEEKDAYS,
    type SimpleDate,
} from "../../persian/jalali-converter/logic";
import { NumberField } from "../shared/NumberField";
import { formatAmount, parseAmount } from "../unit-converter/logic";
import { strings } from "./i18n";
import { addDays, difference, readDate, type Calendar } from "./logic";

const FIELD =
    "min-h-11 w-full rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text tabular-nums outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";

function today(calendar: Calendar): string {
    const date = todayGregorian();
    return formatNumeric(calendar === "jalali" ? gregorianToJalali(date) : date);
}

function attempt<T>(run: () => T): { value: T | null; error: ToolError | null } {
    try {
        return { value: run(), error: null };
    } catch (caught) {
        return { value: null, error: toToolError(caught) };
    }
}

export default function DateDifference({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const [calendar, setCalendar] = useState<Calendar>(locale === "fa" ? "jalali" : "gregorian");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState(() => today(locale === "fa" ? "jalali" : "gregorian"));
    const [base, setBase] = useState(() => today(locale === "fa" ? "jalali" : "gregorian"));
    const [count, setCount] = useState("100");
    const ids = { start: useId(), end: useId(), base: useId() };
    const n = (value: number) => formatAmount(value, locale);

    const changeCalendar = (next: Calendar) => {
        // Move the dates to the other calendar, so they stay the same days.
        const move = (text: string) => {
            try {
                const date = readDate(text, calendar);
                const gregorian = calendar === "jalali" ? jalaliToGregorian(date) : date;
                return formatNumeric(next === "jalali" ? gregorianToJalali(gregorian) : gregorian);
            } catch {
                return text;
            }
        };
        setStart(move(start));
        setEnd(move(end));
        setBase(move(base));
        setCalendar(next);
    };

    const a = start.trim()
        ? attempt(() => readDate(start, calendar))
        : { value: null, error: null };
    const b = end.trim() ? attempt(() => readDate(end, calendar)) : { value: null, error: null };
    const diff = a.value && b.value ? difference(a.value, b.value, calendar) : null;
    const added = attempt(() => addDays(readDate(base, calendar), parseAmount(count), calendar));
    const weekdayOf = (date: SimpleDate) =>
        WEEKDAYS[locale][weekday(calendar === "jalali" ? jalaliToGregorian(date) : date)];

    const dateField = (
        id: string,
        label: string,
        value: string,
        set: (value: string) => void,
        extra?: Record<string, string>,
    ) => (
        <label
            htmlFor={id}
            className="flex min-w-0 flex-col gap-1.5 text-xs font-semibold text-muted"
        >
            {label}
            <span className="flex gap-2">
                <input
                    id={id}
                    dir="ltr"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder={calendar === "jalali" ? "1404/09/05" : "2025/11/26"}
                    value={value}
                    onChange={(event) => set(event.target.value)}
                    className={FIELD}
                    {...extra}
                />
                <Button onClick={() => set(today(calendar))}>{t("today")}</Button>
            </span>
        </label>
    );

    return (
        <div className="flex flex-col gap-5">
            <Segmented<Calendar>
                legend={t("calendar")}
                value={calendar}
                onChange={changeCalendar}
                options={[
                    { value: "jalali", label: t("jalali") },
                    { value: "gregorian", label: t("gregorian") },
                ]}
            />
            <p className="-mt-2 text-xs text-muted">{t("format")}</p>
            <div className="grid gap-3 sm:grid-cols-2">
                {dateField(ids.start, t("start"), start, setStart, { "data-tool-input": "" })}
                {dateField(ids.end, t("end"), end, setEnd)}
            </div>
            {(a.error ?? b.error) && (
                <ErrorMessage error={(a.error ?? b.error) as ToolError} locale={locale} />
            )}
            {diff && (
                <dl className="grid gap-2 sm:grid-cols-2" aria-live="polite">
                    <div className="rounded-xl border border-border bg-bg px-3 py-2">
                        <dt className="text-xs text-muted">{t("total")}</dt>
                        <dd className="text-lg font-semibold tabular-nums" data-date="days">
                            {n(Math.abs(diff.days))} {t("days")}
                        </dd>
                    </div>
                    <div className="rounded-xl border border-border bg-bg px-3 py-2">
                        <dt className="text-xs text-muted">{t("ymd")}</dt>
                        <dd className="text-lg font-semibold tabular-nums" data-date="ymd">
                            {n(diff.years)} {t("years")}، {n(diff.months)} {t("months")}،{" "}
                            {n(diff.remainingDays)} {t("days")}
                        </dd>
                    </div>
                    <div className="rounded-xl border border-border bg-bg px-3 py-2">
                        <dt className="text-xs text-muted">{t("weeks")}</dt>
                        <dd className="text-lg font-semibold tabular-nums">
                            {n(diff.weeks)} {t("weeks")} {t("and")} {n(diff.weekDays)} {t("days")}
                        </dd>
                    </div>
                    <div className="rounded-xl border border-border bg-bg px-3 py-2">
                        <dt className="text-xs text-muted">{t("nonFridays")}</dt>
                        <dd className="text-lg font-semibold tabular-nums">{n(diff.nonFridays)}</dd>
                    </div>
                    {diff.days < 0 && (
                        <p className="text-xs text-muted sm:col-span-2">{t("earlier")}</p>
                    )}
                </dl>
            )}

            <section className="flex flex-col gap-3 rounded-2xl border border-border bg-bg p-4">
                <h2 className="text-sm font-semibold">{t("addTitle")}</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                    {dateField(ids.base, t("date"), base, setBase)}
                    <NumberField label={t("count")} value={count} onChange={setCount} />
                </div>
                {added.value && (
                    <p className="text-lg font-semibold" data-date="added">
                        <Ltr>{formatNumeric(added.value)}</Ltr> · {weekdayOf(added.value)}
                    </p>
                )}
            </section>
            <input
                type="hidden"
                value={diff ? String(diff.days) : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
