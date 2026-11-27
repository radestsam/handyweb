import { useMemo, useState } from "react";
import {
    CopyButton,
    Pane,
    PaneAction,
    PasteButton,
    Segmented,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { modeLabels, strings } from "./i18n";
import { DIRECTION_MODES, fixDirection, type DirectionMode } from "./logic";

export default function DirectionFixer({ locale, presetOptions }: ToolUiProps) {
    const preset = presetOptions?.["mode"];
    const [mode, setMode] = useState<DirectionMode>(
        DIRECTION_MODES.find((value) => value === preset) ?? "lrm",
    );
    const [text, setText] = useState("");
    const t = (key: keyof typeof strings) => strings[key][locale];
    const number = (n: number) => new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en").format(n);
    const result = useMemo(() => fixDirection(text, mode), [text, mode]);

    return (
        <div className="flex flex-col gap-5">
            <Segmented<DirectionMode>
                legend={t("mode")}
                value={mode}
                onChange={setMode}
                options={DIRECTION_MODES.map((value) => ({
                    value,
                    label: modeLabels[value][locale],
                }))}
            />
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
                    label={UI_STRINGS.output[locale]}
                    locale={locale}
                    value={result.text}
                    readOnly
                    placeholder={UI_STRINGS.outputHere[locale]}
                    meta={
                        text !== "" ? (
                            <span data-tool-count>
                                {number(result.count)}{" "}
                                {mode === "remove" ? t("removed") : t("added")}
                            </span>
                        ) : undefined
                    }
                    actions={<CopyButton text={result.text} locale={locale} compact />}
                    data-tool-output=""
                />
            </div>
            {text !== "" && (
                <section className="flex flex-col gap-3 rounded-2xl border border-border bg-bg p-4">
                    <p className="text-xs text-muted">{t("previewNote")}</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {(["before", "after"] as const).map((key) => (
                            <div key={key} className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-muted">{t(key)}</span>
                                <p
                                    dir="rtl"
                                    lang="fa"
                                    className="rounded-lg bg-surface-2 px-3 py-2 leading-8 whitespace-pre-wrap"
                                    data-preview={key}
                                >
                                    {key === "before" ? text : result.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
