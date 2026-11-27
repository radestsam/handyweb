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
import { textCleanerMeta } from "./meta";
import { ruleLabels, strings } from "./i18n";
import {
    cleanText,
    DEFAULT_OPTIONS,
    PERSIAN_OPTIONS,
    type CleanOptions,
    type CleanRule,
    type EmptyLineMode,
} from "./logic";

const MAX = textCleanerMeta.limits?.maxInputBytes ?? Infinity;

type BooleanRule = Exclude<keyof CleanOptions, "emptyLines">;
const BOOLEAN_RULES: BooleanRule[] = [
    "trimLines",
    "collapseSpaces",
    "unicodeSpaces",
    "zeroWidth",
    "controlChars",
    "bidiControls",
];

export default function TextCleaner({ locale, presetOptions }: ToolUiProps) {
    const [options, setOptions] = useState<CleanOptions>(
        presetOptions?.["preset"] === "persian" ? PERSIAN_OPTIONS : DEFAULT_OPTIONS,
    );
    const [text, setText] = useState("");
    const t = (key: keyof typeof strings) => strings[key][locale];
    const number = (n: number) => new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en").format(n);

    const tooLarge = text.length > MAX;
    const result = useMemo(
        () => (tooLarge ? null : cleanText(text, options)),
        [text, options, tooLarge],
    );
    const output = result?.text ?? "";
    const counts = Object.entries(result?.counts ?? {}) as Array<[CleanRule, number]>;

    const error: ToolError | null = tooLarge
        ? {
              code: "too-large",
              message: { fa: "ورودی بیش از ۵ مگابایت است.", en: "The input is larger than 5 MB." },
          }
        : null;

    return (
        <div className="flex flex-col gap-5">
            <fieldset className="flex flex-col gap-2">
                <legend className="mb-1.5 text-sm font-semibold">{t("rules")}</legend>
                <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                    {BOOLEAN_RULES.map((rule) => (
                        <Checkbox
                            key={rule}
                            label={ruleLabels[rule][locale]}
                            checked={options[rule]}
                            onChange={(checked) => setOptions({ ...options, [rule]: checked })}
                        />
                    ))}
                </div>
            </fieldset>

            <Segmented<EmptyLineMode>
                legend={t("emptyLines")}
                value={options.emptyLines}
                onChange={(emptyLines) => setOptions({ ...options, emptyLines })}
                options={[
                    { value: "keep", label: t("emptyKeep") },
                    { value: "collapse", label: t("emptyCollapse") },
                    { value: "remove", label: t("emptyRemove") },
                ]}
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

            {text !== "" && result && (
                <section
                    aria-labelledby="changes"
                    className="rounded-md border border-border bg-surface-2 p-3 text-sm"
                >
                    <h2 id="changes" className="font-semibold">
                        {t("changes")}
                    </h2>
                    {counts.length === 0 ? (
                        <p className="mt-1 text-muted">{t("noChanges")}</p>
                    ) : (
                        <ul className="mt-1 list-disc ps-5" data-tool-counts>
                            {counts.map(([rule, count]) => (
                                <li key={rule}>
                                    {ruleLabels[rule][locale]}: {number(count)}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            )}
        </div>
    );
}
