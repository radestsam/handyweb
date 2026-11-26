import { useMemo, useState } from "react";
import { diffChars } from "diff";
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
import { persianNormalizerMeta } from "./meta";
import { ruleLabels, strings } from "./i18n";
import { DEFAULT_OPTIONS, normalizePersian, type DigitMode, type NormalizeOptions } from "./logic";

const MAX = persianNormalizerMeta.limits?.maxInputBytes ?? Infinity;
/** Above this size the character diff is skipped, so typing stays fast. */
const DIFF_LIMIT = 50_000;

type BooleanRule = Exclude<keyof NormalizeOptions, "digits">;
const BOOLEAN_RULES: BooleanRule[] = [
    "arabicLetters",
    "presentationForms",
    "tatweel",
    "zwnj",
    "diacritics",
    "tehMarbuta",
    "punctuationSpacing",
];

/** Shows invisible characters, so a removed ZWNJ is visible in the change list. */
function visible(text: string): string {
    return text.replace(/‌/g, "⟨ZWNJ⟩").replace(/‍/g, "⟨ZWJ⟩").replace(/ /g, "␣");
}

export default function PersianNormalizer({ locale, presetOptions }: ToolUiProps) {
    const presetDigits = presetOptions?.["digits"];
    const [options, setOptions] = useState<NormalizeOptions>({
        ...DEFAULT_OPTIONS,
        ...(presetDigits === "to-persian" || presetDigits === "to-latin"
            ? { digits: presetDigits }
            : {}),
    });
    const [text, setText] = useState("");
    const t = (key: keyof typeof strings) => strings[key][locale];

    const tooLarge = text.length > MAX;
    const result = useMemo(
        () => (tooLarge ? null : normalizePersian(text, options)),
        [text, options, tooLarge],
    );
    const output = result?.text ?? "";

    const parts = useMemo(
        () =>
            result && text.length <= DIFF_LIMIT && output !== text ? diffChars(text, output) : null,
        [result, text, output],
    );

    const error: ToolError | null = tooLarge
        ? {
              code: "too-large",
              message: { fa: "ورودی بیش از ۵ مگابایت است.", en: "The input is larger than 5 MB." },
          }
        : null;

    const counts = Object.entries(result?.counts ?? {}) as Array<[keyof typeof ruleLabels, number]>;
    const number = (n: number) => new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en").format(n);

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

            <Segmented<DigitMode>
                legend={t("digits")}
                value={options.digits}
                onChange={(digits) => setOptions({ ...options, digits })}
                options={[
                    { value: "keep", label: t("digitsKeep") },
                    { value: "arabic-to-persian", label: t("digitsArabic") },
                    { value: "to-persian", label: t("digitsPersian") },
                    { value: "to-latin", label: t("digitsLatin") },
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
                    {parts ? (
                        <p
                            dir="auto"
                            className="mt-3 leading-8 break-words whitespace-pre-wrap"
                            data-tool-diff
                        >
                            {parts.map((part, index) =>
                                part.added ? (
                                    <ins
                                        key={index}
                                        title={t("added")}
                                        className="rounded bg-success/15 text-success no-underline"
                                    >
                                        {visible(part.value)}
                                    </ins>
                                ) : part.removed ? (
                                    <del
                                        key={index}
                                        title={t("removed")}
                                        className="rounded bg-error-bg text-error"
                                    >
                                        {visible(part.value)}
                                    </del>
                                ) : (
                                    <span key={index}>{part.value}</span>
                                ),
                            )}
                        </p>
                    ) : (
                        text.length > DIFF_LIMIT &&
                        counts.length > 0 && <p className="mt-2 text-muted">{t("diffTooLarge")}</p>
                    )}
                </section>
            )}
        </div>
    );
}
