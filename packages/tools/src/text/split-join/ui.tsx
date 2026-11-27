import { useId, useMemo, useState } from "react";
import {
    Checkbox,
    CopyButton,
    Pane,
    PaneAction,
    PasteButton,
    Segmented,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { strings } from "./i18n";
import { splitJoin, type Direction } from "./logic";

const FIELD =
    "min-h-11 rounded-xl border border-border bg-surface-2/60 px-3 font-mono text-base text-text outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";

export default function SplitJoin({ locale, presetOptions }: ToolUiProps) {
    const [direction, setDirection] = useState<Direction>(
        presetOptions?.["direction"] === "join" ? "join" : "split",
    );
    const [delimiter, setDelimiter] = useState(",");
    const [wrap, setWrap] = useState("");
    const [trim, setTrim] = useState(true);
    const [skipEmpty, setSkipEmpty] = useState(true);
    const [text, setText] = useState("");
    const delimiterId = useId();
    const wrapId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];

    const output = useMemo(
        () => splitJoin(text, { direction, delimiter, trim, skipEmpty, wrap }),
        [text, direction, delimiter, trim, skipEmpty, wrap],
    );

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                <Segmented<Direction>
                    legend={t("direction")}
                    value={direction}
                    onChange={setDirection}
                    options={[
                        { value: "split", label: t("split") },
                        { value: "join", label: t("join") },
                    ]}
                />
                <div className="flex flex-col gap-1.5">
                    <label htmlFor={delimiterId} className="text-xs font-semibold text-muted">
                        {t("delimiter")}
                    </label>
                    <input
                        id={delimiterId}
                        dir="ltr"
                        value={delimiter}
                        onChange={(event) => setDelimiter(event.target.value)}
                        aria-describedby={`${delimiterId}-hint`}
                        className={`${FIELD} w-28`}
                    />
                </div>
                {direction === "join" && (
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor={wrapId} className="text-xs font-semibold text-muted">
                            {t("wrap")}
                        </label>
                        <input
                            id={wrapId}
                            dir="ltr"
                            value={wrap}
                            onChange={(event) => setWrap(event.target.value)}
                            placeholder={'"'}
                            className={`${FIELD} w-20`}
                        />
                    </div>
                )}
            </div>
            <p id={`${delimiterId}-hint`} className="-mt-3 text-xs text-muted">
                {t("delimiterHint")}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
                <Checkbox label={t("trim")} checked={trim} onChange={setTrim} />
                <Checkbox label={t("skipEmpty")} checked={skipEmpty} onChange={setSkipEmpty} />
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
                <Pane
                    label={direction === "split" ? t("splitInput") : t("joinInput")}
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
                    value={output}
                    readOnly
                    placeholder={UI_STRINGS.outputHere[locale]}
                    actions={<CopyButton text={output} locale={locale} compact />}
                    data-tool-output=""
                />
            </div>
        </div>
    );
}
