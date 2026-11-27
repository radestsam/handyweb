import { useState } from "react";
import { CopyButton, type ToolUiProps } from "@handyweb/core/ui";
import { NumberField } from "../shared/NumberField";
import { formatAmount, parseAmount, plainAmount } from "../unit-converter/logic";
import { strings } from "./i18n";
import { applyDiscounts, discountPercent } from "./logic";

function read(text: string): number | null {
    try {
        return parseAmount(text);
    } catch {
        return null;
    }
}

export default function DiscountCalculator({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const [price, setPrice] = useState("");
    const [first, setFirst] = useState("20");
    const [second, setSecond] = useState("");
    const [before, setBefore] = useState("250000");
    const [after, setAfter] = useState("200000");
    const f = (value: number) => formatAmount(value, locale);

    const p = read(price);
    const percents = [read(first), second.trim() === "" ? null : read(second)].filter(
        (value): value is number => value !== null,
    );
    const result = p !== null && percents.length > 0 ? applyDiscounts(p, percents) : null;
    const reverse =
        read(before) !== null && read(after) !== null
            ? discountPercent(read(before) as number, read(after) as number)
            : null;

    return (
        <div className="flex flex-col gap-5">
            <section className="flex flex-col gap-3 rounded-2xl border border-border bg-bg p-4">
                <div className="grid gap-3 sm:grid-cols-3">
                    <NumberField
                        label={t("price")}
                        value={price}
                        onChange={setPrice}
                        placeholder="1,000,000"
                        data-tool-input=""
                    />
                    <NumberField
                        label={t("discount")}
                        value={first}
                        onChange={setFirst}
                        suffix="%"
                    />
                    <NumberField
                        label={t("second")}
                        value={second}
                        onChange={setSecond}
                        suffix="%"
                    />
                </div>
                {result && (
                    <dl className="grid gap-2 sm:grid-cols-3" aria-live="polite">
                        {(
                            [
                                ["final", result.final, ""],
                                ["saved", result.saved, ""],
                                ["total", result.totalPercent, "%"],
                            ] as const
                        ).map(([key, value, unit]) => (
                            <div
                                key={key}
                                className="flex items-center justify-between gap-2 rounded-xl bg-surface-2/60 ps-3 pe-1.5 py-1"
                            >
                                <div className="flex flex-col">
                                    <dt className="text-xs text-muted">{t(key)}</dt>
                                    <dd
                                        className="text-lg font-semibold tabular-nums"
                                        data-discount={key}
                                    >
                                        {f(value)}
                                        {unit}
                                    </dd>
                                </div>
                                <CopyButton text={plainAmount(value)} locale={locale} compact />
                            </div>
                        ))}
                    </dl>
                )}
                {percents.length > 1 && <p className="text-xs text-muted">{t("stacked")}</p>}
            </section>
            <section className="flex flex-col gap-3 rounded-2xl border border-border bg-bg p-4">
                <h2 className="text-sm font-semibold">{t("reverseTitle")}</h2>
                <div className="grid grid-cols-2 gap-3">
                    <NumberField label={t("before")} value={before} onChange={setBefore} />
                    <NumberField label={t("after")} value={after} onChange={setAfter} />
                </div>
                <p className="text-lg font-semibold tabular-nums" data-discount="reverse">
                    {reverse === null ? "—" : `${f(reverse)}%`}
                </p>
            </section>
            <input
                type="hidden"
                value={result ? plainAmount(result.final) : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
