import { useMemo, useState } from "react";
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
import type { ToolError } from "@handyweb/core/runtime";
import { caseConverterMeta } from "./meta";
import { strings } from "./i18n";
import { CASE_MODES, convertCase, type CaseMode } from "./logic";

const MAX = caseConverterMeta.limits?.maxInputBytes ?? Infinity;

export default function CaseConverter({ locale, presetOptions }: ToolUiProps) {
    const preset = presetOptions?.["mode"];
    const [mode, setMode] = useState<CaseMode>(
        CASE_MODES.find((value) => value === preset) ?? "title",
    );
    const [text, setText] = useState("");

    const tooLarge = text.length > MAX;
    const output = useMemo(() => (tooLarge ? "" : convertCase(text, mode)), [text, mode, tooLarge]);

    const error: ToolError | null = tooLarge
        ? {
              code: "too-large",
              message: { fa: "ورودی بیش از ۵ مگابایت است.", en: "The input is larger than 5 MB." },
          }
        : null;

    return (
        <div className="flex flex-col gap-5">
            <Segmented<CaseMode>
                legend={strings.mode[locale]}
                value={mode}
                onChange={setMode}
                options={CASE_MODES.map((value) => ({ value, label: strings[value][locale] }))}
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

            {error && <ErrorMessage error={error} locale={locale} />}
        </div>
    );
}
