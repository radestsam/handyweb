import { useState } from "react";
import { CopyButton, Ltr, Segmented, type ToolUiProps } from "@handyweb/core/ui";
import { NumberField } from "../shared/NumberField";
import { formatAmount, parseAmount, plainAmount } from "../unit-converter/logic";
import { strings } from "./i18n";
import { COMMON, nearest, otherSide, simplify } from "./logic";

function read(text: string): number | null {
    try {
        const value = parseAmount(text);
        return value > 0 ? value : null;
    } catch {
        return null;
    }
}

export default function AspectRatio({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("1080");
    const [rw, setRw] = useState("16");
    const [rh, setRh] = useState("9");
    const [side, setSide] = useState<"width" | "height">("width");
    const [value, setValue] = useState("1280");
    const w = read(width);
    const h = read(height);
    const simple = w && h ? simplify(w, h) : null;
    const near = w && h ? nearest(w, h) : null;
    const a = read(rw);
    const b = read(rh);
    const v = read(value);
    const other = a && b && v ? otherSide(a, b, side, v) : null;

    return (
        <div className="flex flex-col gap-5">
            <section className="flex flex-col gap-3 rounded-2xl border border-border bg-bg p-4">
                <h2 className="text-sm font-semibold">{t("fromSize")}</h2>
                <div className="grid grid-cols-2 gap-3">
                    <NumberField
                        label={t("width")}
                        value={width}
                        onChange={setWidth}
                        placeholder="1920"
                        data-tool-input=""
                    />
                    <NumberField label={t("height")} value={height} onChange={setHeight} />
                </div>
                {simple && w && h && (
                    <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm" aria-live="polite">
                        <div className="flex items-center gap-2">
                            <dt className="text-muted">{t("ratio")}</dt>
                            <dd className="text-lg font-semibold" data-ratio="simple">
                                <Ltr>{`${simple[0]}:${simple[1]}`}</Ltr>
                            </dd>
                            <CopyButton
                                text={`${simple[0]}:${simple[1]}`}
                                locale={locale}
                                compact
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <dt className="text-muted">{t("decimal")}</dt>
                            <dd className="tabular-nums">{formatAmount(w / h, locale)}</dd>
                        </div>
                        {near && `${near.w}:${near.h}` !== `${simple[0]}:${simple[1]}` && (
                            <div className="flex items-center gap-2">
                                <dt className="text-muted">{t("near")}</dt>
                                <dd data-ratio="near">
                                    <Ltr>{near.id}</Ltr>
                                </dd>
                            </div>
                        )}
                    </dl>
                )}
            </section>
            <section className="flex flex-col gap-3 rounded-2xl border border-border bg-bg p-4">
                <h2 className="text-sm font-semibold">{t("sideTitle")}</h2>
                <div className="flex flex-wrap gap-2">
                    {COMMON.map((ratio) => (
                        <button
                            key={ratio.id}
                            type="button"
                            onClick={() => {
                                setRw(String(ratio.w));
                                setRh(String(ratio.h));
                            }}
                            className="min-h-9 rounded-full border border-border px-3 text-sm hover:bg-surface-2"
                        >
                            <Ltr>{ratio.id}</Ltr>
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <NumberField label={t("ratioW")} value={rw} onChange={setRw} />
                    <NumberField label={t("ratioH")} value={rh} onChange={setRh} />
                </div>
                <Segmented<"width" | "height">
                    legend={t("known")}
                    value={side}
                    onChange={setSide}
                    options={[
                        { value: "width", label: t("width") },
                        { value: "height", label: t("height") },
                    ]}
                />
                <div className="grid grid-cols-2 items-end gap-3">
                    <NumberField label={t("value")} value={value} onChange={setValue} />
                    <div className="flex min-h-11 items-center justify-between gap-2 rounded-xl bg-surface-2/60 ps-3 pe-1.5">
                        <span className="text-xs text-muted">
                            {side === "width" ? t("height") : t("width")}
                        </span>
                        <span className="text-lg font-semibold tabular-nums" data-ratio="other">
                            {other === null ? "—" : formatAmount(other, locale)}
                        </span>
                        {other !== null && (
                            <CopyButton text={plainAmount(other)} locale={locale} compact />
                        )}
                    </div>
                </div>
            </section>
            <input
                type="hidden"
                value={simple ? `${simple[0]}:${simple[1]}` : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
