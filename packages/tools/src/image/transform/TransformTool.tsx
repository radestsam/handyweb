import { useEffect, useId, useRef, useState } from "react";
import { downloadBlob, formatBytes, ObjectUrls, safeFileName } from "@handyweb/core/files";
import {
    decodeImage,
    defaultOutputType,
    EXTENSIONS,
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
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { strings } from "./i18n";
import { isLossless, matrix, normalizeAngle, rotatedSize, type Transform } from "./logic";

type Format = "same" | OutputType;

const FIELD =
    "min-h-11 rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";

/**
 * The shared page of the rotate and flip tools. Both can do both; the
 * "focus" decides which controls come first.
 */
export function TransformTool({ locale, focus }: ToolUiProps & { focus: "rotate" | "flip" }) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const urls = useRef(new ObjectUrls());
    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<DecodedImage | null>(null);
    const [transform, setTransform] = useState<Transform>({ angle: 0, flipX: false, flipY: false });
    const [transparent, setTransparent] = useState(true);
    const [background, setBackground] = useState("#ffffff");
    const [format, setFormat] = useState<Format>("same");
    const [result, setResult] = useState<{
        url: string;
        blob: Blob;
        width: number;
        height: number;
    } | null>(null);
    const [error, setError] = useState<ToolError | null>(null);
    const [busy, setBusy] = useState(false);
    const ids = { angle: useId(), format: useId(), background: useId() };

    useEffect(() => {
        const store = urls.current;
        return () => store.revokeAll();
    }, []);
    useEffect(() => () => image?.bitmap.close(), [image]);

    const reset = () => {
        urls.current.revokeAll();
        setFile(null);
        setImage(null);
        setResult(null);
        setError(null);
        setTransform({ angle: 0, flipX: false, flipY: false });
    };

    const open = async (picked: File) => {
        reset();
        setFile(picked);
        try {
            setImage(await decodeImage(picked));
        } catch (caught) {
            setError(toToolError(caught));
        }
    };

    const update = (next: Partial<Transform>) => {
        setTransform((current) => ({ ...current, ...next }));
        if (result) urls.current.revoke(result.url);
        setResult(null);
    };

    const angle = normalizeAngle(transform.angle);
    // Turning a JPEG by another angle gives corners; JPEG has no transparency.
    const type: OutputType = image
        ? format === "same"
            ? defaultOutputType(image.format)
            : format
        : "image/png";
    const corners = !isLossless(angle);

    const make = async () => {
        if (!image) return;
        setBusy(true);
        setError(null);
        try {
            const size = rotatedSize(image.width, image.height, angle);
            const blob = await renderToBlob(
                size.width,
                size.height,
                (context) => {
                    if (corners && (!transparent || type === "image/jpeg")) {
                        context.fillStyle = transparent ? "#ffffff" : background;
                        context.fillRect(0, 0, size.width, size.height);
                    }
                    context.setTransform(...matrix(transform, size.width, size.height));
                    context.drawImage(image.bitmap, -image.width / 2, -image.height / 2);
                },
                type,
                0.92,
            );
            setResult({ url: urls.current.create(blob), blob, ...size });
        } catch (caught) {
            setError(toToolError(caught));
        } finally {
            setBusy(false);
        }
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

    const name = safeFileName(
        `${file.name.replace(/\.[^.]+$/, "") || "image"}-${focus === "flip" ? "flipped" : "rotated"}.${EXTENSIONS[type]}`,
    );
    const rotate = (
        <div className="flex flex-wrap items-end gap-2">
            <Button onClick={() => update({ angle: angle - 90 })}>↺ {t("rotateLeft")}</Button>
            <Button onClick={() => update({ angle: angle + 90 })} data-tool-rotate-right="">
                ↻ {t("rotateRight")}
            </Button>
            <Button onClick={() => update({ angle: angle + 180 })}>{t("rotate180")}</Button>
            <label
                htmlFor={ids.angle}
                className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
            >
                {t("angle")}
                <input
                    id={ids.angle}
                    type="number"
                    min={-360}
                    max={360}
                    dir="ltr"
                    value={angle}
                    onChange={(event) => update({ angle: Number(event.target.value) || 0 })}
                    className={`${FIELD} w-28`}
                    data-tool-angle=""
                />
            </label>
        </div>
    );
    const flip = (
        <div className="flex flex-wrap gap-x-6 gap-y-1">
            <Checkbox
                label={t("flipX")}
                checked={transform.flipX}
                onChange={(flipX) => update({ flipX })}
            />
            <Checkbox
                label={t("flipY")}
                checked={transform.flipY}
                onChange={(flipY) => update({ flipY })}
            />
        </div>
    );
    const size = rotatedSize(image.width, image.height, angle);

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

            {focus === "rotate" ? (
                <>
                    {rotate}
                    {flip}
                </>
            ) : (
                <>
                    {flip}
                    {rotate}
                </>
            )}

            {corners && (
                <div className="flex flex-col gap-2">
                    <p className="text-xs text-muted">{t("lossy")}</p>
                    <div className="flex flex-wrap items-center gap-4">
                        <Checkbox
                            label={t("transparent")}
                            checked={transparent}
                            onChange={setTransparent}
                        />
                        {!transparent && (
                            <label
                                htmlFor={ids.background}
                                className="flex items-center gap-2 text-sm"
                            >
                                {t("background")}
                                <input
                                    id={ids.background}
                                    type="color"
                                    value={background}
                                    onChange={(event) => setBackground(event.target.value)}
                                    className="h-11 w-14 rounded-lg border border-border"
                                />
                            </label>
                        )}
                    </div>
                </div>
            )}

            <label
                htmlFor={ids.format}
                className="flex w-fit flex-col gap-1.5 text-xs font-semibold text-muted"
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

            <div className="flex flex-wrap items-center gap-3">
                <Button
                    variant="primary"
                    onClick={() => void make()}
                    disabled={busy}
                    data-tool-run=""
                >
                    {busy ? UI_STRINGS.working[locale] : t("apply")}
                </Button>
                <span className="text-sm text-muted tabular-nums">
                    <Ltr>{`${size.width} × ${size.height}`}</Ltr>
                </span>
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
                        <Button variant="primary" onClick={() => downloadBlob(result.blob, name)}>
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
