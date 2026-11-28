import { useState, type ReactNode } from "react";
import { CopyButton, type ToolUiProps } from "@handyweb/core/ui";
import { NumberField } from "../shared/NumberField";
import { formatAmount, parseAmount, plainAmount } from "../unit-converter/logic";
import { strings } from "./i18n";
import { addPercent, percentChange, percentOf, whatPercent } from "./logic";

/** Reads a number, or returns null for an empty or wrong field. */
function read(text: string): number | null {
    try {
        return parseAmount(text);
    } catch {
        return null;
    }
}

function Card({
    id,
    title,
    children,
    answer,
    locale,
    output,
}: {
    id: string;
    title: string;
    children: ReactNode;
    answer: ReactNode;
    locale: "fa" | "en";
    output?: string | undefined;
}) {
    return (
        <section className="flex flex-col gap-3 rounded-2xl border border-border bg-bg p-4">
            <h2 className="text-sm font-semibold">{title}</h2>
            <div className="grid grid-cols-2 gap-3">{children}</div>
            <div className="flex min-h-11 items-center justify-between gap-2 rounded-xl bg-surface-2/60 ps-3 pe-1.5">
                <span className="text-lg font-semibold tabular-nums" data-percent={id}>
                    {answer}
                </span>
                {output !== undefined && <CopyButton text={output} locale={locale} compact />}
            </div>
        </section>
    );
}

export default function PercentageCalculator({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const [a, setA] = useState("");
    const [b, setB] = useState("150");
    const [c, setC] = useState("30");
    const [d, setD] = useState("120");
    const [e, setE] = useState("80");
    const [f, setF] = useState("100");
    const [g, setG] = useState("200");
    const [h, setH] = useState("9");
    const n = (value: number | null) => (value === null ? "—" : formatAmount(value, locale));

    const of =
        read(a) !== null && read(b) !== null
            ? percentOf(read(a) as number, read(b) as number)
            : null;
    const what =
        read(c) !== null && read(d) !== null
            ? whatPercent(read(c) as number, read(d) as number)
            : null;
    const changed =
        read(e) !== null && read(f) !== null
            ? percentChange(read(e) as number, read(f) as number)
            : null;
    const added =
        read(g) !== null && read(h) !== null
            ? addPercent(read(g) as number, read(h) as number)
            : null;

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card
                id="of"
                title={t("ofTitle")}
                answer={n(of)}
                locale={locale}
                output={of === null ? undefined : plainAmount(of)}
            >
                <NumberField
                    label={t("percent")}
                    value={a}
                    onChange={setA}
                    suffix="%"
                    placeholder="20"
                    data-tool-input=""
                />
                <NumberField label={t("number")} value={b} onChange={setB} />
            </Card>
            <Card
                id="what"
                title={t("whatTitle")}
                answer={what === null ? (read(d) === 0 ? t("none") : "—") : `${n(what)}%`}
                locale={locale}
                output={what === null ? undefined : plainAmount(what)}
            >
                <NumberField label={t("part")} value={c} onChange={setC} />
                <NumberField label={t("whole")} value={d} onChange={setD} />
            </Card>
            <Card
                id="change"
                title={t("changeTitle")}
                answer={
                    changed === null
                        ? read(e) === 0
                            ? t("none")
                            : "—"
                        : `${n(Math.abs(changed))}% ${changed >= 0 ? t("increase") : t("decrease")}`
                }
                locale={locale}
                output={changed === null ? undefined : plainAmount(changed)}
            >
                <NumberField label={t("oldValue")} value={e} onChange={setE} />
                <NumberField label={t("newValue")} value={f} onChange={setF} />
            </Card>
            <Card
                id="add"
                title={t("addTitle")}
                answer={n(added)}
                locale={locale}
                output={added === null ? undefined : plainAmount(added)}
            >
                <NumberField label={t("number")} value={g} onChange={setG} />
                <NumberField label={t("change")} value={h} onChange={setH} suffix="%" />
            </Card>
            <input
                type="hidden"
                value={of === null ? "" : plainAmount(of)}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
