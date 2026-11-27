import { useMemo, useState } from "react";
import { toToolError, type ToolResult } from "@handyweb/core/runtime";
import {
    Checkbox,
    CopyButton,
    cx,
    ErrorMessage,
    Ltr,
    Pane,
    PaneAction,
    PasteButton,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { jsonDiffMeta } from "./meta";
import { kindLabels, strings } from "./i18n";
import { changesToText, diffJson, type JsonChange } from "./logic";

const MAX = jsonDiffMeta.limits?.maxInputBytes ?? Infinity;
const SHOWN = 1000;
const COLORS = {
    added: "text-success",
    removed: "text-error",
    changed: "text-primary-text",
    type: "text-primary-text",
} as const;

export default function JsonDiff({ locale }: ToolUiProps) {
    const [left, setLeft] = useState("");
    const [right, setRight] = useState("");
    const [ignoreArrayOrder, setIgnoreArrayOrder] = useState(false);
    const t = (key: keyof typeof strings) => strings[key][locale];
    const number = (n: number) => new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en").format(n);

    const result = useMemo((): ToolResult<JsonChange[]> | null => {
        if (left.trim() === "" && right.trim() === "") return null;
        if (left.length + right.length > MAX) {
            return {
                ok: false,
                error: {
                    code: "too-large",
                    message: {
                        fa: "دو ورودی بیش از ۱۰ مگابایت‌اند.",
                        en: "The two inputs are larger than 10 MB.",
                    },
                },
            };
        }
        try {
            // An empty box counts as an empty object, so one document alone shows all its values.
            const a = left.trim() === "" ? "{}" : left;
            const b = right.trim() === "" ? "{}" : right;
            return { ok: true, value: diffJson(a, b, { ignoreArrayOrder }) };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [left, right, ignoreArrayOrder]);
    const changes = result?.ok ? result.value : null;
    const text = changes ? changesToText(changes) : "";

    const pane = (label: string, value: string, set: (v: string) => void, input: boolean) => (
        <Pane
            label={label}
            locale={locale}
            code
            value={value}
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
                        disabled={value === ""}
                    />
                </>
            }
            {...(input ? { "data-tool-input": "" } : {})}
        />
    );

    return (
        <div className="flex flex-col gap-5">
            <Checkbox
                label={t("ignoreArrayOrder")}
                checked={ignoreArrayOrder}
                onChange={setIgnoreArrayOrder}
            />
            <div className="grid gap-3 lg:grid-cols-2">
                {pane(t("left"), left, setLeft, true)}
                {pane(t("right"), right, setRight, false)}
            </div>
            {result && !result.ok && <ErrorMessage error={result.error} locale={locale} />}
            {changes && (
                <section className="overflow-hidden rounded-2xl border border-border bg-bg">
                    <div className="flex min-h-11 items-center justify-between gap-2 border-b border-border/70 ps-4 pe-1.5">
                        <h2 className="text-xs font-semibold text-muted">
                            {t("changes")}: <span data-tool-count>{number(changes.length)}</span>
                        </h2>
                        <CopyButton text={text} locale={locale} compact />
                    </div>
                    {changes.length === 0 ? (
                        <p className="px-4 py-4 text-muted" data-tool-identical>
                            {t("identical")}
                        </p>
                    ) : (
                        <ul className="max-h-[32rem] divide-y divide-border/50 overflow-auto">
                            {changes.slice(0, SHOWN).map((change, index) => (
                                <li key={index} className="flex flex-col gap-1 px-4 py-2.5 text-sm">
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                        <span
                                            className={cx(
                                                "text-xs font-semibold",
                                                COLORS[change.kind],
                                            )}
                                        >
                                            {kindLabels[change.kind][locale]}
                                        </span>
                                        <Ltr as="code" className="font-mono break-all">
                                            {change.path}
                                        </Ltr>
                                    </div>
                                    <Ltr
                                        as="code"
                                        className="font-mono text-xs break-all text-muted"
                                    >
                                        {change.kind === "added"
                                            ? JSON.stringify(change.after)
                                            : change.kind === "removed"
                                              ? JSON.stringify(change.before)
                                              : `${JSON.stringify(change.before)} → ${JSON.stringify(change.after)}`}
                                    </Ltr>
                                </li>
                            ))}
                        </ul>
                    )}
                    {changes.length > SHOWN && (
                        <p className="border-t border-border/70 px-4 py-2 text-xs text-muted">
                            {t("truncated")}
                        </p>
                    )}
                </section>
            )}
            <input
                type="hidden"
                value={changes ? (changes.length === 0 ? t("identical") : text) : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
