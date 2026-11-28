import { useId, useState } from "react";
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
import { openPdf } from "../shared/pdflib";
import { strings } from "./i18n";
import {
    addWatermark,
    MAX_FILE_BYTES,
    MAX_TEXT,
    watermarkedName,
    type Layout,
    type Size,
} from "./logic";
import { renderTextImage, type ColorName } from "./text-image";

const FIELD =
    "min-h-11 w-full rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";

type Angle = "diagonal" | "straight";

export default function PdfWatermark({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const ids = { text: useId(), opacity: useId() };
    const [file, setFile] = useState<File | null>(null);
    const [bytes, setBytes] = useState<Uint8Array | null>(null);
    const [pages, setPages] = useState(0);
    const [text, setText] = useState<string>(strings.defaultText[locale]);
    const [color, setColor] = useState<ColorName>("gray");
    const [layout, setLayout] = useState<Layout>("center");
    const [angle, setAngle] = useState<Angle>("diagonal");
    const [size, setSize] = useState<Size>("medium");
    const [opacity, setOpacity] = useState(25);
    const [reading, setReading] = useState(false);
    const [busy, setBusy] = useState(false);
    const [progress, setProgress] = useState({ completed: 0, total: 0 });
    const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);
    const [error, setError] = useState<ToolError | null>(null);

    const reset = () => {
        setFile(null);
        setBytes(null);
        setPages(0);
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
            setPages((await openPdf(data)).getPageCount());
            setFile(picked);
            setBytes(data);
        } catch (caught) {
            setError(toToolError(caught));
        } finally {
            setReading(false);
        }
    };

    const apply = async () => {
        if (!file || !bytes) return;
        const value = text.trim();
        if (value === "") {
            setError({ code: "invalid-input", message: strings.needText });
            return;
        }
        setBusy(true);
        setError(null);
        setResult(null);
        setProgress({ completed: 0, total: pages });
        try {
            const image = await renderTextImage(value, color);
            const output = await addWatermark(
                bytes,
                image.png,
                {
                    layout,
                    size,
                    angle: angle === "diagonal" ? 45 : 0,
                    opacity: opacity / 100,
                },
                (completed, total) => setProgress({ completed, total }),
            );
            setResult({
                blob: new Blob([output as Uint8Array<ArrayBuffer>], { type: "application/pdf" }),
                name: watermarkedName(file.name),
            });
        } catch (caught) {
            setError(toToolError(caught));
        } finally {
            setBusy(false);
        }
    };

    const changed =
        <T,>(set: (value: T) => void) =>
        (value: T) => {
            set(value);
            setResult(null);
        };
    const number = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en");

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
                <p className="text-xs text-muted">{t("note")}</p>
            </div>
        );

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2/60 p-3">
                <div className="min-w-0 flex-1 text-sm">
                    <Ltr className="block truncate font-semibold">{file.name}</Ltr>
                    <span className="text-xs text-muted tabular-nums">
                        {number.format(pages)} {t("pages")} · {formatBytes(file.size, locale)}
                    </span>
                </div>
                <Button onClick={reset} disabled={busy}>
                    {t("another")}
                </Button>
            </div>

            <label
                htmlFor={ids.text}
                className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
            >
                {t("text")}
                <input
                    id={ids.text}
                    type="text"
                    dir="auto"
                    autoComplete="off"
                    maxLength={MAX_TEXT}
                    value={text}
                    onChange={(event) => changed(setText)(event.target.value)}
                    className={FIELD}
                    data-tool-text=""
                />
            </label>
            <Segmented<ColorName>
                legend={t("color")}
                value={color}
                onChange={changed(setColor)}
                options={[
                    { value: "gray", label: t("gray") },
                    { value: "red", label: t("red") },
                    { value: "blue", label: t("blue") },
                ]}
            />
            <Segmented<Layout>
                legend={t("layout")}
                value={layout}
                onChange={changed(setLayout)}
                options={[
                    { value: "center", label: t("center") },
                    { value: "tiled", label: t("tiled") },
                ]}
            />
            <Segmented<Angle>
                legend={t("angle")}
                value={angle}
                onChange={changed(setAngle)}
                options={[
                    { value: "diagonal", label: t("diagonal") },
                    { value: "straight", label: t("straight") },
                ]}
            />
            <Segmented<Size>
                legend={t("size")}
                value={size}
                onChange={changed(setSize)}
                options={[
                    { value: "small", label: t("small") },
                    { value: "medium", label: t("medium") },
                    { value: "large", label: t("large") },
                ]}
            />
            <label
                htmlFor={ids.opacity}
                className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
            >
                <span>
                    {t("opacity")}: <span className="tabular-nums">{number.format(opacity)}%</span>
                </span>
                <input
                    id={ids.opacity}
                    type="range"
                    min={5}
                    max={80}
                    step={5}
                    value={opacity}
                    onChange={(event) => changed(setOpacity)(Number(event.target.value))}
                    className="min-h-11 accent-primary"
                />
            </label>

            <Button
                variant="primary"
                className="w-fit"
                onClick={() => void apply()}
                disabled={busy}
                data-tool-run=""
            >
                {busy ? UI_STRINGS.working[locale] : t("apply")}
            </Button>
            {busy && <Progress value={progress} locale={locale} />}
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
            <p className="text-xs text-muted">{t("note")}</p>
            <input
                type="hidden"
                value={result ? String(result.blob.size) : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
