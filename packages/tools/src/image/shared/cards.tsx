import { downloadBlob, formatBytes } from "@handyweb/core/files";
import type { Locale } from "@handyweb/core";
import { Button, Ltr, UI_STRINGS } from "@handyweb/core/ui";
import { shared } from "./i18n";

/** The name, size, and bytes of the opened image, with a button to choose another one. */
export function SourceCard({
    locale,
    name,
    width,
    height,
    bytes,
    onReset,
}: {
    locale: Locale;
    name: string;
    width: number;
    height: number;
    bytes: number;
    onReset: () => void;
}) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2/60 p-3">
            <div className="min-w-0 flex-1 text-sm">
                <Ltr className="block truncate font-semibold">{name}</Ltr>
                <span className="text-xs text-muted tabular-nums">
                    <Ltr>{`${width} × ${height}`}</Ltr> · {formatBytes(bytes, locale)}
                </span>
            </div>
            <Button onClick={onReset}>{shared.another[locale]}</Button>
        </div>
    );
}

/** The result image with its size, the change in bytes, and a download button. */
export function ResultCard({
    locale,
    url,
    blob,
    name,
    width,
    height,
    sourceBytes,
}: {
    locale: Locale;
    url: string;
    blob: Blob;
    name: string;
    width: number;
    height: number;
    sourceBytes: number;
}) {
    const change = sourceBytes > 0 ? Math.round((1 - blob.size / sourceBytes) * 100) : 0;
    return (
        <section
            className="flex flex-col gap-3 rounded-2xl border border-border bg-bg p-4"
            aria-label={shared.result[locale]}
        >
            <img
                src={url}
                alt={shared.result[locale]}
                className="max-h-96 self-center rounded-lg object-contain"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className="tabular-nums" data-tool-result-size="">
                    <Ltr>{`${width} × ${height}`}</Ltr> · {formatBytes(blob.size, locale)}
                    {change !== 0 && (
                        <span className={change > 0 ? "text-success" : "text-error"}>
                            {" "}
                            ({Math.abs(change)}%{" "}
                            {change > 0 ? shared.smaller[locale] : shared.larger[locale]})
                        </span>
                    )}
                </span>
                <Button variant="primary" onClick={() => downloadBlob(blob, name)}>
                    {UI_STRINGS.download[locale]}
                </Button>
            </div>
        </section>
    );
}
