import { useId, useMemo, useState } from "react";
import {
    Checkbox,
    CopyButton,
    Pane,
    PaneAction,
    PasteButton,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { kindLabels, strings } from "./i18n";
import { EXTRACT_KINDS, extract, type ExtractKind } from "./logic";

export default function TextExtractor({ locale, presetOptions }: ToolUiProps) {
    const preset = presetOptions?.["kind"];
    const [kind, setKind] = useState<ExtractKind>(
        EXTRACT_KINDS.find((value) => value === preset) ?? "emails",
    );
    const [unique, setUnique] = useState(true);
    const [sort, setSort] = useState(false);
    const [text, setText] = useState("");
    const kindId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];
    const number = (n: number) => new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en").format(n);

    const items = useMemo(() => extract(text, kind, { unique, sort }), [text, kind, unique, sort]);
    const output = items.join("\n");

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
                <label htmlFor={kindId} className="text-xs font-semibold text-muted">
                    {t("kind")}
                </label>
                <select
                    id={kindId}
                    value={kind}
                    onChange={(event) => setKind(event.target.value as ExtractKind)}
                    className="min-h-11 w-full rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)] sm:w-60"
                >
                    {EXTRACT_KINDS.map((value) => (
                        <option key={value} value={value}>
                            {kindLabels[value][locale]}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
                <Checkbox label={t("unique")} checked={unique} onChange={setUnique} />
                <Checkbox label={t("sort")} checked={sort} onChange={setSort} />
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
                <Pane
                    label={UI_STRINGS.input[locale]}
                    locale={locale}
                    value={text}
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
                <Pane
                    label={kindLabels[kind][locale]}
                    locale={locale}
                    code
                    value={output}
                    readOnly
                    stats={false}
                    placeholder={UI_STRINGS.outputHere[locale]}
                    meta={
                        <span data-tool-count>
                            {number(items.length)} {t("found")}
                        </span>
                    }
                    actions={<CopyButton text={output} locale={locale} compact />}
                    data-tool-output=""
                />
            </div>
        </div>
    );
}
