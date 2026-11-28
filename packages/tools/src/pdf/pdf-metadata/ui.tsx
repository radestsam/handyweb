import { useId, useState } from "react";
import { downloadBlob, formatBytes } from "@handyweb/core/files";
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
import { fieldLabels, strings } from "./i18n";
import {
    emptyText,
    MAX_FILE_BYTES,
    outputName,
    readMetadata,
    TEXT_FIELDS,
    writeMetadata,
    type PdfMetadata,
    type TextField,
} from "./logic";

const FIELD =
    "min-h-11 w-full rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";

export default function PdfMetadataEditor({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const baseId = useId();
    const [file, setFile] = useState<File | null>(null);
    const [bytes, setBytes] = useState<Uint8Array | null>(null);
    const [metadata, setMetadata] = useState<PdfMetadata | null>(null);
    const [text, setText] = useState<Record<TextField, string>>(emptyText());
    const [keepCreated, setKeepCreated] = useState(true);
    const [keepModified, setKeepModified] = useState(true);
    const [reading, setReading] = useState(false);
    const [busy, setBusy] = useState(false);
    const [result, setResult] = useState<{ blob: Blob; name: string; cleaned: boolean } | null>(
        null,
    );
    const [error, setError] = useState<ToolError | null>(null);

    const reset = () => {
        setFile(null);
        setBytes(null);
        setMetadata(null);
        setText(emptyText());
        setResult(null);
        setError(null);
    };

    const open = async (picked: File) => {
        reset();
        if (picked.size > MAX_FILE_BYTES) {
            setError({ code: "too-large", message: strings.tooLarge });
            return;
        }
        setReading(true);
        try {
            const data = new Uint8Array(await picked.arrayBuffer());
            const read = await readMetadata(data);
            setFile(picked);
            setBytes(data);
            setMetadata(read);
            setText(read.text);
            setKeepCreated(true);
            setKeepModified(true);
        } catch (caught) {
            setError(toToolError(caught));
        } finally {
            setReading(false);
        }
    };

    const save = async (clean: boolean) => {
        if (!bytes || !file || !metadata) return;
        setBusy(true);
        setError(null);
        setResult(null);
        try {
            const output = await writeMetadata(
                bytes,
                clean ? emptyText() : text,
                clean
                    ? { created: undefined, modified: undefined }
                    : {
                          created: keepCreated ? metadata.created : undefined,
                          modified: keepModified ? metadata.modified : undefined,
                      },
            );
            if (clean) setText(emptyText());
            setResult({
                blob: new Blob([output as Uint8Array<ArrayBuffer>], { type: "application/pdf" }),
                name: outputName(file.name),
                cleaned: clean,
            });
        } catch (caught) {
            setError(toToolError(caught));
        } finally {
            setBusy(false);
        }
    };

    const number = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en");
    const date = (value: Date | undefined) =>
        value
            ? new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en", {
                  dateStyle: "medium",
                  timeStyle: "short",
              }).format(value)
            : t("none");

    if (!file || !metadata)
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
                <input type="hidden" value="" readOnly data-tool-output="" />
            </div>
        );

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2/60 p-3">
                <div className="min-w-0 flex-1 text-sm">
                    <Ltr className="block truncate font-semibold">{file.name}</Ltr>
                    <span className="text-xs text-muted tabular-nums">
                        {number.format(metadata.pages)} {t("pages")} ·{" "}
                        {formatBytes(file.size, locale)}
                    </span>
                </div>
                <Button onClick={reset} disabled={busy}>
                    {t("another")}
                </Button>
            </div>

            <fieldset className="flex flex-col gap-3">
                <legend className="mb-1 text-sm font-semibold">{t("fields")}</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                    {TEXT_FIELDS.map((key) => (
                        <label
                            key={key}
                            htmlFor={`${baseId}-${key}`}
                            className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
                        >
                            {fieldLabels[key][locale]}
                            <input
                                id={`${baseId}-${key}`}
                                type="text"
                                dir="auto"
                                autoComplete="off"
                                value={text[key]}
                                placeholder={t("empty")}
                                onChange={(event) => {
                                    setText({ ...text, [key]: event.target.value });
                                    setResult(null);
                                }}
                                className={FIELD}
                                data-tool-field={key}
                            />
                        </label>
                    ))}
                </div>
                <p className="text-xs text-muted">{t("emptyNote")}</p>
            </fieldset>

            <dl className="grid gap-2 text-sm sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                    <dt className="text-xs font-semibold text-muted">{t("created")}</dt>
                    <dd data-tool-created="">{date(metadata.created)}</dd>
                    {metadata.created && (
                        <dd>
                            <Checkbox
                                label={t("keep")}
                                checked={keepCreated}
                                onChange={(value) => {
                                    setKeepCreated(value);
                                    setResult(null);
                                }}
                            />
                        </dd>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <dt className="text-xs font-semibold text-muted">{t("modified")}</dt>
                    <dd>{date(metadata.modified)}</dd>
                    {metadata.modified && (
                        <dd>
                            <Checkbox
                                label={t("keep")}
                                checked={keepModified}
                                onChange={(value) => {
                                    setKeepModified(value);
                                    setResult(null);
                                }}
                            />
                        </dd>
                    )}
                </div>
            </dl>

            {metadata.otherKeys.length > 0 && (
                <p className="text-sm" data-tool-other-keys="">
                    {t("otherKeys")}{" "}
                    {metadata.otherKeys.map((key, index) => (
                        <span key={key}>
                            {index > 0 && ", "}
                            <Ltr>{key}</Ltr>
                        </span>
                    ))}
                </p>
            )}
            {metadata.hasXmp && (
                <p
                    role="note"
                    className="rounded-2xl border border-primary/40 bg-primary-soft px-4 py-3 text-sm"
                    data-tool-xmp=""
                >
                    {t("xmp")}
                </p>
            )}

            <div className="flex flex-wrap gap-3">
                <Button
                    variant="primary"
                    onClick={() => void save(false)}
                    disabled={busy}
                    data-tool-run=""
                >
                    {busy ? UI_STRINGS.working[locale] : t("save")}
                </Button>
                <Button onClick={() => void save(true)} disabled={busy} data-tool-clean="">
                    {t("removeAll")}
                </Button>
            </div>
            {error && <ErrorMessage error={error} locale={locale} />}

            {result && (
                <section
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-bg p-4 text-sm"
                    aria-label={t("result")}
                >
                    <div className="min-w-0">
                        <Ltr className="block truncate font-semibold">{result.name}</Ltr>
                        <span className="text-xs text-muted tabular-nums">
                            {formatBytes(result.blob.size, locale)}
                            {result.cleaned && ` · ${t("cleaned")}`}
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
                value={result ? (result.cleaned ? "cleaned" : "saved") : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
