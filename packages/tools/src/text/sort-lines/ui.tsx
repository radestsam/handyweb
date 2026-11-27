import { useMemo, useState } from "react";
import {
    Checkbox,
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
import { sortLinesMeta } from "./meta";
import { strings } from "./i18n";
import { DEFAULT_OPTIONS, sortLines, type SortOptions, type SortOrder } from "./logic";

const MAX = sortLinesMeta.limits?.maxInputBytes ?? Infinity;
const ORDERS: SortOrder[] = ["ascending", "descending", "reverse"];
const FLAGS = ["natural", "ignoreCase", "removeEmpty"] as const;

export default function SortLines({ locale, presetOptions }: ToolUiProps) {
    const preset = presetOptions?.["order"];
    const [options, setOptions] = useState<SortOptions>({
        ...DEFAULT_OPTIONS,
        order: ORDERS.find((order) => order === preset) ?? DEFAULT_OPTIONS.order,
    });
    const [text, setText] = useState("");
    const t = (key: keyof typeof strings) => strings[key][locale];

    const tooLarge = text.length > MAX;
    const output = useMemo(
        () => (tooLarge ? "" : sortLines(text, options)),
        [text, options, tooLarge],
    );

    const error: ToolError | null = tooLarge
        ? {
              code: "too-large",
              message: { fa: "ورودی بیش از ۵ مگابایت است.", en: "The input is larger than 5 MB." },
          }
        : null;

    // Reverse does not compare lines, so the compare options do not apply.
    const flags = options.order === "reverse" ? (["removeEmpty"] as const) : FLAGS;

    return (
        <div className="flex flex-col gap-5">
            <Segmented<SortOrder>
                legend={t("order")}
                value={options.order}
                onChange={(order) => setOptions({ ...options, order })}
                options={ORDERS.map((value) => ({ value, label: t(value) }))}
            />

            <fieldset className="flex flex-col gap-2">
                <legend className="mb-1.5 text-sm font-semibold">{t("options")}</legend>
                <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                    {flags.map((key) => (
                        <Checkbox
                            key={key}
                            label={t(key)}
                            checked={options[key]}
                            onChange={(checked) => setOptions({ ...options, [key]: checked })}
                        />
                    ))}
                </div>
            </fieldset>

            <div className="grid gap-3 lg:grid-cols-2">
                <Pane
                    label={UI_STRINGS.input[locale]}
                    locale={locale}
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder={UI_STRINGS.inputHere[locale]}
                    wrap="off"
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
                    wrap="off"
                    placeholder={UI_STRINGS.outputHere[locale]}
                    actions={<CopyButton text={output} locale={locale} compact />}
                    data-tool-output=""
                />
            </div>

            {error && <ErrorMessage error={error} locale={locale} />}
        </div>
    );
}
