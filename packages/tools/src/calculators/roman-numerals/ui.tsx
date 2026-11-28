import { useId, useState } from "react";
import { toToolError } from "@handyweb/core/runtime";
import { CopyButton, ErrorMessage, Ltr, type ToolUiProps } from "@handyweb/core/ui";
import { strings } from "./i18n";
import { convertRoman } from "./logic";

const SYMBOLS: Array<[string, number]> = [
    ["I", 1],
    ["V", 5],
    ["X", 10],
    ["L", 50],
    ["C", 100],
    ["D", 500],
    ["M", 1000],
];

export default function RomanNumerals({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const [text, setText] = useState("");
    const id = useId();
    let result: { roman: string; value: number } | null = null;
    let error = null;
    if (text.trim()) {
        try {
            result = convertRoman(text);
        } catch (caught) {
            error = toToolError(caught);
        }
    }
    const number = result
        ? result.value.toLocaleString(locale === "fa" ? "fa-IR" : "en", { useGrouping: false })
        : "";

    return (
        <div className="flex flex-col gap-5">
            <label htmlFor={id} className="flex flex-col gap-1.5 text-xs font-semibold text-muted">
                {t("input")}
                <input
                    id={id}
                    dir="ltr"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="2026 / MMXXVI"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    className="min-h-12 w-full rounded-xl border border-border bg-surface-2/60 px-3 font-mono text-lg text-text uppercase outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]"
                    data-tool-input=""
                />
            </label>
            {error && <ErrorMessage error={error} locale={locale} />}
            {result && (
                <dl className="grid gap-2 sm:grid-cols-2" aria-live="polite">
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-bg ps-3 pe-1.5 py-1">
                        <div>
                            <dt className="text-xs text-muted">{t("roman")}</dt>
                            <dd className="font-mono text-xl font-semibold" data-roman="roman">
                                <Ltr>{result.roman}</Ltr>
                            </dd>
                        </div>
                        <CopyButton text={result.roman} locale={locale} compact />
                    </div>
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-bg ps-3 pe-1.5 py-1">
                        <div>
                            <dt className="text-xs text-muted">{t("number")}</dt>
                            <dd className="text-xl font-semibold tabular-nums" data-roman="number">
                                {number}
                            </dd>
                        </div>
                        <CopyButton text={String(result.value)} locale={locale} compact />
                    </div>
                </dl>
            )}
            <section className="flex flex-col gap-2">
                <h2 className="text-xs font-semibold text-muted">{t("table")}</h2>
                <ul className="flex flex-wrap gap-2" dir="ltr">
                    {SYMBOLS.map(([symbol, value]) => (
                        <li
                            key={symbol}
                            className="rounded-lg border border-border px-2.5 py-1 font-mono text-sm"
                        >
                            {symbol} = {value}
                        </li>
                    ))}
                </ul>
            </section>
            <input
                type="hidden"
                value={result ? `${result.roman}=${result.value}` : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
