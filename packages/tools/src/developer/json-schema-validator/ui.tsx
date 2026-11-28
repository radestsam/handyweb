import { useId, useMemo, useState } from "react";
import { toToolError, type ToolResult } from "@handyweb/core/runtime";
import {
    CopyButton,
    ErrorMessage,
    Ltr,
    Pane,
    PaneAction,
    PasteButton,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { jsonSchemaValidatorMeta } from "./meta";
import { strings } from "./i18n";
import { DRAFTS, validateJson, type Draft, type ValidationResult } from "./logic";

const MAX = jsonSchemaValidatorMeta.limits?.maxInputBytes ?? Infinity;

export default function JsonSchemaValidator({ locale }: ToolUiProps) {
    const [data, setData] = useState("");
    const [schema, setSchema] = useState("");
    const [draft, setDraft] = useState<Draft>("auto");
    const draftId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];
    const number = (n: number) => new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en").format(n);

    const result = useMemo((): ToolResult<ValidationResult> | null => {
        if (data.trim() === "") return null;
        if (data.length + schema.length > MAX) {
            return {
                ok: false,
                error: {
                    code: "too-large",
                    message: {
                        fa: "ورودی‌ها بیش از ۵ مگابایت‌اند.",
                        en: "The inputs are larger than 5 MB.",
                    },
                },
            };
        }
        try {
            // An empty schema box is the empty schema {}, which accepts any data.
            return {
                ok: true,
                value: validateJson(schema.trim() === "" ? "{}" : schema, data, draft),
            };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [data, schema, draft]);
    const value = result?.ok ? result.value : null;
    const listing = value
        ? value.valid
            ? t("valid")
            : value.errors.map((error) => `${error.path}: ${error.message}`).join("\n")
        : "";

    const pane = (label: string, text: string, set: (v: string) => void, input: boolean) => (
        <Pane
            label={label}
            locale={locale}
            code
            value={text}
            onChange={(event) => set(event.target.value)}
            placeholder={UI_STRINGS.inputHere[locale]}
            className="min-h-64"
            actions={
                <>
                    <PasteButton locale={locale} onPaste={set} />
                    <PaneAction
                        icon="clear"
                        label={UI_STRINGS.clear[locale]}
                        onClick={() => set("")}
                        disabled={text === ""}
                    />
                </>
            }
            {...(input ? { "data-tool-input": "" } : {})}
        />
    );

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
                <label htmlFor={draftId} className="text-xs font-semibold text-muted">
                    {t("draft")}
                </label>
                <select
                    id={draftId}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value as Draft)}
                    className="min-h-11 w-full rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)] sm:w-60"
                >
                    {DRAFTS.map((value) => (
                        <option key={value} value={value}>
                            {value === "auto" ? t("auto") : `Draft ${value}`}
                        </option>
                    ))}
                </select>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
                {pane(t("data"), data, setData, true)}
                {pane(t("schema"), schema, setSchema, false)}
            </div>
            {result && !result.ok && <ErrorMessage error={result.error} locale={locale} />}
            {value && (
                <section className="overflow-hidden rounded-2xl border border-border bg-bg">
                    <div className="flex min-h-11 items-center justify-between gap-2 border-b border-border/70 ps-4 pe-1.5">
                        {value.valid ? (
                            <span
                                className="text-sm font-semibold text-success"
                                data-tool-status="valid"
                            >
                                ✓ {t("valid")}
                            </span>
                        ) : (
                            <span
                                className="text-sm font-semibold text-error"
                                data-tool-status="invalid"
                            >
                                {number(value.errors.length)} {t("invalid")}
                            </span>
                        )}
                        <CopyButton text={listing} locale={locale} compact />
                    </div>
                    {schema.trim() === "" && (
                        <p className="px-4 pt-3 text-xs text-muted">{t("emptySchema")}</p>
                    )}
                    {!value.valid && (
                        <ul className="max-h-96 divide-y divide-border/50 overflow-auto">
                            {value.errors.map((error, index) => (
                                <li
                                    key={index}
                                    className="flex flex-col gap-0.5 px-4 py-2.5 text-sm"
                                >
                                    <Ltr as="code" className="font-mono font-semibold break-all">
                                        {error.path}
                                    </Ltr>
                                    <Ltr className="text-xs text-muted">
                                        {error.message} ({error.schemaPath})
                                    </Ltr>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            )}
            <input type="hidden" value={listing} readOnly data-tool-output="" />
        </div>
    );
}
