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
import { REVERSE_MODES, reverseText, type ReverseMode } from "./logic";

export default function ReverseText({ locale, presetOptions }: ToolUiProps) {
    const preset = presetOptions?.["mode"];
    const [mode, setMode] = useState<ReverseMode>(
        REVERSE_MODES.find((value) => value === preset) ?? "characters",
    );
    const [text, setText] = useState("");
    const output = useMemo(() => reverseText(text, mode), [text, mode]);

    return (
        <div className="flex flex-col gap-5">
            <Segmented<ReverseMode>
                legend={strings.mode[locale]}
                value={mode}
                onChange={setMode}
                options={REVERSE_MODES.map((value) => ({
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
