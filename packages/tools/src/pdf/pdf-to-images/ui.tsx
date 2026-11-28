import { useEffect, useId, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { downloadBlob, formatBytes, makeZip, ObjectUrls } from "@handyweb/core/files";
import { toToolError, ToolFailure, type ToolError } from "@handyweb/core/runtime";
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
import { openWithPdfJs } from "../shared/pdfjs";
import { strings } from "./i18n";
import {
    DPI_OPTIONS,
    MAX_FILE_BYTES,
    MAX_PAGES,
    pageName,
    parsePages,
    zipName,
    type Dpi,
} from "./logic";
import { renderPage } from "../shared/render";

type Format = "image/png" | "image/jpeg";

interface PageImage {
    page: number;
    name: string;
    url: string;
    blob: Blob;
    width: number;
    height: number;
}

const FIELD =
    "min-h-11 w-full rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";

export default function PdfToImages({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const urls = useRef(new ObjectUrls());
    const stop = useRef(false);
    const ids = { pages: useId(), hint: useId() };
    const [file, setFile] = useState<File | null>(null);
    const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
    const [format, setFormat] = useState<Format>("image/png");
    const [dpi, setDpi] = useState<Dpi>(150);
    const [pageText, setPageText] = useState("");
    const [reading, setReading] = useState(false);
    const [busy, setBusy] = useState(false);
    const [progress, setProgress] = useState({ completed: 0, total: 0 });
    const [images, setImages] = useState<PageImage[]>([]);
    const [scaled, setScaled] = useState(false);
    const [error, setError] = useState<ToolError | null>(null);

    useEffect(() => {
        const store = urls.current;
        return () => store.revokeAll();
    }, []);
    useEffect(
        () => () => {
            void pdf?.loadingTask.destroy();
        },
        [pdf],
    );

    const clearResult = () => {
        urls.current.revokeAll();
        setImages([]);
        setScaled(false);
        setError(null);
    };

    const reset = () => {
        stop.current = true;
        clearResult();
        setPdf(null);
        setFile(null);
        setPageText("");
    };

    const open = async (picked: File) => {
        reset();
        if (picked.size > MAX_FILE_BYTES) {
            setError({ code: "too-large", message: strings.tooLarge });
            return;
        }
        setReading(true);
        try {
            const document = await openWithPdfJs(new Uint8Array(await picked.arrayBuffer()));
            setFile(picked);
            setPdf(document);
        } catch (caught) {
            setError(toToolError(caught));
        } finally {
            setReading(false);
        }
    };

    const convert = async () => {
        if (!pdf || !file) return;
        clearResult();
        let pages: number[];
        try {
            pages = parsePages(pageText, pdf.numPages);
            if (pages.length > MAX_PAGES) throw new ToolFailure("too-large", strings.tooMany);
        } catch (caught) {
            setError(toToolError(caught));
            return;
        }
        stop.current = false;
        setBusy(true);
        setProgress({ completed: 0, total: pages.length });
        const ext = format === "image/png" ? "png" : "jpg";
        try {
            for (const [index, page] of pages.entries()) {
                if (stop.current) break;
                const image = await renderPage(pdf, page, dpi, format);
                if (stop.current) break;
                const item: PageImage = {
                    page,
                    name: pageName(file.name, page, pdf.numPages, ext),
                    url: urls.current.create(image.blob),
                    blob: image.blob,
                    width: image.width,
                    height: image.height,
                };
                setImages((current) => [...current, item]);
                if (image.scaled) setScaled(true);
                setProgress({ completed: index + 1, total: pages.length });
            }
        } catch (caught) {
            setError(toToolError(caught));
        } finally {
            setBusy(false);
        }
    };

    const downloadAll = async () => {
        if (!file) return;
        const entries = await Promise.all(
            images.map(async (image) => ({
                name: image.name,
                data: new Uint8Array(await image.blob.arrayBuffer()),
            })),
        );
        const zip = makeZip(entries);
        downloadBlob(
            new Blob([zip as Uint8Array<ArrayBuffer>], { type: "application/zip" }),
            zipName(file.name),
        );
    };

    const number = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en");

    return (
        <div className="flex flex-col gap-5">
            {!pdf || !file ? (
                <>
                    {!reading && (
                        <FileDrop
                            locale={locale}
                            accept="application/pdf,.pdf"
                            onFile={(picked) => void open(picked)}
                        />
                    )}
                    {reading && <p className="text-sm text-muted">{t("reading")}</p>}
                </>
            ) : (
                <>
                    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2/60 p-3">
                        <div className="min-w-0 flex-1 text-sm">
                            <Ltr className="block truncate font-semibold">{file.name}</Ltr>
                            <span
                                className="text-xs text-muted tabular-nums"
                                data-tool-page-count=""
                            >
                                {number.format(pdf.numPages)} {t("pages")} ·{" "}
                                {formatBytes(file.size, locale)}
                            </span>
                        </div>
                        <Button onClick={reset} disabled={busy}>
                            {t("another")}
                        </Button>
                    </div>
                    <Segmented<Format>
                        legend={t("format")}
                        value={format}
                        onChange={(next) => {
                            setFormat(next);
                            clearResult();
                        }}
                        options={[
                            { value: "image/png", label: "PNG" },
                            { value: "image/jpeg", label: "JPEG" },
                        ]}
                    />
                    <Segmented<`${Dpi}`>
                        legend={t("resolution")}
                        value={`${dpi}`}
                        onChange={(next) => {
                            setDpi(Number(next) as Dpi);
                            clearResult();
                        }}
                        options={DPI_OPTIONS.map((value) => ({
                            value: `${value}` as const,
                            label: `${number.format(value)} dpi`,
                        }))}
                    />
                    <label
                        htmlFor={ids.pages}
                        className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
                    >
                        {t("pageList")}
                        <input
                            id={ids.pages}
                            type="text"
                            inputMode="numeric"
                            dir="ltr"
                            autoComplete="off"
                            value={pageText}
                            onChange={(event) => {
                                setPageText(event.target.value);
                                clearResult();
                            }}
                            placeholder={`1-${pdf.numPages}`}
                            aria-describedby={ids.hint}
                            className={FIELD}
                            data-tool-pages=""
                        />
                        <span id={ids.hint} className="font-normal">
                            {t("pageListHint")} <Ltr>1-3, 5, 8-</Ltr>
                        </span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="primary"
                            onClick={() => void convert()}
                            disabled={busy}
                            data-tool-run=""
                        >
                            {busy ? UI_STRINGS.working[locale] : t("convert")}
                        </Button>
                        {busy && (
                            <Button
                                onClick={() => {
                                    stop.current = true;
                                }}
                            >
                                {t("cancel")}
                            </Button>
                        )}
                    </div>
                </>
            )}
            {busy && <Progress value={progress} locale={locale} />}
            {error && <ErrorMessage error={error} locale={locale} />}
            {scaled && <p className="text-sm text-muted">{t("scaled")}</p>}

            {images.length > 0 && !busy && (
                <section aria-label={t("results")} className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-sm font-semibold">{t("results")}</h2>
                        {images.length > 1 && (
                            <Button variant="primary" onClick={() => void downloadAll()}>
                                {t("downloadAll")}
                            </Button>
                        )}
                    </div>
                    <ul
                        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
                        data-tool-images=""
                    >
                        {images.map((image) => (
                            <li
                                key={image.page}
                                className="flex flex-col gap-2 rounded-2xl border border-border bg-bg p-2"
                            >
                                <img
                                    src={image.url}
                                    alt={`${t("page")} ${number.format(image.page)}`}
                                    width={image.width}
                                    height={image.height}
                                    className="h-auto w-full rounded-lg border border-border object-contain"
                                />
                                <span className="text-xs text-muted tabular-nums">
                                    {t("page")} {number.format(image.page)} ·{" "}
                                    <Ltr>{`${image.width} × ${image.height}`}</Ltr>
                                </span>
                                <Button
                                    className="px-3 text-xs"
                                    onClick={() => downloadBlob(image.blob, image.name)}
                                    aria-label={`${UI_STRINGS.download[locale]}: ${t("page")} ${number.format(image.page)}`}
                                >
                                    {UI_STRINGS.download[locale]}
                                </Button>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
            <input
                type="hidden"
                value={images.length > 0 && !busy ? String(images.length) : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
