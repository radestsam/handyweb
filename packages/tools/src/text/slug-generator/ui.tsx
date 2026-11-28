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
import { slugify, type Script } from "./logic";

export default function SlugGenerator({ locale, presetOptions }: ToolUiProps) {
    const [script, setScript] = useState<Script>(
        presetOptions?.["script"] === "persian" ? "persian" : "latin",
    );
    const [separator, setSeparator] = useState<"-" | "_">("-");
    const [lowercase, setLowercase] = useState(true);
    const [maxLength, setMaxLength] = useState("0");
    const [text, setText] = useState("");
    const lengthId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];

    const output = useMemo(
        () =>
            text
                .split(/\r\n|\r|\n/)
                .map((line) =>
                    slugify(line, {
                        script,
                        separator,
                        lowercase,
                        maxLength: Math.max(0, Number(maxLength) || 0),
                    }),
                )
                .join("\n"),
        [text, script, separator, lowercase, maxLength],
    );

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                <Segmented<Script>
                    legend={t("script")}
                    value={script}
                    onChange={setScript}
                    options={[
                        { value: "latin", label: t("latin") },
                        { value: "persian", label: t("persian") },
                    ]}
                />
                <Segmented<"-" | "_">
                    legend={t("separator")}
                    value={separator}
                    onChange={setSeparator}
                    options={[
                        { value: "-", label: "-" },
                        { value: "_", label: "_" },
                    ]}
                />
                <div className="flex flex-col gap-1.5">
                    <label htmlFor={lengthId} className="text-xs font-semibold text-muted">
                        {t("maxLength")}
                    </label>
                    <input
                        id={lengthId}
                        type="number"
                        dir="ltr"
                        min={0}
                        value={maxLength}
                        onChange={(event) => setMaxLength(event.target.value)}
                        className="min-h-11 w-24 rounded-xl border border-border bg-surface-2/60 px-3 text-base tabular-nums text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]"
                    />
                </div>
                <div className="pb-1">
                    <Checkbox label={t("lowercase")} checked={lowercase} onChange={setLowercase} />
                </div>
            </div>
            <p className="-mt-3 text-xs text-muted">{t("oneLine")}</p>
            <div className="grid gap-3 lg:grid-cols-2">
                <Pane
                    label={t("title")}
                    locale={locale}
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder={UI_STRINGS.inputHere[locale]}
                    className="min-h-36"
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
                    label={t("slug")}
                    locale={locale}
                    code={script === "latin"}
                    value={output}
                    readOnly
                    className="min-h-36"
                    placeholder={UI_STRINGS.outputHere[locale]}
                    actions={<CopyButton text={output} locale={locale} compact />}
                    data-tool-output=""
                />
            </div>
        </div>
    );
}
