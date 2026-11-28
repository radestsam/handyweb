import { useId, useMemo, useState } from "react";
import { toToolError, type ToolResult } from "@handyweb/core/runtime";
import {
    CopyButton,
    ErrorMessage,
    Pane,
    PaneAction,
    PasteButton,
    Segmented,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { strings } from "./i18n";
import { MAX_COUNT, repeatText } from "./logic";

type SeparatorChoice = "newline" | "space" | "nothing" | "custom";
const SEPARATORS: Record<Exclude<SeparatorChoice, "custom">, string> = {
    newline: "\n",
    space: " ",
    nothing: "",
};
const FIELD =
    "min-h-11 rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";

export default function TextRepeater({ locale }: ToolUiProps) {
    const [text, setText] = useState("");
    const [count, setCount] = useState("3");
    const [separator, setSeparator] = useState<SeparatorChoice>("newline");
    const [custom, setCustom] = useState(", ");
    const countId = useId();
    const customId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];

    const result = useMemo((): ToolResult<string> => {
        try {
            const between = separator === "custom" ? custom : SEPARATORS[separator];
            return { ok: true, value: text === "" ? "" : repeatText(text, Number(count), between) };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [text, count, separator, custom]);
    const output = result.ok ? result.value : "";

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor={countId} className="text-xs font-semibold text-muted">
                        {t("count")}
                    </label>
                    <input
                        id={countId}
                        type="number"
                        dir="ltr"
                        min={1}
                        max={MAX_COUNT}
                        value={count}
                        onChange={(event) => setCount(event.target.value)}
                        className={`${FIELD} w-28 tabular-nums`}
                    />
                </div>
                <Segmented<SeparatorChoice>
                    legend={t("separator")}
                    value={separator}
                    onChange={setSeparator}
                    options={(["newline", "space", "nothing", "custom"] as const).map((value) => ({
                        value,
                        label: t(value),
                    }))}
                />
                {separator === "custom" && (
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor={customId} className="text-xs font-semibold text-muted">
                            {t("customSeparator")}
                        </label>
                        <input
                            id={customId}
                            value={custom}
                            onChange={(event) => setCustom(event.target.value)}
                            className={`${FIELD} w-32`}
                        />
                    </div>
                )}
            </div>
            {!result.ok && <ErrorMessage error={result.error} locale={locale} />}
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
