import { useDeferredValue, useId, useMemo, useState } from "react";
import {
    CopyButton,
    ErrorMessage,
    Pane,
    PaneAction,
    PasteButton,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import type { ToolError } from "@handyweb/core/runtime";
import { textCounterMeta } from "./meta";
import { strings } from "./i18n";
import {
    DEFAULT_WORDS_PER_MINUTE,
    MAX_WORDS_PER_MINUTE,
    MIN_WORDS_PER_MINUTE,
    readingSeconds,
    textStats,
    type TextStats,
} from "./logic";

const MAX = textCounterMeta.limits?.maxInputBytes ?? Infinity;

const ORDER: Array<keyof TextStats> = [
    "words",
    "characters",
    "charactersNoSpaces",
    "sentences",
    "paragraphs",
    "lines",
];

export default function TextCounter({ locale }: ToolUiProps) {
    const [text, setText] = useState("");
    const [rate, setRate] = useState(String(DEFAULT_WORDS_PER_MINUTE));
    const rateId = useId();
    const countsId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];
    const format = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en");

    // Counting a large text on each key press is slow, so React may skip
    // frames of the deferred value while the user types.
    const deferred = useDeferredValue(text);
    const tooLarge = deferred.length > MAX;
    const stats = useMemo(() => (tooLarge ? null : textStats(deferred)), [deferred, tooLarge]);

    const seconds = stats ? readingSeconds(stats.words, Number(rate)) : 0;
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    const reading =
        minutes === 0
            ? `${format.format(rest)} ${t("seconds")}`
            : rest === 0
              ? `${format.format(minutes)} ${t("minutes")}`
              : `${format.format(minutes)} ${t("minutes")}${t("and")}${format.format(rest)} ${t("seconds")}`;

    const summary =
        stats && deferred !== ""
            ? [
                  ...ORDER.map((key) => `${t(key)}: ${format.format(stats[key])}`),
                  `${t("readingTime")}: ${reading}`,
              ].join("\n")
            : "";

    const error: ToolError | null = tooLarge
        ? {
              code: "too-large",
              message: { fa: "ورودی بیش از ۵ مگابایت است.", en: "The input is larger than 5 MB." },
          }
        : null;

    return (
        <div className="flex flex-col gap-5">
            <Pane
                label={UI_STRINGS.input[locale]}
                locale={locale}
                value={text}
                stats={false}
                onChange={(event) => setText(event.target.value)}
                placeholder={UI_STRINGS.inputHere[locale]}
                actions={
                    <>
                        <PasteButton locale={locale} onPaste={setText} />
                        <PaneAction
                            icon="clear"
                            label={UI_STRINGS.clear[locale]}
                            onClick={() => setText("")}
                            disabled={text === ""}
                        />
                    </>
                }
                data-tool-input=""
            />

            {error && <ErrorMessage error={error} locale={locale} />}

            <section
                className="overflow-hidden rounded-2xl border border-border bg-bg"
                aria-labelledby={countsId}
            >
                <div className="flex min-h-11 items-center justify-between gap-2 border-b border-border/70 ps-4 pe-1.5">
                    <h2 id={countsId} className="text-xs font-semibold text-muted">
                        {t("counts")}
                    </h2>
                    <CopyButton text={summary} locale={locale} compact />
                </div>
                <dl className="grid grid-cols-2 gap-px bg-border/70 sm:grid-cols-3" data-tool-stats>
                    {ORDER.map((key) => (
                        <div key={key} className="flex flex-col gap-1 bg-bg px-4 py-4">
                            <dt className="text-xs text-muted">{t(key)}</dt>
                            <dd
                                className="text-2xl font-bold tabular-nums"
                                data-stat={key}
                                aria-live="off"
                            >
                                {format.format(stats?.[key] ?? 0)}
                            </dd>
                        </div>
                    ))}
                </dl>
                <div className="flex flex-wrap items-end justify-between gap-4 border-t border-border/70 px-4 py-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted">{t("readingTime")}</span>
                        <span className="text-2xl font-bold tabular-nums" data-stat="reading">
                            {reading}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor={rateId} className="text-xs font-semibold text-muted">
                            {t("wordsPerMinute")}
                        </label>
                        <input
                            id={rateId}
                            type="number"
                            dir="ltr"
                            inputMode="numeric"
                            min={MIN_WORDS_PER_MINUTE}
                            max={MAX_WORDS_PER_MINUTE}
                            step={10}
                            value={rate}
                            onChange={(event) => setRate(event.target.value)}
                            className="min-h-11 w-28 rounded-xl border border-border bg-surface-2/60 px-3 text-base tabular-nums text-text outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]"
                        />
                    </div>
                </div>
                <input type="hidden" value={summary} readOnly data-tool-output="" />
            </section>
        </div>
    );
}
