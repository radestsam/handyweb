import { useMemo, useState } from "react";
import {
    Checkbox,
    CopyButton,
    ErrorMessage,
    Pane,
    PaneAction,
    PasteButton,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import type { ToolError } from "@handyweb/core/runtime";
import { removeDuplicateLinesMeta } from "./meta";
import { strings } from "./i18n";
import { DEFAULT_OPTIONS, removeDuplicateLines, type DedupeOptions } from "./logic";

const MAX = removeDuplicateLinesMeta.limits?.maxInputBytes ?? Infinity;
const OPTIONS: Array<keyof DedupeOptions> = ["trim", "ignoreCase", "removeEmpty"];

export default function RemoveDuplicateLines({ locale }: ToolUiProps) {
    const [options, setOptions] = useState<DedupeOptions>(DEFAULT_OPTIONS);
    const [text, setText] = useState("");
    const t = (key: keyof typeof strings) => strings[key][locale];
    const format = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en");

    const tooLarge = text.length > MAX;
    const result = useMemo(
        () => (tooLarge ? null : removeDuplicateLines(text, options)),
        [text, options, tooLarge],
    );
    const output = result?.text ?? "";

    const error: ToolError | null = tooLarge
        ? {
              code: "too-large",
              message: { fa: "ورودی بیش از ۵ مگابایت است.", en: "The input is larger than 5 MB." },
          }
        : null;

    const meta = result && text !== "" && (
        <span data-tool-removed>
            {format.format(result.duplicates)}{" "}
            {result.duplicates === 1 ? t("duplicate") : t("duplicates")}
            {options.removeEmpty && (
                <>
                    {locale === "fa" ? "، " : ", "}
                    {format.format(result.empty)} {result.empty === 1 ? t("emptyOne") : t("empty")}
                </>
            )}
        </span>
    );

    return (
        <div className="flex flex-col gap-5">
            <fieldset className="flex flex-col gap-2">
                <legend className="mb-1.5 text-sm font-semibold">{t("compare")}</legend>
                <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                    {OPTIONS.map((key) => (
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
                    meta={meta}
                    data-tool-output=""
                />
            </div>

            {error && <ErrorMessage error={error} locale={locale} />}
        </div>
    );
}
