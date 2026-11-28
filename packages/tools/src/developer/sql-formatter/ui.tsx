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
import { sqlFormatterMeta } from "./meta";
import { strings } from "./i18n";
import { DIALECT_LABELS, DIALECT_NAMES, formatSql, type Dialect, type KeywordCase } from "./logic";

const MAX = sqlFormatterMeta.limits?.maxInputBytes ?? Infinity;

export default function SqlFormatter({ locale, presetOptions }: ToolUiProps) {
    const preset = presetOptions?.["dialect"];
    const [dialect, setDialect] = useState<Dialect>(
        DIALECT_NAMES.find((value) => value === preset) ?? "sql",
    );
    const [keywordCase, setKeywordCase] = useState<KeywordCase>("upper");
    const [indent, setIndent] = useState<"2" | "4">("2");
    const [text, setText] = useState("");
    const dialectId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];

    const result = useMemo((): ToolResult<string> | null => {
        if (text.trim() === "") return null;
        if (text.length > MAX) {
            return {
                ok: false,
                error: {
                    code: "too-large",
                    message: {
                        fa: "ورودی بیش از ۱ مگابایت است.",
                        en: "The input is larger than 1 MB.",
                    },
                },
            };
        }
        try {
            return {
                ok: true,
                value: formatSql(text, { dialect, keywordCase, indent: Number(indent) as 2 | 4 }),
            };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [text, dialect, keywordCase, indent]);
    const output = result?.ok ? result.value : "";

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor={dialectId} className="text-xs font-semibold text-muted">
                        {t("dialect")}
                    </label>
                    <select
                        id={dialectId}
                        value={dialect}
                        onChange={(event) => setDialect(event.target.value as Dialect)}
                        className="min-h-11 rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]"
                    >
                        {DIALECT_NAMES.map((value) => (
                            <option key={value} value={value}>
                                {DIALECT_LABELS[value]}
                            </option>
                        ))}
                    </select>
                </div>
                <Segmented<KeywordCase>
                    legend={t("keywordCase")}
                    value={keywordCase}
                    onChange={setKeywordCase}
                    options={(["upper", "lower", "preserve"] as const).map((value) => ({
                        value,
                        label: t(value),
                    }))}
                />
                <Segmented<"2" | "4">
                    legend={t("indent")}
                    value={indent}
                    onChange={setIndent}
                    options={[
                        { value: "2", label: t("spaces2") },
                        { value: "4", label: t("spaces4") },
                    ]}
                />
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
                <Pane
                    label={UI_STRINGS.input[locale]}
                    locale={locale}
                    code
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder={UI_STRINGS.inputHere[locale]}
                    className="min-h-72"
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
                    code
                    value={output}
                    readOnly
                    placeholder={UI_STRINGS.outputHere[locale]}
                    className="min-h-72"
                    actions={<CopyButton text={output} locale={locale} compact />}
                    data-tool-output=""
                />
            </div>
            {result && !result.ok && <ErrorMessage error={result.error} locale={locale} />}
        </div>
    );
}
