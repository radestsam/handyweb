import { useEffect, useMemo, useState } from "react";
import { runInWorker, type WorkerLike } from "@handyweb/core/worker";
import { toToolError, type ToolError, type ToolResult } from "@handyweb/core/runtime";
import {
    Checkbox,
    CopyButton,
    ErrorMessage,
    Pane,
    PaneAction,
    PasteButton,
    Progress,
    Segmented,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { jsonFormatterMeta } from "./meta";
import { duplicateKey, precision, strings } from "./i18n";
import { processJson, type Action, type Indent, type JsonInput, type JsonOutput } from "./logic";

/** Inputs larger than this run in a worker, so the page stays responsive. */
const WORKER_THRESHOLD = 1_000_000;
const MAX_BYTES = jsonFormatterMeta.limits?.maxInputBytes ?? Infinity;

const createWorker = (): WorkerLike =>
    new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });

function runSync(input: JsonInput): ToolResult<JsonOutput> {
    try {
        return { ok: true, value: processJson(input) };
    } catch (error) {
        return { ok: false, error: toToolError(error) };
    }
}

export default function JsonFormatter({ locale, presetOptions }: ToolUiProps) {
    const preset = presetOptions?.["action"];
    const [action, setAction] = useState<Action>(
        preset === "validate" || preset === "minify" ? preset : "format",
    );
    const [indent, setIndent] = useState<Indent>("2");
    const [sortKeys, setSortKeys] = useState(false);
    const [text, setText] = useState("");
    const [asyncResult, setAsyncResult] = useState<ToolResult<JsonOutput> | null>(null);
    const [busy, setBusy] = useState(false);
    const t = (key: keyof typeof strings) => strings[key][locale];

    const large = text.length > WORKER_THRESHOLD;
    const tooLarge = text.length > MAX_BYTES;
    const input = useMemo<JsonInput>(
        () => ({ text, action, indent, sortKeys }),
        [text, action, indent, sortKeys],
    );

    const syncResult = useMemo(
        () => (text === "" || large ? null : runSync(input)),
        [input, text, large],
    );

    useEffect(() => {
        if (!large || tooLarge) return;
        const controller = new AbortController();
        void (async () => {
            setBusy(true);
            const result = await runInWorker<JsonInput, JsonOutput>(createWorker, input, {
                signal: controller.signal,
                timeoutMs: 60_000,
            });
            if (!controller.signal.aborted) {
                setAsyncResult(result);
                setBusy(false);
            }
        })();
        return () => controller.abort();
    }, [input, large, tooLarge]);

    const tooLargeError: ToolError = { code: "too-large", message: strings.tooLarge };
    const result: ToolResult<JsonOutput> | null = tooLarge
        ? { ok: false, error: tooLargeError }
        : large
          ? busy
              ? null
              : asyncResult
          : syncResult;

    const output = result?.ok ? result.value.output : "";
    const warnings = result?.ok ? result.value.warnings : [];

    const status = busy ? (
        <span>{UI_STRINGS.working[locale]}</span>
    ) : result?.ok ? (
        <span className="font-semibold text-success" data-tool-status="valid">
            ✓ {t("valid")}
        </span>
    ) : null;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                <Segmented<Action>
                    legend={t("action")}
                    value={action}
                    onChange={setAction}
                    options={[
                        { value: "format", label: t("format") },
                        { value: "minify", label: t("minify") },
                        { value: "validate", label: t("validate") },
                    ]}
                />
                {action === "format" && (
                    <Segmented<Indent>
                        legend={t("indent")}
                        value={indent}
                        onChange={setIndent}
                        options={[
                            { value: "2", label: t("spaces2") },
                            { value: "4", label: t("spaces4") },
                            { value: "tab", label: t("tab") },
                        ]}
                    />
                )}
                {action !== "validate" && (
                    <div className="pb-1">
                        <Checkbox label={t("sortKeys")} checked={sortKeys} onChange={setSortKeys} />
                    </div>
                )}
            </div>

            <div className={action === "validate" ? "grid gap-3" : "grid gap-3 lg:grid-cols-2"}>
                <Pane
                    label={UI_STRINGS.input[locale]}
                    locale={locale}
                    code
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder={UI_STRINGS.inputHere[locale]}
                    className="min-h-80"
                    meta={action === "validate" ? status : undefined}
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
                {action !== "validate" && (
                    <Pane
                        label={UI_STRINGS.output[locale]}
                        locale={locale}
                        code
                        value={output}
                        readOnly
                        placeholder={UI_STRINGS.outputHere[locale]}
                        className="min-h-80"
                        meta={status}
                        actions={<CopyButton text={output} locale={locale} compact />}
                        data-tool-output=""
                    />
                )}
            </div>

            {busy && <Progress value={null} locale={locale} />}
            {result && !result.ok && <ErrorMessage error={result.error} locale={locale} />}
            {warnings.length > 0 && (
                <div className="rounded-2xl border border-border bg-surface-2/60 px-4 py-3 text-sm">
                    <p className="font-semibold">{t("warnings")}</p>
                    <ul className="mt-1 list-disc ps-5 text-muted">
                        {warnings.slice(0, 50).map((warning, index) => (
                            <li key={index}>
                                {warning.kind === "duplicate-key"
                                    ? duplicateKey(warning.key, warning.line, warning.column)[
                                          locale
                                      ]
                                    : precision(warning.number, warning.line, warning.column)[
                                          locale
                                      ]}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
