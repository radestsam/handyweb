import { useEffect, useId, useState } from "react";
import { runInWorker, type WorkerLike } from "@handyweb/core/worker";
import type { ToolError, ToolResult } from "@handyweb/core/runtime";
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
import { strings } from "./i18n";
import type { ReplaceInput, ReplaceOutput } from "./logic";

const createWorker = (): WorkerLike =>
    new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });

const FIELD =
    "min-h-11 w-full rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";

export default function FindReplace({ locale, presetOptions }: ToolUiProps) {
    const [find, setFind] = useState("");
    const [replace, setReplace] = useState("");
    const [mode, setMode] = useState<"text" | "regex">(
        presetOptions?.["mode"] === "regex" ? "regex" : "text",
    );
    const [ignoreCase, setIgnoreCase] = useState(false);
    const [wholeWord, setWholeWord] = useState(false);
    const [all, setAll] = useState(true);
    const [text, setText] = useState("");
    const [result, setResult] = useState<ToolResult<ReplaceOutput> | null>(null);
    const findId = useId();
    const replaceId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];
    const number = (n: number) => new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en").format(n);

    useEffect(() => {
        const controller = new AbortController();
        const input: ReplaceInput = { text, find, replace, mode, ignoreCase, wholeWord, all };
        const timer = setTimeout(() => {
            void (async () => {
                const next = await runInWorker<ReplaceInput, ReplaceOutput>(createWorker, input, {
                    signal: controller.signal,
                    timeoutMs: 2000,
                });
                if (!controller.signal.aborted) setResult(next);
            })();
        }, 150);
        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [text, find, replace, mode, ignoreCase, wholeWord, all]);

    const error: ToolError | null =
        result && !result.ok
            ? result.error.code === "timeout"
                ? { code: "timeout", message: strings.timeout }
                : result.error
            : null;
    const output = result?.ok ? result.value.text : "";

    return (
        <div className="flex flex-col gap-5">
            <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor={findId} className="text-xs font-semibold text-muted">
                        {t("find")}
                    </label>
                    <input
                        id={findId}
                        dir="auto"
                        value={find}
                        onChange={(event) => setFind(event.target.value)}
                        autoComplete="off"
                        spellCheck={false}
                        className={`${FIELD} ${mode === "regex" ? "font-mono" : ""}`}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor={replaceId} className="text-xs font-semibold text-muted">
                        {t("replace")}
                    </label>
                    <input
                        id={replaceId}
                        dir="auto"
                        value={replace}
                        onChange={(event) => setReplace(event.target.value)}
                        autoComplete="off"
                        spellCheck={false}
                        className={FIELD}
                    />
                </div>
            </div>
            <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
                <Segmented<"text" | "regex">
                    legend={t("mode")}
                    value={mode}
                    onChange={setMode}
                    options={[
                        { value: "text", label: t("text") },
                        { value: "regex", label: t("regex") },
                    ]}
                />
                <div className="flex flex-wrap gap-x-5 gap-y-1 pb-1">
                    <Checkbox
                        label={t("ignoreCase")}
                        checked={ignoreCase}
                        onChange={setIgnoreCase}
                    />
                    {mode === "text" && (
                        <Checkbox
                            label={t("wholeWord")}
                            checked={wholeWord}
                            onChange={setWholeWord}
                        />
                    )}
                    <Checkbox label={t("all")} checked={all} onChange={setAll} />
                </div>
            </div>
            {mode === "regex" && <p className="-mt-3 text-xs text-muted">{t("regexHint")}</p>}
            {error && <ErrorMessage error={error} locale={locale} />}
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
                    meta={
                        result?.ok && find !== "" ? (
                            <span data-tool-count>
                                {number(result.value.count)} {t("count")}
                            </span>
                        ) : undefined
                    }
                    actions={<CopyButton text={output} locale={locale} compact />}
                    data-tool-output=""
                />
            </div>
        </div>
    );
}
