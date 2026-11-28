import { useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { downloadBlob, formatBytes, ObjectUrls } from "@handyweb/core/files";
import {
    decodeImage,
    defaultOutputType,
    renderToBlob,
    type DecodedImage,
    type OutputType,
} from "@handyweb/core/image";
import { toToolError, type ToolError } from "@handyweb/core/runtime";
import {
    Button,
    ErrorMessage,
    FileDrop,
    Ltr,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { strings } from "./i18n";
import { centeredCrop, clampRect, cropName, RATIOS, resizeTo, type Rect } from "./logic";

type Format = "same" | OutputType;

const FIELD =
    "min-h-11 w-full rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";

export default function ImageCrop({ locale, presetOptions }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const urls = useRef(new ObjectUrls());
    const frame = useRef<HTMLDivElement>(null);
    const drag = useRef<{
        kind: "move" | "resize";
        startX: number;
        startY: number;
        rect: Rect;
    } | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<DecodedImage | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const presetRatio = RATIOS.find((r) => r.id === presetOptions?.["ratio"])?.id ?? "free";
    const [ratioId, setRatioId] = useState(presetRatio);
    const [rect, setRect] = useState<Rect>({ x: 0, y: 0, width: 1, height: 1 });
    const [format, setFormat] = useState<Format>("same");
    const [result, setResult] = useState<{ url: string; blob: Blob; name: string } | null>(null);
    const [error, setError] = useState<ToolError | null>(null);
    const [busy, setBusy] = useState(false);
    const ids = {
        ratio: useId(),
        format: useId(),
        x: useId(),
        y: useId(),
        width: useId(),
        height: useId(),
    };
    const ratio = RATIOS.find((r) => r.id === ratioId)?.value ?? null;

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
            // The preview must show the image as decoded (turned by EXIF), so draw it once.
            const canvas = document.createElement("canvas");
            canvas.width = decoded.width;
            canvas.height = decoded.height;
            canvas.getContext("2d")?.drawImage(decoded.bitmap, 0, 0);
            const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob(resolve, "image/png"),
            );
            canvas.width = canvas.height = 0;
            setImage(decoded);
            setPreview(blob ? urls.current.create(blob) : urls.current.create(picked));
            setRect(centeredCrop(decoded.width, decoded.height, ratio));
        } catch (caught) {
            setError(toToolError(caught));
        }
    };

    const changeResult = () => {
        if (result) urls.current.revoke(result.url);
        setResult(null);
    };
    const update = (next: Rect) => {
        if (!image) return;
        setRect(clampRect(next, image.width, image.height));
        changeResult();
    };

    const changeRatio = (id: string) => {
        setRatioId(id);
        if (image)
            update(
                centeredCrop(
                    image.width,
                    image.height,
                    RATIOS.find((r) => r.id === id)?.value ?? null,
                ),
            );
    };

    // Source pixels per screen pixel of the preview.
    const scale = () =>
        image && frame.current ? image.width / frame.current.getBoundingClientRect().width : 1;

    const startDrag = (kind: "move" | "resize", event: ReactPointerEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
        drag.current = { kind, startX: event.clientX, startY: event.clientY, rect };
    };
    const moveDrag = (event: ReactPointerEvent<HTMLElement>) => {
        const current = drag.current;
        if (!current || !image) return;
        const k = scale();
        const dx = (event.clientX - current.startX) * k;
        const dy = (event.clientY - current.startY) * k;
        if (current.kind === "move")
            update({ ...current.rect, x: current.rect.x + dx, y: current.rect.y + dy });
        else {
            setRect(
                resizeTo(
                    current.rect,
                    current.rect.x + current.rect.width + dx,
                    current.rect.y + current.rect.height + dy,
                    ratio,
                    image.width,
                    image.height,
                ),
            );
            changeResult();
        }
    };
    const endDrag = () => {
        drag.current = null;
    };

    const type: OutputType = image
        ? format === "same"
            ? defaultOutputType(image.format)
            : format
        : "image/png";

    const crop = async () => {
        if (!image || !file) return;
        setBusy(true);
        setError(null);
        try {
            const blob = await renderToBlob(
                rect.width,
                rect.height,
                (context) =>
                    context.drawImage(
                        image.bitmap,
                        rect.x,
                        rect.y,
                        rect.width,
                        rect.height,
                        0,
                        0,
                        rect.width,
                        rect.height,
                    ),
                type,
                0.92,
            );
            changeResult();
            setResult({
                url: urls.current.create(blob),
                blob,
                name: cropName(file.name, rect, type),
            });
        } catch (caught) {
            setError(toToolError(caught));
        } finally {
            setBusy(false);
        }
    };

    if (!image || !file || !preview) {
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

    const percent = (value: number, total: number) => `${(value / total) * 100}%`;
    const numberField = (key: "x" | "y" | "width" | "height") => (
        <label
            htmlFor={ids[key]}
            className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
        >
            {t(key)}
            <input
                id={ids[key]}
                type="number"
                min={key === "width" || key === "height" ? 1 : 0}
                dir="ltr"
                value={rect[key]}
                onChange={(event) => {
                    const value = Number(event.target.value);
                    if (!Number.isFinite(value)) return;
                    const next = { ...rect, [key]: value };
                    // Typing one side keeps the ratio by changing the other side.
                    if (ratio !== null && key === "width") next.height = value / ratio;
                    if (ratio !== null && key === "height") next.width = value * ratio;
                    update(next);
                }}
                className={FIELD}
                data-crop-field={key}
            />
        </label>
    );

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2/60 p-3">
                <div className="min-w-0 flex-1 text-sm">
                    <Ltr className="block truncate font-semibold">{file.name}</Ltr>
                    <span className="text-xs text-muted tabular-nums">
                        <Ltr>{`${image.width} × ${image.height}`}</Ltr> ·{" "}
                        {formatBytes(file.size, locale)}
                    </span>
                </div>
                <Button onClick={reset}>{t("another")}</Button>
            </div>

            <label
                htmlFor={ids.ratio}
                className="flex w-fit flex-col gap-1.5 text-xs font-semibold text-muted"
            >
                {t("ratio")}
                <select
                    id={ids.ratio}
                    value={ratioId}
                    onChange={(event) => changeRatio(event.target.value)}
                    className={FIELD}
                    data-crop-ratio=""
                >
                    {RATIOS.map((r) => (
                        <option key={r.id} value={r.id}>
                            {r.value === null ? t("free") : r.label}
                        </option>
                    ))}
                </select>
            </label>

            {/* Image coordinates run left to right, so the frame is LTR in both languages. */}
            <div
                dir="ltr"
                className="flex justify-center rounded-2xl border border-border bg-surface-2/60 p-3"
            >
                <div
                    ref={frame}
                    className="relative touch-none select-none"
                    style={{ maxWidth: "100%" }}
                >
                    <img
                        src={preview}
                        alt=""
                        draggable={false}
                        className="block max-h-[28rem] max-w-full"
                    />
                    <div
                        role="presentation"
                        aria-label={t("area")}
                        onPointerDown={(event) => startDrag("move", event)}
                        onPointerMove={moveDrag}
                        onPointerUp={endDrag}
                        onPointerCancel={endDrag}
                        className="absolute cursor-move border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] outline outline-1 outline-black/60"
                        style={{
                            insetInlineStart: percent(rect.x, image.width),
                            top: percent(rect.y, image.height),
                            width: percent(rect.width, image.width),
                            height: percent(rect.height, image.height),
                        }}
                        data-crop-area=""
                    >
                        <span
                            aria-hidden="true"
                            title={t("handle")}
                            onPointerDown={(event) => startDrag("resize", event)}
                            onPointerMove={moveDrag}
                            onPointerUp={endDrag}
                            onPointerCancel={endDrag}
                            className="absolute -end-3 -bottom-3 size-6 cursor-nwse-resize rounded-full border-2 border-white bg-primary"
                            data-crop-handle=""
                        />
                    </div>
                </div>
            </div>
            <p className="-mt-2 text-xs text-muted">{t("help")}</p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {numberField("x")}
                {numberField("y")}
                {numberField("width")}
                {numberField("height")}
            </div>

            <div className="flex flex-wrap items-end gap-3">
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
                <Button
                    variant="primary"
                    onClick={() => void crop()}
                    disabled={busy}
                    data-tool-run=""
                >
                    {busy ? UI_STRINGS.working[locale] : t("crop")}
                </Button>
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
                            <Ltr>{`${rect.width} × ${rect.height}`}</Ltr> ·{" "}
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
                value={result ? `${rect.x},${rect.y},${rect.width}x${rect.height}` : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
