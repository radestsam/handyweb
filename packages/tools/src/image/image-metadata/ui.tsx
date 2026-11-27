import { useEffect, useRef, useState } from "react";
import { downloadBlob, formatBytes, ObjectUrls } from "@handyweb/core/files";
import { toToolError, type ToolError } from "@handyweb/core/runtime";
import {
    Button,
    Checkbox,
    ErrorMessage,
    FileDrop,
    Ltr,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import type { Group } from "./exif";
import { BLOCKS, GROUPS, strings } from "./i18n";
import { cleanName, readMetadata, stripMetadata, type Report, type StripResult } from "./logic";

const ORDER: Group[] = ["location", "owner", "camera", "photo", "other"];

export default function ImageMetadata({ locale, presetOptions }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const urls = useRef(new ObjectUrls());
    const [file, setFile] = useState<File | null>(null);
    const [bytes, setBytes] = useState<Uint8Array | null>(null);
    const [report, setReport] = useState<Report | null>(null);
    const [keepIcc, setKeepIcc] = useState(true);
    const [result, setResult] = useState<(StripResult & { url: string }) | null>(null);
    const [error, setError] = useState<ToolError | null>(null);

    useEffect(() => {
        const store = urls.current;
        return () => store.revokeAll();
    }, []);

    const reset = () => {
        urls.current.revokeAll();
        setFile(null);
        setBytes(null);
        setReport(null);
        setResult(null);
        setError(null);
    };

    const strip = (data: Uint8Array, keep: boolean) => {
        try {
            const stripped = stripMetadata(data, { keepIcc: keep });
            urls.current.revokeAll();
            const blob = new Blob([stripped.bytes as Uint8Array<ArrayBuffer>], {
                type: "application/octet-stream",
            });
            setResult({ ...stripped, url: urls.current.create(blob) });
        } catch (caught) {
            setError(toToolError(caught));
        }
    };

    const open = async (picked: File) => {
        reset();
        setFile(picked);
        try {
            const data = new Uint8Array(await picked.arrayBuffer());
            setBytes(data);
            setReport(readMetadata(data));
            // The "remove" preset removes the metadata at once.
            if (presetOptions?.["mode"] === "remove") strip(data, keepIcc);
        } catch (caught) {
            setError(toToolError(caught));
        }
    };

    if (!file || !bytes || !report) {
        return (
            <div className="flex flex-col gap-4">
                <FileDrop
                    locale={locale}
                    accept="image/jpeg,image/png,image/webp"
                    onFile={(picked) => void open(picked)}
                />
                {error && <ErrorMessage error={error} locale={locale} />}
            </div>
        );
    }

    const entries = report.exif?.entries ?? [];
    const sensitive = entries.some(
        (entry) => entry.tag.sensitive && entry.tag.group !== "location",
    );
    const textBlocks = report.blocks.filter((block) => block.label);

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2/60 p-3">
                <div className="min-w-0 flex-1 text-sm">
                    <Ltr className="block truncate font-semibold">{file.name}</Ltr>
                    <span className="text-xs text-muted tabular-nums">
                        {report.format.toUpperCase()} · {formatBytes(file.size, locale)}
                    </span>
                </div>
                <Button onClick={reset}>{t("another")}</Button>
            </div>

            {report.exif?.gps && (
                <p
                    role="alert"
                    className="rounded-2xl border border-error/40 bg-error-bg px-4 py-3 text-sm text-error"
                    data-tool-gps=""
                >
                    ⚠ {t("location")}{" "}
                    <Ltr className="font-mono">{`${report.exif.gps.latitude.toFixed(5)}, ${report.exif.gps.longitude.toFixed(5)}`}</Ltr>
                </p>
            )}
            {sensitive && (
                <p className="rounded-2xl border border-primary/40 bg-primary-soft px-4 py-3 text-sm">
                    ⚠ {t("private")}
                </p>
            )}

            {report.blocks.length === 0 ? (
                <p
                    className="rounded-2xl border border-border bg-bg px-4 py-3 text-sm"
                    data-tool-none=""
                >
                    {t("none")}
                </p>
            ) : (
                <section className="overflow-hidden rounded-2xl border border-border bg-bg">
                    <h2 className="border-b border-border/70 px-4 py-2.5 text-sm font-semibold">
                        {t("blocks")}
                    </h2>
                    <ul className="divide-y divide-border/50 text-sm" data-tool-blocks="">
                        {report.blocks.map((block, index) => (
                            <li key={index} className="flex justify-between gap-3 px-4 py-2">
                                <span>{BLOCKS[block.kind][locale]}</span>
                                <span className="text-muted tabular-nums">
                                    {formatBytes(block.bytes, locale)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {ORDER.map((group) => {
                const rows = entries.filter((entry) => entry.tag.group === group);
                if (rows.length === 0) return null;
                return (
                    <section
                        key={group}
                        className="overflow-hidden rounded-2xl border border-border bg-bg"
                    >
                        <h2 className="border-b border-border/70 px-4 py-2.5 text-sm font-semibold">
                            {GROUPS[group][locale]}
                        </h2>
                        <dl className="divide-y divide-border/50 text-sm">
                            {rows.map((entry, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-0.5 px-4 py-2 sm:flex-row sm:gap-3"
                                >
                                    <dt className="shrink-0 text-xs text-muted sm:w-48">
                                        {entry.tag.label[locale]}
                                    </dt>
                                    <dd className="min-w-0 flex-1 break-words">
                                        <Ltr>{entry.value}</Ltr>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                );
            })}
            {textBlocks.length > 0 && (
                <ul className="flex flex-col gap-1 rounded-2xl border border-border bg-bg px-4 py-3 text-sm">
                    {textBlocks.map((block, index) => (
                        <li key={index} className="break-words">
                            <span className="text-muted">{BLOCKS[block.kind][locale]}: </span>
                            <bdi>{block.label}</bdi>
                        </li>
                    ))}
                </ul>
            )}
            {(report.exif?.otherCount ?? 0) > 0 && (
                <p className="text-xs text-muted">
                    + {report.exif?.otherCount} {t("others")}
                </p>
            )}

            {report.blocks.length > 0 && (
                <div className="flex flex-col gap-3">
                    <Checkbox
                        label={t("keepIcc")}
                        checked={keepIcc}
                        onChange={(value) => {
                            setKeepIcc(value);
                            setResult(null);
                        }}
                    />
                    <p className="-mt-2 text-xs text-muted">{t("keepIccHelp")}</p>
                    <Button
                        variant="primary"
                        className="w-fit"
                        onClick={() => strip(bytes, keepIcc)}
                        data-tool-run=""
                    >
                        {t("strip")}
                    </Button>
                </div>
            )}

            {error && <ErrorMessage error={error} locale={locale} />}

            {result && (
                <section className="flex flex-col gap-3 rounded-2xl border border-border bg-bg p-4">
                    {result.remaining.length === 0 ? (
                        <p className="text-sm text-success" role="status" data-tool-verified="">
                            ✓ {t("verified")}
                        </p>
                    ) : (
                        <p className="text-sm text-error" role="alert">
                            {t("leftover")}{" "}
                            {result.remaining.map((block) => BLOCKS[block.kind][locale]).join("، ")}
                        </p>
                    )}
                    {result.keptOrientation && (
                        <p className="text-xs text-muted">{t("orientationKept")}</p>
                    )}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                        <span className="tabular-nums">
                            {formatBytes(file.size, locale)} →{" "}
                            {formatBytes(result.bytes.length, locale)}
                        </span>
                        <Button
                            variant="primary"
                            onClick={() =>
                                downloadBlob(
                                    new Blob([result.bytes as Uint8Array<ArrayBuffer>], {
                                        type: `image/${report.format}`,
                                    }),
                                    cleanName(file.name),
                                )
                            }
                        >
                            {UI_STRINGS.download[locale]}
                        </Button>
                    </div>
                </section>
            )}
            <input
                type="hidden"
                value={result ? String(result.remaining.length) : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
