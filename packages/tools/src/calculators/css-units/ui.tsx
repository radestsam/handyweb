import { useId, useState } from "react";
import { CopyButton, Ltr, type ToolUiProps } from "@handyweb/core/ui";
import { NumberField } from "../shared/NumberField";
import { parseAmount } from "../unit-converter/logic";
import { strings } from "./i18n";
import { convertCss, cssValue, DEFAULT_CONTEXT, UNITS, type Context, type CssUnit } from "./logic";

const FIELD =
    "min-h-11 w-full rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";

function read(text: string, fallback: number | null = null): number | null {
    try {
        return parseAmount(text);
    } catch {
        return fallback;
    }
}

export default function CssUnits({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const [value, setValue] = useState("");
    const [unit, setUnit] = useState<CssUnit>("px");
    const [ctx, setCtx] = useState<Record<keyof Context, string>>({
        rootFontSize: "16",
        fontSize: "16",
        viewportWidth: "1440",
        viewportHeight: "900",
        parentSize: "1200",
    });
    const unitId = useId();
    const v = read(value);
    const context: Context = {
        rootFontSize: read(ctx.rootFontSize, DEFAULT_CONTEXT.rootFontSize) as number,
        fontSize: read(ctx.fontSize, DEFAULT_CONTEXT.fontSize) as number,
        viewportWidth: read(ctx.viewportWidth, DEFAULT_CONTEXT.viewportWidth) as number,
        viewportHeight: read(ctx.viewportHeight, DEFAULT_CONTEXT.viewportHeight) as number,
        parentSize: read(ctx.parentSize, DEFAULT_CONTEXT.parentSize) as number,
    };
    const rows =
        v === null
            ? []
            : UNITS.filter((to) => to !== unit).map((to) => ({
                  to,
                  text: cssValue(convertCss(v, unit, to, context), to),
              }));
    const setField = (key: keyof Context) => (text: string) =>
        setCtx((current) => ({ ...current, [key]: text }));

    return (
        <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-3">
                <NumberField
                    label={t("value")}
                    value={value}
                    onChange={setValue}
                    placeholder="24"
                    data-tool-input=""
                />
                <label
                    htmlFor={unitId}
                    className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
                >
                    {t("unit")}
                    <select
                        id={unitId}
                        dir="ltr"
                        value={unit}
                        onChange={(event) => setUnit(event.target.value as CssUnit)}
                        className={FIELD}
                        data-css-unit=""
                    >
                        {UNITS.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <details className="rounded-2xl border border-border bg-bg px-4 py-3">
                <summary className="cursor-pointer text-sm font-semibold">{t("context")}</summary>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <NumberField
                        label={t("root")}
                        value={ctx.rootFontSize}
                        onChange={setField("rootFontSize")}
                    />
                    <NumberField
                        label={t("font")}
                        value={ctx.fontSize}
                        onChange={setField("fontSize")}
                    />
                    <NumberField
                        label={t("parent")}
                        value={ctx.parentSize}
                        onChange={setField("parentSize")}
                    />
                    <NumberField
                        label={t("vw")}
                        value={ctx.viewportWidth}
                        onChange={setField("viewportWidth")}
                    />
                    <NumberField
                        label={t("vh")}
                        value={ctx.viewportHeight}
                        onChange={setField("viewportHeight")}
                    />
                </div>
            </details>
            {rows.length > 0 && (
                <section
                    className="overflow-hidden rounded-2xl border border-border bg-bg"
                    aria-live="polite"
                >
                    <h2 className="border-b border-border/70 px-4 py-2.5 text-sm font-semibold">
                        {t("results")}
                    </h2>
                    <ul
                        className="grid divide-y divide-border/50 sm:grid-cols-2 sm:divide-y-0"
                        data-css-results=""
                    >
                        {rows.map((row) => (
                            <li
                                key={row.to}
                                className="flex items-center justify-between gap-2 px-4 py-1.5"
                                data-css={row.to}
                            >
                                <Ltr as="code" className="font-mono text-sm">
                                    {row.text}
                                </Ltr>
                                <CopyButton text={row.text} locale={locale} compact />
                            </li>
                        ))}
                    </ul>
                </section>
            )}
            <p className="text-xs text-muted">{t("note")}</p>
            <input
                type="hidden"
                value={rows.map((row) => row.text).join(" ")}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
