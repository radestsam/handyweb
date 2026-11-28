import { useRef, useState } from "react";
import { downloadBlob, formatBytes } from "@handyweb/core/files";
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
import { strings } from "./i18n";
import {
    countPages,
    MAX_FILE_BYTES,
    MAX_FILES,
    MAX_TOTAL_BYTES,
    mergedName,
    mergePdfs,
} from "./logic";
import { move } from "../shared/list";

interface Item {
    key: number;
    name: string;
    bytes: Uint8Array;
    pages: number;
}

interface Skipped {
    name: string;
    reason: ToolError["message"];
}

const ACCEPT = "application/pdf,.pdf";

export default function PdfMerge({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const nextKey = useRef(0);
    const [items, setItems] = useState<Item[]>([]);
    const [skipped, setSkipped] = useState<Skipped[]>([]);
    const [reading, setReading] = useState(false);
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(0);
    const [result, setResult] = useState<{ blob: Blob; pages: number; name: string } | null>(null);
    const [error, setError] = useState<ToolError | null>(null);

    const clearResult = () => {
        setResult(null);
        setError(null);
    };

    const update = (next: Item[]) => {
        setItems(next);
        clearResult();
    };

    const add = async (picked: File[]) => {
        setReading(true);
        setSkipped([]);
        clearResult();
        const added: Item[] = [];
        const rejected: Skipped[] = [];
        let total = items.reduce((sum, item) => sum + item.bytes.length, 0);
        for (const file of picked) {
            if (items.length + added.length >= MAX_FILES) {
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
                const bytes = new Uint8Array(await file.arrayBuffer());
                const pages = await countPages(bytes);
                added.push({ key: nextKey.current++, name: file.name, bytes, pages });
                total += file.size;
            } catch (caught) {
                rejected.push({ name: file.name, reason: toToolError(caught).message });
            }
        }
        setItems((current) => [...current, ...added]);
        setSkipped(rejected);
        setReading(false);
    };

    const merge = async () => {
        setBusy(true);
        setDone(0);
        clearResult();
        try {
            const merged = await mergePdfs(
                items.map((item) => item.bytes),
                setDone,
            );
            setResult({
                blob: new Blob([merged.bytes as Uint8Array<ArrayBuffer>], {
                    type: "application/pdf",
                }),
                pages: merged.pages,
                name: mergedName(items[0]?.name),
            });
        } catch (caught) {
            setError(toToolError(caught));
        } finally {
            setBusy(false);
        }
    };

    const number = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en");
    const totalPages = items.reduce((sum, item) => sum + item.pages, 0);

    return (
        <div className="flex flex-col gap-5">
            {items.length > 0 && (
                <section aria-label={t("files")} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-sm font-semibold">{t("files")}</h2>
                        <span className="text-xs text-muted tabular-nums" data-tool-total-pages="">
                            {number.format(totalPages)} {t("pages")}
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
                                <div className="min-w-0 flex-1 text-sm">
                                    <Ltr className="block truncate font-semibold">{item.name}</Ltr>
                                    <span className="text-xs text-muted tabular-nums">
                                        {number.format(item.pages)} {t("pages")} ·{" "}
                                        {formatBytes(item.bytes.length, locale)}
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        className="px-3"
                                        aria-label={`${t("moveUp")}: ${item.name}`}
                                        disabled={index === 0 || busy || reading}
                                        onClick={() => update(move(items, index, -1))}
                                    >
                                        <span aria-hidden="true">↑</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="px-3"
                                        aria-label={`${t("moveDown")}: ${item.name}`}
                                        disabled={index === items.length - 1 || busy || reading}
                                        onClick={() => update(move(items, index, 1))}
                                    >
                                        <span aria-hidden="true">↓</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="px-3"
                                        aria-label={`${t("remove")}: ${item.name}`}
                                        disabled={busy || reading}
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

            {items.length < MAX_FILES && !reading && !busy && (
                <FileDrop
                    locale={locale}
                    accept={ACCEPT}
                    onFiles={(picked) => void add(picked)}
                    hint={items.length > 0 ? t("addMore") : t("needTwo")}
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
                <div className="flex flex-wrap gap-3">
                    <Button
                        variant="primary"
                        onClick={() => void merge()}
                        disabled={items.length < 2 || busy || reading}
                        data-tool-run=""
                    >
                        {busy ? UI_STRINGS.working[locale] : t("merge")}
                    </Button>
                    <Button
                        onClick={() => {
                            update([]);
                            setSkipped([]);
                        }}
                        disabled={busy}
                    >
                        {t("clear")}
                    </Button>
                </div>
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
