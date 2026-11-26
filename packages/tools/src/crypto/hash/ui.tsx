import { useEffect, useId, useRef, useState } from "react";
import { formatBytes } from "@handyweb/core/files";
import type { Progress as ProgressValue, ToolError } from "@handyweb/core/runtime";
import { toToolError } from "@handyweb/core/runtime";
import { runInWorker, type WorkerLike } from "@handyweb/core/worker";
import {
    CopyButton,
    cx,
    ErrorMessage,
    FileDrop,
    Icon,
    Ltr,
    Pane,
    PaneAction,
    PasteButton,
    Segmented,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { hashMeta } from "./meta";
import { strings } from "./i18n";
import { digestsMatch, encodeDigest, hashText, type OutputEncoding } from "./logic";
import type { HashFileInput } from "./worker";

type Source = "text" | "file";

const MAX_TEXT = hashMeta.limits?.maxInputBytes ?? Infinity;

const createWorker = (): WorkerLike =>
    new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });

export default function HashTool({ locale, presetOptions }: ToolUiProps) {
    const [source, setSource] = useState<Source>(
        presetOptions?.["source"] === "file" ? "file" : "text",
    );
    const [encoding, setEncoding] = useState<OutputEncoding>("hex");
    const [text, setText] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [digest, setDigest] = useState<Uint8Array | null>(null);
    const [error, setError] = useState<ToolError | null>(null);
    const [progress, setProgress] = useState<ProgressValue | null>(null);
    const [expected, setExpected] = useState("");
    const job = useRef<AbortController | null>(null);
    const t = (key: keyof typeof strings) => strings[key][locale];
    const compareId = useId();

    // Text: hash on every change. Web Crypto is fast for text of this size.
    useEffect(() => {
        if (source !== "text") return;
        let current = true;
        void (async () => {
            if (text.length > MAX_TEXT) {
                if (current) {
                    setDigest(null);
                    setError({ code: "too-large", message: strings.tooLarge });
                }
                return;
            }
            try {
                const bytes = await hashText(text);
                if (current) {
                    setDigest(bytes);
                    setError(null);
                }
            } catch (caught) {
                if (current) setError(toToolError(caught));
            }
        })();
        return () => {
            current = false;
        };
    }, [text, source]);

    // Cancel a running file job when the tool unmounts.
    useEffect(() => () => job.current?.abort(), []);

    const hashFile = async (picked: File) => {
        job.current?.abort();
        const controller = new AbortController();
        job.current = controller;
        setFile(picked);
        setDigest(null);
        setError(null);
        setProgress({ completed: 0, total: picked.size });
        const result = await runInWorker<HashFileInput, Uint8Array>(
            createWorker,
            { file: picked },
            { signal: controller.signal, onProgress: setProgress },
        );
        if (job.current !== controller) return;
        job.current = null;
        setProgress(null);
        if (result.ok) setDigest(result.value);
        else setError(result.error);
    };

    const cancel = () => job.current?.abort();

    const reset = () => {
        job.current?.abort();
        job.current = null;
        setText("");
        setFile(null);
        setDigest(null);
        setError(null);
        setProgress(null);
        setExpected("");
    };

    const changeSource = (next: Source) => {
        reset();
        setSource(next);
    };

    const output = digest ? encodeDigest(digest, encoding) : "";
    const match = digest ? digestsMatch(digest, expected) : null;
    // Hex reads in groups of 8. The groups are spacing only, so a copy has no spaces.
    const groups = encoding === "hex" ? (output.match(/.{1,8}/g) ?? []) : [output];
    const percent =
        progress && progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                <Segmented<Source>
                    legend={t("source")}
                    value={source}
                    onChange={changeSource}
                    options={[
                        { value: "text", label: t("text") },
                        { value: "file", label: t("file") },
                    ]}
                />
                <Segmented<OutputEncoding>
                    legend={t("encoding")}
                    value={encoding}
                    onChange={setEncoding}
                    options={[
                        { value: "hex", label: t("hex") },
                        { value: "base64", label: t("base64") },
                    ]}
                />
            </div>

            {source === "text" ? (
                <Pane
                    label={UI_STRINGS.input[locale]}
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
            ) : file ? (
                <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-2/60 p-4">
                    <div className="flex items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface text-muted">
                            <Icon name="file" className="size-5" />
                        </span>
                        <div className="min-w-0 flex-1" data-tool-file>
                            <Ltr className="block truncate font-semibold">{file.name}</Ltr>
                            <span className="text-xs text-muted tabular-nums">
                                {formatBytes(file.size, locale)}
                            </span>
                        </div>
                        {progress ? (
                            <PaneAction
                                icon="clear"
                                label={UI_STRINGS.cancel[locale]}
                                onClick={cancel}
                                data-tool-cancel=""
                            />
                        ) : (
                            <PaneAction
                                icon="clear"
                                label={UI_STRINGS.clear[locale]}
                                onClick={reset}
                            />
                        )}
                    </div>
                    {progress && (
                        <div
                            role="progressbar"
                            aria-label={UI_STRINGS.working[locale]}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Math.round(percent)}
                            className="h-1 overflow-hidden rounded-full bg-border"
                        >
                            <div
                                className="h-full rounded-full bg-primary transition-[width] duration-200"
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <FileDrop locale={locale} onFile={(picked) => void hashFile(picked)} />
            )}

            {error && <ErrorMessage error={error} locale={locale} />}

            <section
                className="overflow-hidden rounded-2xl border border-border bg-bg"
                aria-label={t("digest")}
            >
                <div className="flex min-h-11 items-center justify-between gap-2 border-b border-border/70 ps-4 pe-1.5">
                    <span className="text-xs font-semibold text-muted">{t("digest")}</span>
                    <CopyButton text={output} locale={locale} compact />
                </div>
                <div dir="ltr" className="min-h-24 px-4 py-5 select-all">
                    {output ? (
                        <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-lg leading-relaxed text-text sm:text-xl">
                            {groups.map((group, index) => (
                                <span
                                    key={index}
                                    className={index % 2 === 1 ? "text-muted" : undefined}
                                >
                                    {group}
                                </span>
                            ))}
                        </p>
                    ) : (
                        <p dir="auto" className="text-muted">
                            {UI_STRINGS.outputHere[locale]}
                        </p>
                    )}
                </div>
                <input type="hidden" value={output} readOnly data-tool-output="" />
            </section>

            <div
                className={cx(
                    "flex items-center gap-3 rounded-2xl border bg-surface-2/60 ps-4 pe-3 transition-[border-color,box-shadow] duration-200 focus-within:border-focus focus-within:shadow-[0_0_0_4px_var(--hw-glow)]",
                    match === true
                        ? "border-success"
                        : match === false
                          ? "border-error"
                          : "border-border",
                )}
            >
                <label htmlFor={compareId} className="sr-only">
                    {t("expected")}
                </label>
                <input
                    id={compareId}
                    dir="ltr"
                    value={expected}
                    onChange={(event) => setExpected(event.target.value)}
                    placeholder={t("expected")}
                    autoComplete="off"
                    spellCheck={false}
                    className="min-h-12 min-w-0 flex-1 bg-transparent font-mono text-sm text-text outline-none placeholder:font-sans placeholder:text-muted/80 focus-visible:shadow-none focus-visible:outline-none"
                />
                {match !== null && (
                    <span
                        role="status"
                        className={cx(
                            "inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold",
                            match ? "text-success" : "text-error",
                        )}
                        data-tool-match={match ? "yes" : "no"}
                    >
                        <Icon name={match ? "check" : "clear"} />
                        {match ? t("match") : t("mismatch")}
                    </span>
                )}
            </div>
        </div>
    );
}
