import { useId, useMemo, useState } from "react";
import { toToolError, type ToolResult } from "@handyweb/core/runtime";
import {
    Button,
    Checkbox,
    CopyButton,
    ErrorMessage,
    Pane,
    Segmented,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { strings } from "./i18n";
import { generateLorem, MAX_COUNT, type Language, type Unit } from "./logic";

export default function LoremIpsum({ locale, presetOptions }: ToolUiProps) {
    const [language, setLanguage] = useState<Language>(
        presetOptions?.["language"] === "la" ? "la" : locale === "fa" ? "fa" : "la",
    );
    const [unit, setUnit] = useState<Unit>("paragraphs");
    const [count, setCount] = useState("3");
    const [classicStart, setClassicStart] = useState(true);
    // Changing this number draws new text with the same options.
    const [round, setRound] = useState(0);
    const countId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];

    const result = useMemo((): ToolResult<string> => {
        try {
            return {
                ok: true,
                value: generateLorem({ language, unit, count: Number(count), classicStart }),
            };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
        // `round` is a dependency on purpose: it asks for new text.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language, unit, count, classicStart, round]);
    const output = result.ok ? result.value : "";

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                <Segmented<Language>
                    legend={t("language")}
                    value={language}
                    onChange={setLanguage}
                    options={[
                        { value: "fa", label: t("fa") },
                        { value: "la", label: t("la") },
                    ]}
                />
                <Segmented<Unit>
                    legend={t("unit")}
                    value={unit}
                    onChange={setUnit}
                    options={(["paragraphs", "sentences", "words"] as const).map((value) => ({
                        value,
                        label: t(value),
                    }))}
                />
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
                        className="min-h-11 w-24 rounded-xl border border-border bg-surface-2/60 px-3 text-base tabular-nums text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]"
                        data-tool-input=""
                    />
                </div>
            </div>
            {language === "la" && (
                <Checkbox
                    label={t("classicStart")}
                    checked={classicStart}
                    onChange={setClassicStart}
                />
            )}
            {!result.ok && <ErrorMessage error={result.error} locale={locale} />}
            <Pane
                label={t(unit)}
                locale={locale}
                value={output}
                readOnly
                className="min-h-64"
                actions={<CopyButton text={output} locale={locale} compact />}
                data-tool-output=""
            />
            <div className="flex justify-end">
                <Button variant="primary" onClick={() => setRound(round + 1)}>
                    {t("regenerate")}
                </Button>
            </div>
        </div>
    );
}
