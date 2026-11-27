import { useEffect, useRef, useState } from "react";
import { downloadBlob, formatBytes, ObjectUrls } from "@handyweb/core/files";
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
import { move } from "../shared/list";
import { strings } from "./i18n";
import {
    imagesToPdf,
    MAX_FILE_BYTES,
    MAX_IMAGES,
    MAX_TOTAL_BYTES,
    pdfName,
    type Margin,
    type PageSize,
    type PdfImage,
} from "./logic";
import { prepareImage } from "./prepare";

interface Item {
    key: number;
    name: string;
    size: number;
    thumb: string;
    image: PdfImage;
}

interface Skipped {
    name: string;
    reason: ToolError["message"];
}

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/bmp";

export default function ImagesToPdf({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const urls = useRef(new ObjectUrls());
    const nextKey = useRef(0);
    const [items, setItems] = useState<Item[]>([]);
    const [skipped, setSkipped] = useState<Skipped[]>([]);
    const [size, setSize] = useState<PageSize>("a4");
    const [margin, setMargin] = useState<Margin>("small");
    const [reading, setReading] = useState(false);
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(0);
    const [result, setResult] = useState<{ blob: Blob; pages: number; name: string } | null>(null);
    const [error, setError] = useState<ToolError | null>(null);

    useEffect(() => {
        const store = urls.current;
        return () => store.revokeAll();
    }, []);

    const clearResult = () => {
        setResult(null);
        setError(null);
    };

    const update = (next: Item[]) => {
        for (const item of items) if (!next.includes(item)) urls.current.revoke(item.thumb);
        setItems(next);
        clearResult();
    };

    const add = async (picked: File[]) => {
        setReading(true);
        setSkipped([]);
        clearResult();
        const added: Item[] = [];
        const rejected: Skipped[] = [];
        let total = items.reduce((sum, item) => sum + item.size, 0);
        for (const file of picked) {
            if (items.length + added.length >= MAX_IMAGES) {
                rejected.push({ name: file.name, reason: strings.tooMany });
                continue;
            }
            if (file.size > MAX_FILE_BYTES) {
                rejected.push({ name: file.name, reason: strings.tooLarge });
                continue;
            }
            if (total + file.size > MAX_TOTAL_BYTES) {
                rejected.push({ name: file.name, reason: strings.totalTooLarge });
                continue;
            }
            try {
                const image = await prepareImage(file);
                // The preview uses the file itself, so the image bytes are not copied again.
                const thumb = urls.current.create(file);
                added.push({
                    key: nextKey.current++,
                    name: file.name,
                    size: file.size,
                    thumb,
                    image,
                });
                total += file.size;
            } catch (caught) {
                rejected.push({ name: file.name, reason: toToolError(caught).message });
            }
        }
        setItems((current) => [...current, ...added]);
        setSkipped(rejected);
        setReading(false);
    };

    const make = async () => {
        setBusy(true);
        setDone(0);
        clearResult();
        try {
            const pdf = await imagesToPdf(
                items.map((item) => item.image),
                size,
                margin,
                setDone,
            );
            setResult({
                blob: new Blob([pdf.bytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" }),
                pages: pdf.pages,
                name: pdfName(items[0]?.name),
            });
        } catch (caught) {
            setError(toToolError(caught));
        } finally {
            setBusy(false);
        }
    };

    const number = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en");
    const locked = busy || reading;

    return (
        <div className="flex flex-col gap-5">
            {items.length > 0 && (
                <section aria-label={t("images")} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-sm font-semibold">{t("images")}</h2>
                        <span className="text-xs text-muted tabular-nums" data-tool-count="">
                            {number.format(items.length)} {t("image")}
                        </span>
                    </div>
                    <ol className="flex flex-col gap-2" data-tool-files="">
                        {items.map((item, index) => (
                            <li
                                key={item.key}
                                className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2/60 p-3"
                            >
                                <span className="w-6 text-center text-sm text-muted tabular-nums">
                                    {number.format(index + 1)}
                                </span>
                                <img
                                    src={item.thumb}
                                    alt=""
                                    width={48}
                                    height={48}
                                    className="size-12 shrink-0 rounded-lg bg-bg object-contain"
                                />
                                <div className="min-w-0 flex-1 text-sm">
                                    <Ltr className="block truncate font-semibold">{item.name}</Ltr>
                                    <span className="text-xs text-muted tabular-nums">
                                        <Ltr>{`${item.image.width} × ${item.image.height}`}</Ltr> ·{" "}
                                        {formatBytes(item.size, locale)}
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        className="px-3"
                                        aria-label={`${t("moveUp")}: ${item.name}`}
                                        disabled={index === 0 || locked}
                                        onClick={() => update(move(items, index, -1))}
                                    >
                                        <span aria-hidden="true">↑</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="px-3"
                                        aria-label={`${t("moveDown")}: ${item.name}`}
                                        disabled={index === items.length - 1 || locked}
                                        onClick={() => update(move(items, index, 1))}
                                    >
                                        <span aria-hidden="true">↓</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="px-3"
                                        aria-label={`${t("remove")}: ${item.name}`}
                                        disabled={locked}
                                        onClick={() =>
                                            update(items.filter((other) => other !== item))
                                        }
                                    >
                                        <span aria-hidden="true">×</span>
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>
            )}

            {items.length < MAX_IMAGES && !locked && (
                <FileDrop
                    locale={locale}
                    accept={ACCEPT}
                    onFiles={(picked) => void add(picked)}
                    hint={items.length > 0 ? t("addMore") : t("hint")}
                />
            )}
            {reading && <p className="text-sm text-muted">{t("reading")}</p>}

            {skipped.length > 0 && (
                <div role="alert" className="flex flex-col gap-1 text-sm text-error">
                    <p>{t("skipped")}</p>
                    <ul className="flex flex-col gap-1 ps-4" data-tool-skipped="">
                        {skipped.map((entry, index) => (
                            <li key={index} className="list-disc">
                                <Ltr>{entry.name}</Ltr>: {entry.reason[locale]}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {items.length > 0 && (
                <>
                    <Segmented<PageSize>
                        legend={t("pageSize")}
                        value={size}
                        onChange={(next) => {
                            setSize(next);
                            clearResult();
                        }}
                        options={[
                            { value: "a4", label: "A4" },
                            { value: "letter", label: "Letter" },
                            { value: "fit", label: t("fit") },
                        ]}
                    />
                    <Segmented<Margin>
                        legend={t("margin")}
                        value={margin}
                        onChange={(next) => {
                            setMargin(next);
                            clearResult();
                        }}
                        options={[
                            { value: "none", label: t("none") },
                            { value: "small", label: t("small") },
                            { value: "large", label: t("large") },
                        ]}
                    />
                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="primary"
                            onClick={() => void make()}
                            disabled={locked}
                            data-tool-run=""
                        >
                            {busy ? UI_STRINGS.working[locale] : t("make")}
                        </Button>
                        <Button
                            onClick={() => {
                                update([]);
                                setSkipped([]);
                            }}
                            disabled={locked}
                        >
                            {t("clear")}
                        </Button>
                    </div>
                </>
            )}
            {busy && <Progress value={{ completed: done, total: items.length }} locale={locale} />}
            {error && <ErrorMessage error={error} locale={locale} />}

            {result && (
                <section
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-bg p-4 text-sm"
                    aria-label={t("result")}
                >
                    <div className="min-w-0">
                        <Ltr className="block truncate font-semibold">{result.name}</Ltr>
                        <span className="text-xs text-muted tabular-nums" data-tool-result-size="">
                            {number.format(result.pages)} {t("pages")} ·{" "}
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
                value={result ? String(result.pages) : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
