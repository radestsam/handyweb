import { useMemo, useState } from "react";
import { diffChars } from "diff";
import {
    Checkbox,
    CopyButton,
    Pane,
    PaneAction,
    PasteButton,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { ruleLabels, strings } from "./i18n";
import { DEFAULT_OPTIONS, fixZwnj, ZWNJ_RULES, type ZwnjOptions, type ZwnjRule } from "./logic";

/** Above this size the character diff is skipped, so typing stays fast. */
const DIFF_LIMIT = 50_000;

function visible(text: string): string {
    return text.replace(/\u200c/g, "⟨ZWNJ⟩").replace(/ /g, "␣");
}

export default function ZwnjFixer({ locale }: ToolUiProps) {
    const [options, setOptions] = useState<ZwnjOptions>(DEFAULT_OPTIONS);
    const [text, setText] = useState("");
    const t = (key: keyof typeof strings) => strings[key][locale];
    const number = (n: number) => new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en").format(n);

    const result = useMemo(() => fixZwnj(text, options), [text, options]);
    const parts = useMemo(
        () =>
            text.length <= DIFF_LIMIT && result.text !== text ? diffChars(text, result.text) : null,
        [text, result],
    );
    const counts = Object.entries(result.counts) as Array<[ZwnjRule, number]>;

    return (
        <div className="flex flex-col gap-5">
            <fieldset className="flex flex-col gap-2">
                <legend className="mb-1.5 text-sm font-semibold">{t("rules")}</legend>
                <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                    {ZWNJ_RULES.map((rule) => (
                        <Checkbox
                            key={rule}
                            label={ruleLabels[rule][locale]}
                            checked={options[rule]}
                            onChange={(checked) => setOptions({ ...options, [rule]: checked })}
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
                    actions={<CopyButton text={result.text} locale={locale} compact />}
                    data-tool-output=""
                />
            </div>
            {text !== "" && (
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
                            dir="rtl"
                            lang="fa"
                            className="mt-3 leading-8 break-words whitespace-pre-wrap"
                        >
                            {parts.map((part, index) =>
                                part.added ? (
                                    <ins
                                        key={index}
                                        className="rounded bg-success/15 text-success no-underline"
                                    >
                                        {visible(part.value)}
                                    </ins>
                                ) : part.removed ? (
                                    <del key={index} className="rounded bg-error-bg text-error">
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
