import { useState } from "react";
import { Ltr, Segmented, type ToolUiProps } from "@handyweb/core/ui";
import { NumberField } from "../shared/NumberField";
import { formatAmount, parseAmount } from "../unit-converter/logic";
import { strings } from "./i18n";
import { megapixels, PAPERS, pixelsFor, printSize, type Length } from "./logic";

function read(text: string): number | null {
    try {
        const value = parseAmount(text);
        return value > 0 ? value : null;
    } catch {
        return null;
    }
}

const DPIS = ["72", "150", "300", "600"] as const;

export default function ImageResolution({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("4000");
    const [dpi, setDpi] = useState("300");
    const [unit, setUnit] = useState<Length>("cm");
    const [paper, setPaper] = useState("A4");
    const [paperDpi, setPaperDpi] = useState<(typeof DPIS)[number]>("300");
    const w = read(width);
    const h = read(height);
    const d = read(dpi);
    const n = (value: number, digits = 1) => formatAmount(Number(value.toFixed(digits)), locale);
    const size = w && h && d ? { w: printSize(w, d, unit), h: printSize(h, d, unit) } : null;
    const chosen =
        PAPERS.find((item) => item.id === paper) ?? (PAPERS[0] as (typeof PAPERS)[number]);
    const need = {
        w: pixelsFor(chosen.widthCm, "cm", Number(paperDpi)),
        h: pixelsFor(chosen.heightCm, "cm", Number(paperDpi)),
    };

    return (
        <div className="flex flex-col gap-5">
            <section className="flex flex-col gap-3 rounded-2xl border border-border bg-bg p-4">
                <h2 className="text-sm font-semibold">{t("printTitle")}</h2>
                <div className="grid gap-3 sm:grid-cols-3">
                    <NumberField
                        label={t("width")}
                        value={width}
                        onChange={setWidth}
                        placeholder="6000"
                        data-tool-input=""
                    />
                    <NumberField label={t("height")} value={height} onChange={setHeight} />
                    <NumberField label={t("dpi")} value={dpi} onChange={setDpi} />
                </div>
                <Segmented<Length>
                    legend={t("unit")}
                    value={unit}
                    onChange={setUnit}
                    options={[
                        { value: "cm", label: "cm" },
                        { value: "in", label: "in" },
                    ]}
                />
                {size && w && h && (
                    <dl className="flex flex-wrap gap-x-8 gap-y-1" aria-live="polite">
                        <div>
                            <dt className="text-xs text-muted">{t("printSize")}</dt>
                            <dd
                                className="text-lg font-semibold tabular-nums"
                                data-resolution="print"
                            >
                                {n(size.w)} × {n(size.h)} <Ltr>{unit}</Ltr>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-muted">{t("megapixels")}</dt>
                            <dd className="text-lg font-semibold tabular-nums">
                                {n(megapixels(w, h))}
                            </dd>
                        </div>
                    </dl>
                )}
            </section>
            <section className="flex flex-col gap-3 rounded-2xl border border-border bg-bg p-4">
                <h2 className="text-sm font-semibold">{t("needTitle")}</h2>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                    <Segmented<string>
                        legend={t("paper")}
                        value={paper}
                        onChange={setPaper}
                        options={PAPERS.map((item) => ({ value: item.id, label: item.id }))}
                    />
                    <Segmented<(typeof DPIS)[number]>
                        legend={t("dpi")}
                        value={paperDpi}
                        onChange={setPaperDpi}
                        options={DPIS.map((value) => ({ value, label: value }))}
                    />
                </div>
                <p className="text-lg font-semibold tabular-nums" data-resolution="need">
                    {formatAmount(need.w, locale)} × {formatAmount(need.h, locale)}{" "}
                    <span className="text-sm font-normal text-muted">
                        ({n(megapixels(need.w, need.h))} MP)
                    </span>
                </p>
            </section>
            <p className="text-xs text-muted">{t("tip")}</p>
            <input
                type="hidden"
                value={size ? `${size.w.toFixed(2)}x${size.h.toFixed(2)}${unit}` : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
