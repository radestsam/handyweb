import { useEffect, useId, useMemo, useRef, useState } from "react";
import { decodeImage, type DecodedImage } from "@handyweb/core/image";
import { toToolError, type ToolError } from "@handyweb/core/runtime";
import {
    Button,
    ErrorMessage,
    FileDrop,
    Ltr,
    Segmented,
    type ToolUiProps,
} from "@handyweb/core/ui";
import type { Pixels } from "../image-color-picker/logic";
import { strings } from "./i18n";
import { compareSize, diffPixels } from "./logic";

type Mode = "slider" | "opacity" | "difference";

interface Loaded {
    image: DecodedImage;
    name: string;
}

/** Draws a bitmap at a size and returns the canvas as an object URL and its pixels. */
async function render(
    bitmap: ImageBitmap,
    width: number,
    height: number,
): Promise<{ url: string; pixels: Pixels }> {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", {
        willReadFrequently: true,
    }) as CanvasRenderingContext2D;
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, 0, 0, width, height);
    const data = context.getImageData(0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    canvas.width = canvas.height = 0;
    return {
        url: blob ? URL.createObjectURL(blob) : "",
        pixels: { data: data.data, width, height },
    };
}

export default function ImageCompare({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const [first, setFirst] = useState<Loaded | null>(null);
    const [second, setSecond] = useState<Loaded | null>(null);
    const [views, setViews] = useState<{
        a: string;
        b: string;
        pa: Pixels;
        pb: Pixels;
        width: number;
        height: number;
    } | null>(null);
    const [mode, setMode] = useState<Mode>("slider");
    const [position, setPosition] = useState(50);
    const [blend, setBlend] = useState(50);
    const [threshold, setThreshold] = useState(8);
    const [error, setError] = useState<ToolError | null>(null);
    const maskCanvas = useRef<HTMLCanvasElement>(null);
    const ids = { position: useId(), blend: useId(), threshold: useId() };

    const load = async (file: File, set: (value: Loaded) => void) => {
        setError(null);
        try {
            set({ image: await decodeImage(file), name: file.name });
        } catch (caught) {
            setError(toToolError(caught));
        }
    };

    // When both images are open, draw them at one common size.
    useEffect(() => {
        if (!first || !second) return;
        let current = true;
        const size = compareSize(first.image.width, first.image.height);
        void Promise.all([
            render(first.image.bitmap, size.width, size.height),
            render(second.image.bitmap, size.width, size.height),
        ]).then(([a, b]) => {
            if (!current) {
                URL.revokeObjectURL(a.url);
                URL.revokeObjectURL(b.url);
                return;
            }
            setViews({ a: a.url, b: b.url, pa: a.pixels, pb: b.pixels, ...size });
        });
        return () => {
            current = false;
        };
    }, [first, second]);

    useEffect(
        () => () => {
            if (views) {
                URL.revokeObjectURL(views.a);
                URL.revokeObjectURL(views.b);
            }
        },
        [views],
    );

    const diff = useMemo(
        () => (views && mode === "difference" ? diffPixels(views.pa, views.pb, threshold) : null),
        [views, mode, threshold],
    );

    useEffect(() => {
        const element = maskCanvas.current;
        if (!diff || !views || !element) return;
        element.width = views.width;
        element.height = views.height;
        element
            .getContext("2d")
            ?.putImageData(
                new ImageData(new Uint8ClampedArray(diff.mask), views.width, views.height),
                0,
                0,
            );
    }, [diff, views]);

    const reset = () => {
        first?.image.bitmap.close();
        second?.image.bitmap.close();
        setFirst(null);
        setSecond(null);
        setViews(null);
        setError(null);
    };

    const resized =
        first &&
        second &&
        (first.image.width !== second.image.width || first.image.height !== second.image.height);
    const percent = diff ? (diff.changed / diff.total) * 100 : 0;
    const frame = views
        ? {
              aspectRatio: `${views.width} / ${views.height}`,
              width: `min(100%, calc(32rem * ${views.width} / ${views.height}))`,
          }
        : {};

    return (
        <div className="flex flex-col gap-5">
            {!views ? (
                <div className="grid gap-3 md:grid-cols-2">
                    {(
                        [
                            [first, setFirst, "first"],
                            [second, setSecond, "second"],
                        ] as const
                    ).map(([value, set, key]) => (
                        <div
                            key={key}
                            className="flex min-w-0 flex-col gap-2"
                            data-compare-slot={key}
                        >
                            <h2 className="text-xs font-semibold text-muted">{t(key)}</h2>
                            {value ? (
                                <div className="rounded-2xl border border-border bg-surface-2/60 p-3 text-sm">
                                    <Ltr className="block truncate font-semibold">{value.name}</Ltr>
                                    <span className="text-xs text-muted tabular-nums">
                                        <Ltr>{`${value.image.width} × ${value.image.height}`}</Ltr>
                                    </span>
                                </div>
                            ) : (
                                <FileDrop
                                    locale={locale}
                                    accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
                                    onFile={(file) => void load(file, set)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <Button className="w-fit" onClick={reset}>
                    {t("another")}
                </Button>
            )}
            {error && <ErrorMessage error={error} locale={locale} />}
            {resized && <p className="text-xs text-muted">{t("resized")}</p>}

            {views && (
                <>
                    <Segmented<Mode>
                        legend={t("mode")}
                        value={mode}
                        onChange={setMode}
                        options={[
                            { value: "slider", label: t("slider") },
                            { value: "opacity", label: t("opacity") },
                            { value: "difference", label: t("difference") },
                        ]}
                    />
                    {/* Image coordinates run left to right in both languages. */}
                    <div
                        dir="ltr"
                        className="flex justify-center rounded-2xl border border-border bg-surface-2/60 p-3"
                    >
                        {mode === "difference" ? (
                            <canvas
                                ref={maskCanvas}
                                className="rounded-lg"
                                style={frame}
                                aria-label={t("difference")}
                                role="img"
                            />
                        ) : (
                            <div className="relative overflow-hidden rounded-lg" style={frame}>
                                <img
                                    src={views.a}
                                    alt={t("first")}
                                    className="absolute inset-0 size-full"
                                    draggable={false}
                                />
                                <img
                                    src={views.b}
                                    alt={t("second")}
                                    className="absolute inset-0 size-full"
                                    draggable={false}
                                    style={
                                        mode === "slider"
                                            ? { clipPath: `inset(0 0 0 ${position}%)` }
                                            : { opacity: blend / 100 }
                                    }
                                />
                                {mode === "slider" && (
                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-y-0 w-0.5 bg-white shadow"
                                        style={{ insetInlineStart: `${position}%` }}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                    {mode === "slider" && (
                        <label
                            htmlFor={ids.position}
                            className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
                        >
                            {t("position")}
                            <input
                                id={ids.position}
                                type="range"
                                min={0}
                                max={100}
                                dir="ltr"
                                value={position}
                                onChange={(event) => setPosition(Number(event.target.value))}
                                className="min-h-11 accent-primary"
                            />
                        </label>
                    )}
                    {mode === "opacity" && (
                        <label
                            htmlFor={ids.blend}
                            className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
                        >
                            {t("blend")}: {blend}%
                            <input
                                id={ids.blend}
                                type="range"
                                min={0}
                                max={100}
                                dir="ltr"
                                value={blend}
                                onChange={(event) => setBlend(Number(event.target.value))}
                                className="min-h-11 accent-primary"
                            />
                        </label>
                    )}
                    {mode === "difference" && diff && (
                        <>
                            <label
                                htmlFor={ids.threshold}
                                className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
                            >
                                {t("threshold")}: {threshold}
                                <input
                                    id={ids.threshold}
                                    type="range"
                                    min={0}
                                    max={64}
                                    dir="ltr"
                                    value={threshold}
                                    onChange={(event) => setThreshold(Number(event.target.value))}
                                    className="min-h-11 accent-primary"
                                />
                            </label>
                            <p className="text-sm tabular-nums" role="status" data-tool-diff="">
                                {diff.changed === 0
                                    ? t("same")
                                    : `${diff.changed.toLocaleString(locale === "fa" ? "fa-IR" : "en")} ${t("changed")} (${percent.toFixed(2)}%)`}
                            </p>
                        </>
                    )}
                </>
            )}
            <input
                type="hidden"
                value={diff ? String(diff.changed) : views ? "ready" : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
