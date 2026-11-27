import { useEffect, useMemo, useState } from "react";
import { runInWorker, type WorkerLike } from "@handyweb/core/worker";
import { toToolError, type ToolResult } from "@handyweb/core/runtime";
import {
    Checkbox,
    CopyButton,
    cx,
    ErrorMessage,
    Pane,
    PaneAction,
    PasteButton,
    Progress,
    Segmented,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { textDiffMeta } from "./meta";
import { strings } from "./i18n";
import {
    compareTexts,
    type DiffInput,
    type DiffOutput,
    type DiffPart,
    type Granularity,
} from "./logic";

/** Inputs larger than this run in a worker. */
const WORKER_THRESHOLD = 100_000;
/** Above this, the diff is not drawn; the patch can still be copied. */
const RENDER_LIMIT = 300_000;
const MAX = textDiffMeta.limits?.maxInputBytes ?? Infinity;

const createWorker = (): WorkerLike =>
    new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });

function runSync(input: DiffInput): ToolResult<DiffOutput> {
    try {
        return { ok: true, value: compareTexts(input) };
    } catch (error) {
        return { ok: false, error: toToolError(error) };
    }
}

/** Unchanged lines shown before and after a change. */
const CONTEXT = 3;
/** The line view draws at most this many rows, so a huge diff does not freeze the page. */
const MAX_ROWS = 2000;

type Row =
    | { kind: "line"; text: string; added: boolean; removed: boolean }
    | { kind: "skip"; count: number };

/** Turns the parts into rows. Long runs of unchanged lines collapse to a "skip" row. */
function toRows(parts: DiffPart[]): { rows: Row[]; cut: boolean } {
    const rows: Row[] = [];
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i] as DiffPart;
        const lines = part.value.replace(/\n$/, "").split("\n");
        const line = (text: string): Row => ({
            kind: "line",
            text,
            added: part.added,
            removed: part.removed,
        });
        if (part.added || part.removed) {
            rows.push(...lines.map(line));
        } else {
            const head = i === 0 ? 0 : CONTEXT;
            const tail = i === parts.length - 1 ? 0 : CONTEXT;
            if (lines.length > head + tail + 1) {
                rows.push(...lines.slice(0, head).map(line));
                rows.push({ kind: "skip", count: lines.length - head - tail });
                rows.push(...lines.slice(lines.length - tail).map(line));
            } else {
                rows.push(...lines.map(line));
            }
        }
        if (rows.length > MAX_ROWS) return { rows: rows.slice(0, MAX_ROWS), cut: true };
    }
    return { rows, cut: false };
}

function LineView({ parts, locale }: { parts: DiffPart[]; locale: "fa" | "en" }) {
    const { rows, cut } = toRows(parts);
    const number = (n: number) => new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en").format(n);
    return (
        <div className="font-mono text-sm leading-relaxed" data-tool-diff>
            {rows.map((row, index) =>
                row.kind === "skip" ? (
                    <div
                        key={index}
                        className="my-1 bg-surface-2 px-4 py-1 font-sans text-xs text-muted"
                    >
                        {unchanged(row.count, locale, number)}
                    </div>
                ) : (
                    <div
                        key={index}
                        className={cx(
                            "flex gap-3 px-4",
                            row.added && "bg-success/15",
                            row.removed && "bg-error-bg",
                        )}
                    >
                        <span
                            aria-hidden="true"
                            className={cx(
                                "w-3 shrink-0 select-none",
                                row.added && "text-success",
                                row.removed && "text-error",
                            )}
                        >
                            {row.added ? "+" : row.removed ? "−" : " "}
                        </span>
                        {row.added ? (
                            <ins
                                dir="auto"
                                className="min-w-0 flex-1 break-words whitespace-pre-wrap no-underline"
                            >
                                {row.text || " "}
                            </ins>
                        ) : row.removed ? (
                            <del
                                dir="auto"
                                className="min-w-0 flex-1 break-words whitespace-pre-wrap no-underline"
                            >
                                {row.text || " "}
                            </del>
                        ) : (
                            <span
                                dir="auto"
                                className="min-w-0 flex-1 break-words whitespace-pre-wrap"
                            >
                                {row.text || " "}
                            </span>
                        )}
                    </div>
                ),
            )}
            {cut && <p className="px-4 pt-2 font-sans text-xs text-muted">{strings.cut[locale]}</p>}
        </div>
    );
}

function unchanged(count: number, locale: "fa" | "en", number: (n: number) => string): string {
    return locale === "fa"
        ? `… ${number(count)} خط بی‌دگرگونی …`
        : `… ${number(count)} unchanged ${count === 1 ? "line" : "lines"} …`;
}

function InlineView({ parts }: { parts: DiffPart[] }) {
    return (
        <p dir="auto" className="px-4 leading-8 break-words whitespace-pre-wrap" data-tool-diff>
            {parts.map((part, index) =>
                part.added ? (
                    <ins key={index} className="rounded bg-success/15 text-success no-underline">
                        {part.value}
                    </ins>
                ) : part.removed ? (
                    <del key={index} className="rounded bg-error-bg text-error">
                        {part.value}
                    </del>
                ) : (
                    <span key={index}>{part.value}</span>
                ),
            )}
        </p>
    );
}

export default function TextDiff({ locale }: ToolUiProps) {
    const [original, setOriginal] = useState("");
    const [changed, setChanged] = useState("");
    const [granularity, setGranularity] = useState<Granularity>("lines");
    const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
    const [ignoreCase, setIgnoreCase] = useState(false);
    const [asyncResult, setAsyncResult] = useState<ToolResult<DiffOutput> | null>(null);
    const [busy, setBusy] = useState(false);
    const t = (key: keyof typeof strings) => strings[key][locale];
    const number = (n: number) => new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en").format(n);

    const size = original.length + changed.length;
    const empty = size === 0;
    const large = size > WORKER_THRESHOLD;
    const tooLarge = size > MAX;
    const input = useMemo<DiffInput>(
        () => ({ original, changed, granularity, ignoreWhitespace, ignoreCase }),
        [original, changed, granularity, ignoreWhitespace, ignoreCase],
    );
    const syncResult = useMemo(
        () => (empty || large ? null : runSync(input)),
        [input, empty, large],
    );

    useEffect(() => {
        if (!large || tooLarge) return;
        const controller = new AbortController();
        void (async () => {
            setBusy(true);
            const result = await runInWorker<DiffInput, DiffOutput>(createWorker, input, {
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

    const result: ToolResult<DiffOutput> | null = tooLarge
        ? { ok: false, error: { code: "too-large", message: strings.tooLarge } }
        : large
          ? busy
              ? null
              : asyncResult
          : syncResult;
    const diff = result?.ok ? result.value : null;
    const rendered = diff ? diff.parts.reduce((sum, part) => sum + part.value.length, 0) : 0;

    const paneActions = (value: string, set: (text: string) => void) => (
        <>
            <PasteButton locale={locale} onPaste={set} />
            <PaneAction
                icon="clear"
                label={UI_STRINGS.clear[locale]}
                onClick={() => set("")}
                disabled={value === ""}
            />
        </>
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                <Segmented<Granularity>
                    legend={t("compareBy")}
                    value={granularity}
                    onChange={setGranularity}
                    options={[
                        { value: "lines", label: t("lines") },
                        { value: "words", label: t("words") },
                        { value: "chars", label: t("chars") },
                    ]}
                />
                <div className="pb-1">
                    {granularity === "lines" ? (
                        <Checkbox
                            label={t("ignoreWhitespace")}
                            checked={ignoreWhitespace}
                            onChange={setIgnoreWhitespace}
                        />
                    ) : (
                        <Checkbox
                            label={t("ignoreCase")}
                            checked={ignoreCase}
                            onChange={setIgnoreCase}
                        />
                    )}
                </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
                <Pane
                    label={t("original")}
                    locale={locale}
                    value={original}
                    onChange={(event) => setOriginal(event.target.value)}
                    placeholder={UI_STRINGS.inputHere[locale]}
                    actions={paneActions(original, setOriginal)}
                    data-tool-input=""
                />
                <Pane
                    label={t("changed")}
                    locale={locale}
                    value={changed}
                    onChange={(event) => setChanged(event.target.value)}
                    placeholder={UI_STRINGS.inputHere[locale]}
                    actions={paneActions(changed, setChanged)}
                />
            </div>

            {busy && <Progress value={null} locale={locale} />}
            {result && !result.ok && <ErrorMessage error={result.error} locale={locale} />}

            {diff && (
                <section
                    className="overflow-hidden rounded-2xl border border-border bg-bg"
                    aria-label={t("result")}
                >
                    <div className="flex min-h-11 flex-wrap items-center justify-between gap-2 border-b border-border/70 ps-4 pe-1.5">
                        <span className="flex gap-3 text-xs font-semibold" data-tool-summary>
                            <span className="text-muted">{t("result")}</span>
                            <span className="text-success">
                                +{number(diff.added)} {t("added")}
                            </span>
                            <span className="text-error">
                                −{number(diff.removed)} {t("removed")}
                            </span>
                        </span>
                        <span className="flex items-center gap-1 text-xs">
                            {t("copyPatch")}
                            <CopyButton text={diff.patch} locale={locale} compact />
                        </span>
                    </div>
                    <div className="max-h-[32rem] overflow-auto py-3">
                        {diff.identical ? (
                            <p className="px-4 text-muted" data-tool-identical>
                                {t("identical")}
                            </p>
                        ) : rendered > RENDER_LIMIT ? (
                            <p className="px-4 text-muted">{t("tooLargeToShow")}</p>
                        ) : granularity === "lines" ? (
                            <LineView parts={diff.parts} locale={locale} />
                        ) : (
                            <InlineView parts={diff.parts} />
                        )}
                    </div>
                    <input
                        type="hidden"
                        value={diff.identical ? t("identical") : diff.patch}
                        readOnly
                        data-tool-output=""
                    />
                </section>
            )}
        </div>
    );
}
