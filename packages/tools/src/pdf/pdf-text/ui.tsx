import { useRef, useState } from "react";
import { downloadBlob, formatBytes } from "@handyweb/core/files";
import { toToolError, type ToolError } from "@handyweb/core/runtime";
import {
    Button,
    Checkbox,
    CopyButton,
    ErrorMessage,
    FileDrop,
    Ltr,
    Pane,
    Progress,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { openWithPdfJs } from "../shared/pdfjs";
import { extractPage } from "./extract";
import { strings } from "./i18n";
import { joinPages, MAX_FILE_BYTES, MAX_PAGES, textName } from "./logic";

export default function PdfText({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const run = useRef(0);
    const [file, setFile] = useState<File | null>(null);
    const [pageCount, setPageCount] = useState(0);
    const [pages, setPages] = useState<string[] | null>(null);
    const [headers, setHeaders] = useState(true);
    const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);
    const [error, setError] = useState<ToolError | null>(null);

    const reset = () => {
        run.current++;
        setFile(null);
        setPages(null);
        setPageCount(0);
        setProgress(null);
        setError(null);
    };

    const open = async (picked: File) => {
        reset();
        if (picked.size > MAX_FILE_BYTES) {
            setError({ code: "too-large", message: strings.tooLarge });
            return;
        }
        const id = run.current;
        setProgress({ completed: 0, total: 0 });
        try {
            const pdf = await openWithPdfJs(new Uint8Array(await picked.arrayBuffer()));
            try {
                const total = Math.min(pdf.numPages, MAX_PAGES);
                setPageCount(pdf.numPages);
                const texts: string[] = [];
                for (let page = 1; page <= total; page++) {
                    if (run.current !== id) return;
                    texts.push(await extractPage(pdf, page));
                    setProgress({ completed: page, total });
                }
                if (run.current !== id) return;
                setFile(picked);
                setPages(texts);
            } finally {
                void pdf.loadingTask.destroy();
            }
        } catch (caught) {
            if (run.current === id) setError(toToolError(caught));
        } finally {
            if (run.current === id) setProgress(null);
        }
    };

    const number = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en");
    const text = pages
        ? joinPages(pages, headers, (page) => `${t("page")} ${number.format(page)}`)
        : "";
    const empty = pages !== null && pages.every((page) => page === "");

    if (!file || !pages)
        return (
            <div className="flex flex-col gap-5">
                {progress ? (
                    <Progress value={progress.total > 0 ? progress : null} locale={locale} />
                ) : (
                    <FileDrop
                        locale={locale}
                        accept="application/pdf,.pdf"
                        onFile={(picked) => void open(picked)}
                    />
                )}
                {error && <ErrorMessage error={error} locale={locale} />}
            </div>
        );

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2/60 p-3">
                <div className="min-w-0 flex-1 text-sm">
                    <Ltr className="block truncate font-semibold">{file.name}</Ltr>
                    <span className="text-xs text-muted tabular-nums">
                        {number.format(pageCount)} {t("pages")} · {formatBytes(file.size, locale)}
                    </span>
                </div>
                <Button onClick={reset}>{t("another")}</Button>
            </div>
            {pageCount > MAX_PAGES && <p className="text-sm text-muted">{t("tooMany")}</p>}
            {empty ? (
                <p
                    role="note"
                    className="rounded-2xl border border-primary/40 bg-primary-soft px-4 py-3 text-sm"
                    data-tool-no-text=""
                >
                    {t("noText")}
                </p>
            ) : (
                <>
                    <Checkbox label={t("headers")} checked={headers} onChange={setHeaders} />
                    <Pane
                        label={t("text")}
                        locale={locale}
                        value={text}
                        readOnly
                        dir="auto"
                        rows={16}
                        actions={<CopyButton text={text} locale={locale} compact />}
                        data-tool-output=""
                    />
                    <Button
                        variant="primary"
                        className="w-fit"
                        onClick={() =>
                            downloadBlob(
                                new Blob([text], { type: "text/plain;charset=utf-8" }),
                                textName(file.name),
                            )
                        }
                    >
                        {t("download")}
                    </Button>
                </>
            )}
        </div>
    );
}
