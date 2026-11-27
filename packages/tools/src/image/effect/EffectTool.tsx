import { useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ObjectUrls, safeFileName } from "@handyweb/core/files";
import {
    checkCanvasSize,
    decodeImage,
    defaultOutputType,
    EXTENSIONS,
    type DecodedImage,
    type OutputType,
} from "@handyweb/core/image";
import { toToolError, type ToolError } from "@handyweb/core/runtime";
import type { Locale } from "@handyweb/core";
import { Button, ErrorMessage, FileDrop, Segmented, UI_STRINGS } from "@handyweb/core/ui";
import { ResultCard, SourceCard } from "../shared/cards";
import { strings } from "./i18n";
import { boxBlur, pixelate, regionFrom, type Region } from "./logic";

export type Effect = "blur" | "pixelate";
type Target = "whole" | "area";
type Format = "same" | OutputType;

const FIELD =
    "min-h-11 rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";

/** The shared page of the blur and pixelate tools. */
export function EffectTool({
    locale,
    effect,
    presetTarget,
}: {
    locale: Locale;
    effect: Effect;
    presetTarget?: unknown;
}) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const urls = useRef(new ObjectUrls());
    const frame = useRef<HTMLDivElement>(null);
    const start = useRef<{ x: number; y: number } | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<DecodedImage | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [target, setTarget] = useState<Target>(presetTarget === "area" ? "area" : "whole");
    const [region, setRegion] = useState<Region | null>(null);
    const [strength, setStrength] = useState(effect === "blur" ? 12 : 16);
    const [format, setFormat] = useState<Format>("same");
    const [result, setResult] = useState<{ url: string; blob: Blob; name: string } | null>(null);
    const [error, setError] = useState<ToolError | null>(null);
    const [busy, setBusy] = useState(false);
    const ids = { strength: useId(), format: useId() };

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
        setRegion(null);
        setResult(null);
        setError(null);
    };

    const clearResult = () => {
        if (result) urls.current.revoke(result.url);
        setResult(null);
    };

    const open = async (picked: File) => {
        reset();
        setFile(picked);
        try {
            const decoded = await decodeImage(picked);
            checkCanvasSize(decoded.width, decoded.height);
            // The preview shows the image as decoded, turned by its EXIF orientation.
            const canvas = document.createElement("canvas");
            canvas.width = decoded.width;
            canvas.height = decoded.height;
            canvas.getContext("2d")?.drawImage(decoded.bitmap, 0, 0);
            const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob(resolve, "image/png"),
            );
            canvas.width = canvas.height = 0;
            setImage(decoded);
            setPreview(urls.current.create(blob ?? picked));
        } catch (caught) {
            setError(toToolError(caught));
        }
    };

    const toImage = (event: ReactPointerEvent<HTMLElement>) => {
        const box = frame.current?.getBoundingClientRect();
        if (!box || !image) return { x: 0, y: 0 };
        return {
            x: ((event.clientX - box.left) / box.width) * image.width,
            y: ((event.clientY - box.top) / box.height) * image.height,
        };
    };
    const down = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (target !== "area" || !image) return;
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        start.current = toImage(event);
        clearResult();
    };
    const move = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!start.current || !image) return;
        const point = toImage(event);
        setRegion(
            regionFrom(
                start.current.x,
                start.current.y,
                point.x,
                point.y,
                image.width,
                image.height,
            ),
        );
    };
    const up = () => {
        start.current = null;
    };

    const type: OutputType = image
        ? format === "same"
            ? defaultOutputType(image.format)
            : format
        : "image/png";
    const canApply = image && (target === "whole" || region);

    const apply = async () => {
        if (!image || !file) return;
        setBusy(true);
        setError(null);
        try {
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext("2d", {
                willReadFrequently: true,
            }) as CanvasRenderingContext2D;
            if (type === "image/jpeg") {
                context.fillStyle = "#ffffff";
                context.fillRect(0, 0, image.width, image.height);
            }
            context.drawImage(image.bitmap, 0, 0);
            const area =
                target === "whole" || !region
                    ? { x: 0, y: 0, width: image.width, height: image.height }
                    : region;
            // Let the button show "working" before the pixels are changed.
            await new Promise((resolve) => setTimeout(resolve, 0));
            const pixels = context.getImageData(area.x, area.y, area.width, area.height);
            if (effect === "blur") boxBlur(pixels.data, area.width, area.height, strength);
            else pixelate(pixels.data, area.width, area.height, strength);
            context.putImageData(pixels, area.x, area.y);
            const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob(resolve, type, 0.92),
            );
            canvas.width = canvas.height = 0;
            if (!blob) throw new Error("encode");
            clearResult();
            const base = file.name.replace(/\.[^.]+$/, "") || "image";
            const written = blob.type === type ? type : "image/png";
            setResult({
                url: urls.current.create(blob),
                blob,
                name: safeFileName(
                    `${base}-${effect === "blur" ? "blurred" : "pixelated"}.${EXTENSIONS[written]}`,
                ),
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
                {effect === "blur" && <p className="text-xs text-muted">{t("blurWarning")}</p>}
            </div>
        );
    }

    const percent = (value: number, total: number) => `${(value / total) * 100}%`;

    return (
        <div className="flex flex-col gap-5">
            <SourceCard
                locale={locale}
                name={file.name}
                width={image.width}
                height={image.height}
                bytes={file.size}
                onReset={reset}
            />
            <Segmented<Target>
                legend={t("target")}
                value={target}
                onChange={(next) => {
                    setTarget(next);
                    clearResult();
                }}
                options={[
                    { value: "whole", label: t("whole") },
                    { value: "area", label: t("area") },
                ]}
            />
            {target === "area" && <p className="-mt-2 text-xs text-muted">{t("drawHelp")}</p>}

            {/* Image coordinates run left to right in both languages. */}
            <div
                dir="ltr"
                className="flex justify-center rounded-2xl border border-border bg-surface-2/60 p-3"
            >
                <div
                    ref={frame}
                    onPointerDown={down}
                    onPointerMove={move}
                    onPointerUp={up}
                    onPointerCancel={up}
                    className={`relative touch-none select-none ${target === "area" ? "cursor-crosshair" : ""}`}
                    // Fill the width, at most 28rem high, so a small picture is easy to draw on.
                    style={{
                        width: `min(100%, calc(28rem * ${image.width} / ${image.height}))`,
                        aspectRatio: `${image.width} / ${image.height}`,
                    }}
                    data-effect-frame=""
                >
                    <img
                        src={result?.url ?? preview}
                        alt=""
                        draggable={false}
                        className="block size-full"
                    />
                    {target === "area" && region && !result && (
                        <span
                            aria-hidden="true"
                            className="absolute border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.6)]"
                            style={{
                                insetInlineStart: percent(region.x, image.width),
                                top: percent(region.y, image.height),
                                width: percent(region.width, image.width),
                                height: percent(region.height, image.height),
                            }}
                            data-effect-region=""
                        />
                    )}
                </div>
            </div>

            <div className="flex flex-wrap items-end gap-4">
                <label
                    htmlFor={ids.strength}
                    className="flex min-w-48 flex-1 flex-col gap-1.5 text-xs font-semibold text-muted"
                >
                    <span>
                        {effect === "blur" ? t("blurStrength") : t("blockSize")}:{" "}
                        <span className="tabular-nums">{strength}</span>
                    </span>
                    <input
                        id={ids.strength}
                        type="range"
                        min={effect === "blur" ? 1 : 2}
                        max={effect === "blur" ? 60 : 96}
                        dir="ltr"
                        value={strength}
                        onChange={(event) => {
                            setStrength(Number(event.target.value));
                            clearResult();
                        }}
                        className="min-h-11 accent-primary"
                        data-effect-strength=""
                    />
                </label>
                <label
                    htmlFor={ids.format}
                    className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
                >
                    {t("format")}
                    <select
                        id={ids.format}
                        value={format}
                        onChange={(event) => {
                            setFormat(event.target.value as Format);
                            clearResult();
                        }}
                        className={FIELD}
                    >
                        <option value="same">{t("same")}</option>
                        <option value="image/png">PNG</option>
                        <option value="image/jpeg">JPEG</option>
                        <option value="image/webp">WebP</option>
                    </select>
                </label>
            </div>
            <p className="text-xs text-muted">
                {effect === "blur" ? t("blurWarning") : t("pixelNote")}
            </p>

            <Button
                variant="primary"
                className="w-fit"
                onClick={() => void apply()}
                disabled={!canApply || busy}
                data-tool-run=""
            >
                {busy ? UI_STRINGS.working[locale] : t("apply")}
            </Button>
            {error && <ErrorMessage error={error} locale={locale} />}
            {result && (
                <ResultCard
                    locale={locale}
                    {...result}
                    width={image.width}
                    height={image.height}
                    sourceBytes={file.size}
                />
            )}
            <input type="hidden" value={result ? result.name : ""} readOnly data-tool-output="" />
        </div>
    );
}
