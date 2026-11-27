import { useEffect, useId, useRef, useState } from "react";
import { downloadBlob, formatBytes, ObjectUrls } from "@handyweb/core/files";
import {
    decodeImage,
    defaultOutputType,
    drawScaled,
    renderToBlob,
    type DecodedImage,
    type OutputType,
} from "@handyweb/core/image";
import { toToolError, type ToolError } from "@handyweb/core/runtime";
import {
    Button,
    Checkbox,
    ErrorMessage,
    FileDrop,
    Ltr,
    Segmented,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { strings } from "./i18n";
import { outputName, targetSize, type ResizeRequest } from "./logic";

type Mode = ResizeRequest["mode"];
type Format = "same" | OutputType;

interface Result {
    url: string;
    blob: Blob;
    name: string;
    width: number;
    height: number;
}

const FIELD =
    "min-h-11 w-full rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";

export default function ImageResize({ locale, presetOptions }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const urls = useRef(new ObjectUrls());
    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<DecodedImage | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [mode, setMode] = useState<Mode>(
        presetOptions?.["mode"] === "percent" ? "percent" : "pixels",
    );
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [keepRatio, setKeepRatio] = useState(true);
    const [percent, setPercent] = useState("50");
    const [side, setSide] = useState("1920");
    const [format, setFormat] = useState<Format>("same");
    const [quality, setQuality] = useState(85);
    const [result, setResult] = useState<Result | null>(null);
    const [error, setError] = useState<ToolError | null>(null);
    const [busy, setBusy] = useState(false);
    const ids = {
        width: useId(),
        height: useId(),
        percent: useId(),
        side: useId(),
        format: useId(),
        quality: useId(),
    };

    useEffect(() => {
        const store = urls.current;
        return () => store.revokeAll();
    }, []);
    useEffect(() => () => image?.bitmap.close(), [image]);

    const reset = () => {
        urls.current.revokeAll();
        setFile(null);
        setImage(null);
        setPreview(null);
        setResult(null);
        setError(null);
    };

    const open = async (picked: File) => {
        reset();
        setFile(picked);
        try {
            const decoded = await decodeImage(picked);
            setImage(decoded);
            setPreview(urls.current.create(picked));
            setWidth(String(decoded.width));
            setHeight(String(decoded.height));
        } catch (caught) {
            setError(toToolError(caught));
        }
    };

    const type: OutputType = image
        ? format === "same"
            ? defaultOutputType(image.format)
            : format
        : "image/png";

    const request = (): ResizeRequest =>
        mode === "percent"
            ? { mode, percent: Number(percent) }
            : mode === "longest"
              ? { mode, side: Number(side) }
              : {
                    mode,
                    width: width === "" ? null : Number(width),
                    height: height === "" ? null : Number(height),
                    keepRatio,
                };

    // Shows the size that a click will give, or nothing for an empty field.
    let planned: { width: number; height: number } | null = null;
    if (image) {
        try {
            planned = targetSize(image.width, image.height, request());
        } catch {
            planned = null;
        }
    }

    const resize = async () => {
        if (!image || !file) return;
        setBusy(true);
        setError(null);
        try {
            const size = targetSize(image.width, image.height, request());
            const blob = await renderToBlob(
                size.width,
                size.height,
                (context) => drawScaled(context, image.bitmap, size.width, size.height),
                type,
                quality / 100,
            );
            if (result) urls.current.revoke(result.url);
            setResult({
                url: urls.current.create(blob),
                blob,
                name: outputName(file.name, size.width, size.height, type),
                ...size,
            });
        } catch (caught) {
            setResult(null);
            setError(toToolError(caught));
        } finally {
            setBusy(false);
        }
    };

    // With "keep ratio", typing one side fills in the other one.
    const changeWidth = (value: string) => {
        setWidth(value);
        if (keepRatio && image && Number(value) > 0)
            setHeight(String(Math.round((Number(value) * image.height) / image.width)));
    };
    const changeHeight = (value: string) => {
        setHeight(value);
        if (keepRatio && image && Number(value) > 0)
            setWidth(String(Math.round((Number(value) * image.width) / image.height)));
    };

    if (!image || !file) {
        return (
            <div className="flex flex-col gap-4">
                <FileDrop
                    locale={locale}
                    accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
                    onFile={(picked) => void open(picked)}
                />
                {error && <ErrorMessage error={error} locale={locale} />}
                <p className="text-xs text-muted">{t("metadata")}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2/60 p-3">
                {preview && (
                    <img
                        src={preview}
                        alt=""
                        className="size-14 shrink-0 rounded-lg object-contain"
                    />
                )}
                <div className="min-w-0 flex-1 text-sm">
                    <Ltr className="block truncate font-semibold">{file.name}</Ltr>
                    <span className="text-xs text-muted tabular-nums" data-tool-source-size="">
                        <Ltr>{`${image.width} × ${image.height}`}</Ltr> ·{" "}
                        {formatBytes(file.size, locale)}
                    </span>
                </div>
                <Button onClick={reset}>{t("another")}</Button>
            </div>

            <Segmented<Mode>
                legend={t("mode")}
                value={mode}
                onChange={setMode}
                options={[
                    { value: "pixels", label: t("pixels") },
                    { value: "percent", label: t("percent") },
                    { value: "longest", label: t("longest") },
                ]}
            />

            {mode === "pixels" && (
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                        <label
                            htmlFor={ids.width}
                            className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
                        >
                            {t("width")}
                            <input
                                id={ids.width}
                                type="number"
                                min={1}
                                inputMode="numeric"
                                dir="ltr"
                                value={width}
                                onChange={(event) => changeWidth(event.target.value)}
                                className={FIELD}
                                data-tool-width=""
                            />
                        </label>
                        <label
                            htmlFor={ids.height}
                            className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
                        >
                            {t("height")}
                            <input
                                id={ids.height}
                                type="number"
                                min={1}
                                inputMode="numeric"
                                dir="ltr"
                                value={height}
                                onChange={(event) => changeHeight(event.target.value)}
                                className={FIELD}
                                data-tool-height=""
                            />
                        </label>
                    </div>
                    <Checkbox label={t("keepRatio")} checked={keepRatio} onChange={setKeepRatio} />
                </div>
            )}
            {mode === "percent" && (
                <label
                    htmlFor={ids.percent}
                    className="flex max-w-48 flex-col gap-1.5 text-xs font-semibold text-muted"
                >
                    {t("percent")}
                    <input
                        id={ids.percent}
                        type="number"
                        min={1}
                        max={1000}
                        dir="ltr"
                        value={percent}
                        onChange={(event) => setPercent(event.target.value)}
                        className={FIELD}
                    />
                </label>
            )}
            {mode === "longest" && (
                <label
                    htmlFor={ids.side}
                    className="flex max-w-48 flex-col gap-1.5 text-xs font-semibold text-muted"
                >
                    {t("longest")}
                    <input
                        id={ids.side}
                        type="number"
                        min={1}
                        dir="ltr"
                        value={side}
                        onChange={(event) => setSide(event.target.value)}
                        className={FIELD}
                    />
                </label>
            )}

            <div className="flex flex-wrap items-end gap-4">
                <label
                    htmlFor={ids.format}
                    className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
                >
                    {t("format")}
                    <select
                        id={ids.format}
                        value={format}
                        onChange={(event) => setFormat(event.target.value as Format)}
                        className={FIELD}
                    >
                        <option value="same">{t("same")}</option>
                        <option value="image/png">PNG</option>
                        <option value="image/jpeg">JPEG</option>
                        <option value="image/webp">WebP</option>
                    </select>
                </label>
                {type !== "image/png" && (
                    <label
                        htmlFor={ids.quality}
                        className="flex min-w-48 flex-1 flex-col gap-1.5 text-xs font-semibold text-muted"
                    >
                        <span>
                            {t("quality")}: <span className="tabular-nums">{quality}</span>
                        </span>
                        <input
                            id={ids.quality}
                            type="range"
                            min={10}
                            max={100}
                            value={quality}
                            onChange={(event) => setQuality(Number(event.target.value))}
                            className="min-h-11 accent-primary"
                        />
                    </label>
                )}
            </div>
            {type === "image/jpeg" && image.format !== "jpeg" && (
                <p className="text-xs text-muted">{t("jpegAlpha")}</p>
            )}

            <div className="flex flex-wrap items-center gap-3">
                <Button
                    variant="primary"
                    onClick={() => void resize()}
                    disabled={!planned || busy}
                    data-tool-run=""
                >
                    {busy ? UI_STRINGS.working[locale] : t("resize")}
                </Button>
                {planned && (
                    <span className="text-sm text-muted tabular-nums">
                        <Ltr>{`${planned.width} × ${planned.height}`}</Ltr>
                    </span>
                )}
            </div>

            {error && <ErrorMessage error={error} locale={locale} />}

            {result && (
                <section
                    className="flex flex-col gap-3 rounded-2xl border border-border bg-bg p-4"
                    aria-label={t("result")}
                >
                    <img
                        src={result.url}
                        alt={t("result")}
                        className="max-h-96 self-center rounded-lg object-contain"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                        <span className="tabular-nums">
                            <Ltr>{`${result.width} × ${result.height}`}</Ltr> ·{" "}
                            {formatBytes(result.blob.size, locale)}
                        </span>
                        <Button
                            variant="primary"
                            onClick={() => downloadBlob(result.blob, result.name)}
                        >
                            {UI_STRINGS.download[locale]}
                        </Button>
                    </div>
                </section>
            )}
            <p className="text-xs text-muted">{t("metadata")}</p>
            <input
                type="hidden"
                value={result ? `${result.width}x${result.height}` : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
