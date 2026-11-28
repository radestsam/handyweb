import { useEffect, useId, useState } from "react";
import { runInWorker, type WorkerLike } from "@handyweb/core/worker";
import type { ToolError, ToolResult } from "@handyweb/core/runtime";
import {
    Checkbox,
    CopyButton,
    ErrorMessage,
    Ltr,
    Pane,
    PaneAction,
    PasteButton,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { regexTesterMeta } from "./meta";
import { flagLabels, strings } from "./i18n";
import { backtrackingRisk, FLAGS, type Flag, type RegexInput, type RegexOutput } from "./logic";

const MAX = regexTesterMeta.limits?.maxInputBytes ?? Infinity;
const LIMIT = 1000;
const TIMEOUT_MS = 2000;
const HIGHLIGHT_LIMIT = 200_000;

const createWorker = (): WorkerLike =>
    new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });

function Highlighted({ text, result }: { text: string; result: RegexOutput }) {
    const pieces: React.ReactNode[] = [];
    let last = 0;
    result.matches.forEach((match, index) => {
        if (match.index > last) pieces.push(text.slice(last, match.index));
        pieces.push(
            <mark key={index} className="rounded bg-primary/25 text-text">
                {match.text === "" ? "\u200B" : match.text}
            </mark>,
        );
        last = Math.max(last, match.end);
    });
    pieces.push(text.slice(last));
    return (
        <p dir="auto" className="leading-8 break-words whitespace-pre-wrap" data-tool-highlight>
            {pieces}
        </p>
    );
}

export default function RegexTester({ locale }: ToolUiProps) {
    const [pattern, setPattern] = useState("\\d+");
    const [flags, setFlags] = useState<Record<Flag, boolean>>({
        g: true,
        i: false,
        m: false,
        s: false,
        u: true,
    });
    const [text, setText] = useState("");
    const [result, setResult] = useState<ToolResult<RegexOutput> | null>(null);
    const [busy, setBusy] = useState(false);
    const patternId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];
    const number = (n: number) => new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en").format(n);

    const flagText = FLAGS.filter((flag) => flags[flag]).join("");
    const tooLarge = text.length > MAX;
    const risk = backtrackingRisk(pattern);

    // Each change starts a new worker after a short pause. The old one is
    // terminated, so a slow pattern never piles up work.
    useEffect(() => {
        if (tooLarge || pattern === "") return;
        const controller = new AbortController();
        const timer = setTimeout(() => {
            void (async () => {
                setBusy(true);
                const input: RegexInput = { pattern, flags: flagText, text, limit: LIMIT };
                const next = await runInWorker<RegexInput, RegexOutput>(createWorker, input, {
                    signal: controller.signal,
                    timeoutMs: TIMEOUT_MS,
                });
                if (!controller.signal.aborted) {
                    setResult(next);
                    setBusy(false);
                }
            })();
        }, 150);
        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [pattern, flagText, text, tooLarge]);

    const error: ToolError | null = tooLarge
        ? { code: "too-large", message: strings.tooLarge }
        : result && !result.ok
          ? result.error.code === "timeout"
              ? { code: "timeout", message: strings.timeout }
              : result.error
          : null;
    const output = pattern !== "" && result?.ok && !tooLarge ? result.value : null;
    const listing = output
        ? output.matches.map((match) => `${match.index}\t${match.text}`).join("\n")
        : "";

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
                <label htmlFor={patternId} className="text-xs font-semibold text-muted">
                    {t("pattern")}
                </label>
                <div
                    dir="ltr"
                    className="flex min-h-12 items-center gap-1 rounded-xl border border-border bg-surface-2/60 px-4 font-mono transition-[border-color,box-shadow] duration-200 focus-within:border-focus focus-within:shadow-[0_0_0_4px_var(--hw-glow)]"
                >
                    <span aria-hidden="true" className="text-muted">
                        /
                    </span>
                    <input
                        id={patternId}
                        value={pattern}
                        onChange={(event) => setPattern(event.target.value)}
                        autoComplete="off"
                        spellCheck={false}
                        autoCapitalize="off"
                        className="min-w-0 flex-1 bg-transparent text-base text-text outline-none focus-visible:shadow-none focus-visible:outline-none"
                    />
                    <span aria-hidden="true" className="text-muted">
                        /{flagText}
                    </span>
                </div>
            </div>

            <fieldset className="flex flex-col gap-2">
                <legend className="mb-1.5 text-xs font-semibold text-muted">{t("flags")}</legend>
                <div className="grid gap-x-6 gap-y-1 sm:grid-cols-3">
                    {FLAGS.map((flag) => (
                        <Checkbox
                            key={flag}
                            label={flagLabels[flag][locale]}
                            checked={flags[flag]}
                            onChange={(checked) => setFlags({ ...flags, [flag]: checked })}
                        />
                    ))}
                </div>
            </fieldset>

            {risk && (
                <p
                    role="note"
                    className="rounded-2xl border border-primary/40 bg-primary-soft px-4 py-3 text-sm"
                    data-tool-risk
                >
                    ⚠ {t("risk")}
                </p>
            )}

            <Pane
                label={t("text")}
                locale={locale}
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder={UI_STRINGS.inputHere[locale]}
                className="min-h-36"
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

            {busy && !output && <p className="text-sm text-muted">{t("working")}</p>}
            {error && <ErrorMessage error={error} locale={locale} />}

            {output && text !== "" && (
                <section className="overflow-hidden rounded-2xl border border-border bg-bg">
                    <div className="flex min-h-11 items-center justify-between gap-2 border-b border-border/70 ps-4 pe-1.5">
                        <h2 className="text-xs font-semibold text-muted">
                            {t("matches")}:{" "}
                            <span data-tool-count>{number(output.matches.length)}</span>
                        </h2>
                        <CopyButton text={listing} locale={locale} compact />
                    </div>
                    <div className="px-4 py-3">
                        {output.matches.length === 0 ? (
                            <p className="text-muted">{t("noMatch")}</p>
                        ) : text.length > HIGHLIGHT_LIMIT ? (
                            <p className="text-muted">{t("highlightTooLarge")}</p>
                        ) : (
                            <Highlighted text={text} result={output} />
                        )}
                    </div>
                    {output.matches.length > 0 && (
                        <div className="max-h-96 overflow-auto border-t border-border/70">
                            <table className="w-full text-sm">
                                <thead className="text-xs text-muted">
                                    <tr className="border-b border-border/70">
                                        <th
                                            scope="col"
                                            className="px-3 py-2 text-start font-semibold"
                                        >
                                            {t("index")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-2 text-start font-semibold"
                                        >
                                            {t("match")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-2 text-start font-semibold"
                                        >
                                            {t("groups")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {output.matches.map((match, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-border/40 last:border-b-0"
                                        >
                                            <td className="px-3 py-1.5 tabular-nums">
                                                <Ltr>{match.index}</Ltr>
                                            </td>
                                            <td className="px-3 py-1.5">
                                                <bdi className="font-mono">{match.text}</bdi>
                                            </td>
                                            <td className="px-3 py-1.5 text-xs">
                                                <Ltr className="font-mono">
                                                    {[
                                                        ...match.groups.map(
                                                            (g, i) => `$${i + 1}=${g ?? "∅"}`,
                                                        ),
                                                        ...Object.entries(match.named).map(
                                                            ([name, g]) => `${name}=${g ?? "∅"}`,
                                                        ),
                                                    ].join("  ")}
                                                </Ltr>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {output.truncated && (
                        <p className="border-t border-border/70 px-4 py-2 text-xs text-muted">
                            {t("truncated")}
                        </p>
                    )}
                </section>
            )}
            <input type="hidden" value={listing} readOnly data-tool-output="" />
        </div>
    );
}
