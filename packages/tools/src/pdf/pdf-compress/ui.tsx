import { useState } from "react";
import { downloadBlob, formatBytes } from "@handyweb/core/files";
import { toToolError, type ToolError } from "@handyweb/core/runtime";
import {
    Button,
    ErrorMessage,
    FileDrop,
    Ltr,
    Progress,
    Segmented,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { strings } from "./i18n";
import { recompressJpeg } from "./jpeg";
import { compressedName, compressPdf, MAX_FILE_BYTES, saving, type Level } from "./logic";

interface Result {
    blob: Blob;
    name: string;
    imagesFound: number;
    imagesChanged: number;
}

export default function PdfCompress({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const [file, setFile] = useState<File | null>(null);
    const [level, setLevel] = useState<Level>("medium");
    const [busy, setBusy] = useState(false);
    const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);
    const [result, setResult] = useState<Result | null>(null);
    const [error, setError] = useState<ToolError | null>(null);

    const reset = () => {
        setFile(null);
        setResult(null);
        setError(null);
    };

    const pick = (picked: File) => {
        reset();
        if (picked.size > MAX_FILE_BYTES) {
            setError({ code: "too-large", message: strings.tooLarge });
            return;
        }
        setFile(picked);
    };

    const compress = async () => {
        if (!file) return;
        setBusy(true);
        setError(null);
        setResult(null);
        setProgress({ completed: 0, total: 0 });
        try {
            const output = await compressPdf(
                new Uint8Array(await file.arrayBuffer()),
                level,
                recompressJpeg,
                (completed, total) => setProgress({ completed, total }),
            );
            setResult({
                blob: new Blob([output.bytes as Uint8Array<ArrayBuffer>], {
                    type: "application/pdf",
                }),
                name: compressedName(file.name),
                imagesFound: output.imagesFound,
                imagesChanged: output.imagesChanged,
            });
        } catch (caught) {
            setError(toToolError(caught));
        } finally {
            setBusy(false);
            setProgress(null);
        }
    };

    const number = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en");
    const percent = result && file ? saving(file.size, result.blob.size) : 0;

    return (
        <div className="flex flex-col gap-5">
            {!file ? (
                <FileDrop
                    locale={locale}
                    accept="application/pdf,.pdf"
                    onFile={(picked) => pick(picked)}
                />
            ) : (
                <>
                    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2/60 p-3">
                        <div className="min-w-0 flex-1 text-sm">
                            <Ltr className="block truncate font-semibold">{file.name}</Ltr>
                            <span className="text-xs text-muted tabular-nums">
                                {formatBytes(file.size, locale)}
                            </span>
                        </div>
                        <Button onClick={reset} disabled={busy}>
                            {t("another")}
                        </Button>
                    </div>
                    <Segmented<Level>
                        legend={t("level")}
                        value={level}
                        onChange={(next) => {
                            setLevel(next);
                            setResult(null);
                        }}
                        options={[
                            { value: "light", label: t("light") },
                            { value: "medium", label: t("medium") },
                            { value: "strong", label: t("strong") },
                        ]}
                    />
                    <Button
                        variant="primary"
                        className="w-fit"
                        onClick={() => void compress()}
                        disabled={busy}
                        data-tool-run=""
                    >
                        {busy ? UI_STRINGS.working[locale] : t("compress")}
                    </Button>
                </>
            )}
            {progress && <Progress value={progress.total > 0 ? progress : null} locale={locale} />}
            {error && <ErrorMessage error={error} locale={locale} />}

            {result && file && (
                <>
                    {percent <= 0 ? (
                        <p
                            role="note"
                            className="rounded-2xl border border-primary/40 bg-primary-soft px-4 py-3 text-sm"
                            data-tool-not-smaller=""
                        >
                            {t("notSmaller")}
                        </p>
                    ) : (
                        <section
                            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-bg p-4 text-sm"
                            aria-label={t("result")}
                        >
                            <div className="min-w-0">
                                <Ltr className="block truncate font-semibold">{result.name}</Ltr>
                                <span
                                    className="text-xs text-muted tabular-nums"
                                    data-tool-result-size=""
                                >
                                    {formatBytes(file.size, locale)} {locale === "fa" ? "←" : "→"}{" "}
                                    {formatBytes(result.blob.size, locale)} (
                                    <span className="text-success">
                                        {number.format(percent)}% {t("smaller")}
                                    </span>
                                    ) · {number.format(result.imagesChanged)} {t("of")}{" "}
                                    {number.format(result.imagesFound)} {t("images")}
                                </span>
                            </div>
                            <Button
                                variant="primary"
                                onClick={() => downloadBlob(result.blob, result.name)}
                            >
                                {UI_STRINGS.download[locale]}
                            </Button>
                        </section>
                    )}
                </>
            )}
            <p className="text-xs text-muted">{t("note")}</p>
            <input
                type="hidden"
                value={result ? `${percent}:${result.imagesChanged}` : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
