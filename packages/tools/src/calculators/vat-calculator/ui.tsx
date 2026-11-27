import { useState } from "react";
import { CopyButton, Segmented, type ToolUiProps } from "@handyweb/core/ui";
import { NumberField } from "../shared/NumberField";
import { formatAmount, parseAmount, plainAmount } from "../unit-converter/logic";
import { strings } from "./i18n";
import { addVat, removeVat } from "./logic";

type Mode = "add" | "remove";

function read(text: string): number | null {
    try {
        return parseAmount(text);
    } catch {
        return null;
    }
}

export default function VatCalculator({ locale, presetOptions }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const [amount, setAmount] = useState("");
    const [rate, setRate] = useState("10");
    const [mode, setMode] = useState<Mode>(presetOptions?.["mode"] === "remove" ? "remove" : "add");
    const a = read(amount);
    const r = read(rate);
    const split =
        a !== null && r !== null && r >= 0
            ? mode === "add"
                ? addVat(a, r)
                : removeVat(a, r)
            : null;

    return (
        <div className="flex flex-col gap-5">
            <Segmented<Mode>
                legend={t("mode")}
                value={mode}
                onChange={setMode}
                options={[
                    { value: "add", label: t("without") },
                    { value: "remove", label: t("with") },
                ]}
            />
            <div className="grid gap-3 sm:grid-cols-2">
                <NumberField
                    label={t("amount")}
                    value={amount}
                    onChange={setAmount}
                    placeholder="1,000,000"
                    data-tool-input=""
                />
                <NumberField
                    label={t("rate")}
                    value={rate}
                    onChange={setRate}
                    suffix="%"
                    data-vat-rate=""
                />
            </div>
            <p className="-mt-2 text-xs text-muted">{t("rateNote")}</p>
            {split && (
                <dl className="grid gap-2 sm:grid-cols-3" aria-live="polite">
                    {(["net", "vat", "gross"] as const).map((key) => (
                        <div
                            key={key}
                            className="flex items-center justify-between gap-2 rounded-xl border border-border bg-bg ps-3 pe-1.5 py-1"
                        >
                            <div className="flex flex-col">
                                <dt className="text-xs text-muted">{t(key)}</dt>
                                <dd className="text-lg font-semibold tabular-nums" data-vat={key}>
                                    {formatAmount(split[key], locale)}
                                </dd>
                            </div>
                            <CopyButton text={plainAmount(split[key])} locale={locale} compact />
                        </div>
                    ))}
                </dl>
            )}
            {mode === "remove" && <p className="text-xs text-muted">{t("removeNote")}</p>}
            <input
                type="hidden"
                value={split ? plainAmount(split.vat) : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
