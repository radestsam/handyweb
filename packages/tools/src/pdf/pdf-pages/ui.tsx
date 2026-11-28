import { useEffect, useRef, useState } from "react";
import { downloadBlob, formatBytes, makeZip, ObjectUrls } from "@handyweb/core/files";
import { toToolError, type ToolError } from "@handyweb/core/runtime";
import {
    Button,
    ErrorMessage,
    FileDrop,
    Ltr,
    Progress,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { move } from "../shared/list";
import { openWithPdfJs } from "../shared/pdfjs";
import { renderPage } from "../shared/render";
import { strings } from "./i18n";
import {
    buildPdf,
    initialPages,
    MAX_FILE_BYTES,
    MAX_PAGES,
    outputName,
    rotateMany,
    rotatePage,
    selectAll,
    splitPdf,
    toggleSelected,
    type PageState,
} from "./logic";

/** Thumbnails at 30 dpi: an A4 page is about 250 pixels wide. */
const THUMB_DPI = 30;

interface Result {
    blob: Blob;
    name: string;
    /** Pages in the PDF, or files in the ZIP. */
    count: number;
    zip: boolean;
}

export default function PdfPages({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const urls = useRef(new ObjectUrls());
    const run = useRef(0);
    const [file, setFile] = useState<File | null>(null);
    const [bytes, setBytes] = useState<Uint8Array | null>(null);
    const [count, setCount] = useState(0);
    const [pages, setPages] = useState<PageState[]>([]);
    const [thumbs, setThumbs] = useState<Record<number, string>>({});
    const [reading, setReading] = useState(false);
    const [busy, setBusy] = useState(false);
    const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);
    const [result, setResult] = useState<Result | null>(null);
    const [error, setError] = useState<ToolError | null>(null);

    useEffect(() => {
        const store = urls.current;
        // Stops the thumbnail loop when the tool closes.
        const counter = run;
        return () => {
            counter.current++;
            store.revokeAll();
        };
    }, []);

    const reset = () => {
        run.current++;
        urls.current.revokeAll();
        setFile(null);
        setBytes(null);
        setCount(0);
        setPages([]);
        setThumbs({});
        setResult(null);
        setError(null);
    };

    const update = (next: PageState[]) => {
        setPages(next);
        setResult(null);
        setError(null);
    };

    const open = async (picked: File) => {
        reset();
        if (picked.size > MAX_FILE_BYTES) {
            setError({ code: "too-large", message: strings.tooLarge });
            return;
        }
        const id = run.current;
        setReading(true);
        try {
            const data = new Uint8Array(await picked.arrayBuffer());
            const pdf = await openWithPdfJs(data);
            if (pdf.numPages > MAX_PAGES) {
                void pdf.loadingTask.destroy();
                setError({ code: "too-large", message: strings.tooMany });
                return;
            }
            setFile(picked);
            setBytes(data);
            setCount(pdf.numPages);
            setPages(initialPages(pdf.numPages));
            setReading(false);
            // Thumbnails come one by one, so the grid is usable at once.
            try {
                for (let index = 0; index < pdf.numPages; index++) {
                    if (run.current !== id) return;
                    const image = await renderPage(pdf, index + 1, THUMB_DPI, "image/jpeg", 0.7);
                    if (run.current !== id) return;
                    const url = urls.current.create(image.blob);
                    setThumbs((current) => ({ ...current, [index]: url }));
                }
            } finally {
                void pdf.loadingTask.destroy();
            }
        } catch (caught) {
            if (run.current === id) setError(toToolError(caught));
        } finally {
            if (run.current === id) setReading(false);
        }
    };

    const produce = async (kind: "save" | "extract" | "split") => {
        if (!file || !bytes) return;
        setBusy(true);
        setError(null);
        setResult(null);
        try {
            const chosen = kind === "extract" ? pages.filter((page) => page.selected) : pages;
            if (kind === "split") {
                setProgress({ completed: 0, total: chosen.length });
                const entries = await splitPdf(bytes, chosen, file.name, (completed) =>
                    setProgress({ completed, total: chosen.length }),
                );
                setResult({
                    blob: new Blob([makeZip(entries) as Uint8Array<ArrayBuffer>], {
                        type: "application/zip",
                    }),
                    name: outputName(file.name, "pages"),
                    count: entries.length,
                    zip: true,
                });
            } else {
                const output = await buildPdf(bytes, chosen);
                setResult({
                    blob: new Blob([output as Uint8Array<ArrayBuffer>], {
                        type: "application/pdf",
                    }),
                    name: outputName(file.name, kind === "save" ? "edited" : "selected"),
                    count: chosen.length,
                    zip: false,
                });
            }
        } catch (caught) {
            setError(toToolError(caught));
        } finally {
            setBusy(false);
            setProgress(null);
        }
    };

    const number = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en");
    const selectedCount = pages.filter((page) => page.selected).length;
    // In a right-to-left page, "earlier" is on the right.
    const earlier = locale === "fa" ? "→" : "←";
    const later = locale === "fa" ? "←" : "→";

    if (!file || !bytes)
        return (
            <div className="flex flex-col gap-5">
                {reading ? (
                    <p className="text-sm text-muted">{t("reading")}</p>
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
                    <span className="text-xs text-muted tabular-nums" data-tool-summary="">
                        {number.format(pages.length)} {t("pages")} · {number.format(selectedCount)}{" "}
                        {t("selected")}
                        {pages.length < count &&
                            ` · ${number.format(count - pages.length)} ${t("removed")}`}{" "}
                        · {formatBytes(file.size, locale)}
                    </span>
                </div>
                <Button onClick={reset} disabled={busy}>
                    {t("another")}
                </Button>
            </div>

            <div className="flex flex-wrap gap-2">
                <Button
                    onClick={() => update(selectAll(pages, selectedCount < pages.length))}
                    disabled={busy}
                >
                    {selectedCount < pages.length ? t("selectAll") : t("selectNone")}
                </Button>
                <Button onClick={() => update(rotateMany(pages, -1))} disabled={busy}>
                    ↺ {t("rotateLeft")}
                </Button>
                <Button onClick={() => update(rotateMany(pages, 1))} disabled={busy}>
                    ↻ {t("rotateRight")}
                </Button>
                <Button
                    onClick={() => update(pages.filter((page) => !page.selected))}
                    disabled={busy || selectedCount === 0 || selectedCount === pages.length}
                    data-tool-remove-selected=""
                >
                    {t("removeSelected")}
                </Button>
                <Button onClick={() => update(initialPages(count))} disabled={busy}>
                    {t("undo")}
                </Button>
            </div>
            <p className="text-xs text-muted">{t("manyNote")}</p>

            <ol
                aria-label={t("grid")}
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
                data-tool-pages=""
            >
                {pages.map((page, index) => {
                    const label = `${t("page")} ${number.format(page.source + 1)}`;
                    return (
                        <li
                            key={page.source}
                            className={`flex flex-col gap-2 rounded-2xl border p-2 ${
                                page.selected
                                    ? "border-primary bg-primary-soft"
                                    : "border-border bg-bg"
                            }`}
                            data-source={page.source + 1}
                            data-rotation={page.rotation}
                        >
                            <label className="flex cursor-pointer flex-col gap-2">
                                <span className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-surface-2">
                                    {thumbs[page.source] ? (
                                        <img
                                            src={thumbs[page.source]}
                                            alt=""
                                            className="max-h-[70%] max-w-[70%] border border-border object-contain transition-transform"
                                            style={{ transform: `rotate(${page.rotation}deg)` }}
                                        />
                                    ) : (
                                        <span className="text-xs text-muted">…</span>
                                    )}
                                </span>
                                <span className="flex items-center gap-2 text-xs">
                                    <input
                                        type="checkbox"
                                        checked={page.selected}
                                        onChange={() => update(toggleSelected(pages, index))}
                                        className="size-4 accent-primary"
                                        aria-label={`${t("select")}: ${label}`}
                                    />
                                    <span className="tabular-nums">{label}</span>
                                </span>
                            </label>
                            <div className="flex flex-wrap justify-center gap-0.5">
                                <Button
                                    variant="ghost"
                                    className="px-2.5"
                                    aria-label={`${t("rotateLeft")}: ${label}`}
                                    onClick={() => update(rotatePage(pages, index, -1))}
                                    disabled={busy}
                                >
                                    <span aria-hidden="true">↺</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="px-2.5"
                                    aria-label={`${t("rotateRight")}: ${label}`}
                                    onClick={() => update(rotatePage(pages, index, 1))}
                                    disabled={busy}
                                >
                                    <span aria-hidden="true">↻</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="px-2.5"
                                    aria-label={`${t("moveEarlier")}: ${label}`}
                                    onClick={() => update(move(pages, index, -1))}
                                    disabled={busy || index === 0}
                                >
                                    <span aria-hidden="true">{earlier}</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="px-2.5"
                                    aria-label={`${t("moveLater")}: ${label}`}
                                    onClick={() => update(move(pages, index, 1))}
                                    disabled={busy || index === pages.length - 1}
                                >
                                    <span aria-hidden="true">{later}</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="px-2.5"
                                    aria-label={`${t("remove")}: ${label}`}
                                    onClick={() => update(pages.filter((_, i) => i !== index))}
                                    disabled={busy || pages.length === 1}
                                >
                                    <span aria-hidden="true">×</span>
                                </Button>
                            </div>
                        </li>
                    );
                })}
            </ol>

            <div className="flex flex-wrap gap-3">
                <Button
                    variant="primary"
                    onClick={() => void produce("save")}
                    disabled={busy}
                    data-tool-run=""
                >
                    {busy ? UI_STRINGS.working[locale] : t("save")}
                </Button>
                <Button
                    onClick={() => void produce("extract")}
                    disabled={busy || selectedCount === 0}
                    data-tool-extract=""
                >
                    {t("extract")}
                </Button>
                <Button
                    onClick={() => void produce("split")}
                    disabled={busy || pages.length < 2}
                    data-tool-split=""
                >
                    {t("split")}
                </Button>
            </div>
            {progress && <Progress value={progress} locale={locale} />}
            {error && <ErrorMessage error={error} locale={locale} />}

            {result && (
                <section
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-bg p-4 text-sm"
                    aria-label={t("result")}
                >
                    <div className="min-w-0">
                        <Ltr className="block truncate font-semibold">{result.name}</Ltr>
                        <span className="text-xs text-muted tabular-nums">
                            {number.format(result.count)} {t("pages")} ·{" "}
                            {formatBytes(result.blob.size, locale)}
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
            <input
                type="hidden"
                value={result ? `${result.zip ? "zip" : "pdf"}:${result.count}` : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
