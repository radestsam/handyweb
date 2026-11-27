import { useEffect, useId, useRef, useState } from "react";
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
import {
    Button,
    ErrorMessage,
    FileDrop,
    Segmented,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { ResultCard, SourceCard } from "../shared/cards";
import { POSITION_LABELS, strings } from "./i18n";
import { isRtl, place, POSITIONS, tile, type Position } from "./logic";

type Kind = "text" | "logo";
type Layout = "single" | "tiled";
type Format = "same" | OutputType;

interface Settings {
    kind: Kind;
    text: string;
    logo: ImageBitmap | null;
    size: number;
    color: string;
    opacity: number;
    layout: Layout;
    position: Position;
    angle: number;
}

const FIELD =
    "min-h-11 rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";
const PREVIEW_SIDE = 1200;

/** Draws the image and the watermark on a context of the given size. */
function draw(
    context: CanvasRenderingContext2D,
    image: ImageBitmap,
    width: number,
    height: number,
    settings: Settings,
    fontFamily: string,
): void {
    context.drawImage(image, 0, 0, width, height);
    const markWidth = (width * settings.size) / 100;
    let markHeight: number;
    let paint: (x: number, y: number) => void;
    if (settings.kind === "logo") {
        if (!settings.logo) return;
        markHeight = (markWidth * settings.logo.height) / settings.logo.width;
        const logo = settings.logo;
        paint = (x, y) =>
            context.drawImage(logo, x - markWidth / 2, y - markHeight / 2, markWidth, markHeight);
    } else {
        const text = settings.text.trim();
        if (!text) return;
        // Fit the font so the text is markWidth wide.
        context.font = `600 100px ${fontFamily}`;
        const measured = context.measureText(text).width || 1;
        const fontSize = (100 * markWidth) / measured;
        context.font = `600 ${fontSize}px ${fontFamily}`;
        context.direction = isRtl(text) ? "rtl" : "ltr";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = settings.color;
        markHeight = fontSize * 1.2;
        paint = (x, y) => context.fillText(text, x, y);
    }
    context.globalAlpha = settings.opacity / 100;
    const radians = (settings.angle * Math.PI) / 180;
    const at = (x: number, y: number) => {
        context.save();
        context.translate(x, y);
        context.rotate(radians);
        paint(0, 0);
        context.restore();
    };
    if (settings.layout === "tiled") {
        for (const point of tile(width, height, markWidth * 1.6, markHeight * 3))
            at(point.x, point.y);
    } else {
        const margin = Math.round(Math.min(width, height) * 0.03);
        const corner = place(width, height, markWidth, markHeight, settings.position, margin);
        at(corner.x + markWidth / 2, corner.y + markHeight / 2);
    }
    context.globalAlpha = 1;
}

export default function ImageWatermark({ locale, presetOptions }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const urls = useRef(new ObjectUrls());
    const previewCanvas = useRef<HTMLCanvasElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<DecodedImage | null>(null);
    const [settings, setSettings] = useState<Settings>({
        kind: "text",
        text: "© HandyWeb",
        logo: null,
        size: 30,
        color: "#ffffff",
        opacity: 50,
        layout: presetOptions?.["layout"] === "tiled" ? "tiled" : "single",
        position: "bottom-right",
        angle: 0,
    });
    const [format, setFormat] = useState<Format>("same");
    const [fontFamily, setFontFamily] = useState("sans-serif");
    const [result, setResult] = useState<{ url: string; blob: Blob; name: string } | null>(null);
    const [error, setError] = useState<ToolError | null>(null);
    const [busy, setBusy] = useState(false);
    const ids = {
        text: useId(),
        size: useId(),
        color: useId(),
        opacity: useId(),
        position: useId(),
        angle: useId(),
        format: useId(),
    };

    useEffect(() => {
        const store = urls.current;
        return () => store.revokeAll();
    }, []);
    useEffect(() => () => image?.bitmap.close(), [image]);

    // Load the page font for the text, so the canvas uses it (Persian needs it).
    useEffect(() => {
        const family = getComputedStyle(document.body).fontFamily || "sans-serif";
        void document.fonts
            .load(`600 40px ${family}`, settings.text || "a")
            .then(() => setFontFamily(family));
    }, [settings.text]);

    // Draw the preview at a small size on every change.
    useEffect(() => {
        const canvas = previewCanvas.current;
        const context = canvas?.getContext("2d");
        if (!image || !canvas || !context) return;
        const scale = Math.min(1, PREVIEW_SIDE / Math.max(image.width, image.height));
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        draw(context, image.bitmap, canvas.width, canvas.height, settings, fontFamily);
    }, [image, settings, fontFamily]);

    const update = (next: Partial<Settings>) => {
        setSettings((current) => ({ ...current, ...next }));
        if (result) urls.current.revoke(result.url);
        setResult(null);
    };

    const reset = () => {
        urls.current.revokeAll();
        setFile(null);
        setImage(null);
        setResult(null);
        setError(null);
    };

    const open = async (picked: File) => {
        reset();
        setFile(picked);
        try {
            const decoded = await decodeImage(picked);
            checkCanvasSize(decoded.width, decoded.height);
            setImage(decoded);
        } catch (caught) {
            setError(toToolError(caught));
        }
    };

    const openLogo = async (picked: File) => {
        setError(null);
        try {
            const logo = await decodeImage(picked);
            settings.logo?.close();
            update({ logo: logo.bitmap, kind: "logo" });
        } catch (caught) {
            setError(toToolError(caught));
        }
    };

    const type: OutputType = image
        ? format === "same"
            ? defaultOutputType(image.format)
            : format
        : "image/png";

    const make = async () => {
        if (!image || !file) return;
        setBusy(true);
        setError(null);
        try {
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext("2d") as CanvasRenderingContext2D;
            if (type === "image/jpeg") {
                context.fillStyle = "#ffffff";
                context.fillRect(0, 0, image.width, image.height);
            }
            draw(context, image.bitmap, image.width, image.height, settings, fontFamily);
            const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob(resolve, type, 0.92),
            );
            canvas.width = canvas.height = 0;
            if (!blob) throw new Error("encode");
            const written = blob.type === type ? type : "image/png";
            const base = file.name.replace(/\.[^.]+$/, "") || "image";
            setResult({
                url: urls.current.create(blob),
                blob,
                name: safeFileName(`${base}-watermark.${EXTENSIONS[written]}`),
            });
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
            </div>
        );
    }

    const range = (key: "size" | "opacity" | "angle", label: string, min: number, max: number) => (
        <label
            htmlFor={ids[key]}
            className="flex min-w-40 flex-1 flex-col gap-1.5 text-xs font-semibold text-muted"
        >
            <span>
                {label}: <span className="tabular-nums">{settings[key]}</span>
            </span>
            <input
                id={ids[key]}
                type="range"
                min={min}
                max={max}
                dir="ltr"
                value={settings[key]}
                onChange={(event) => update({ [key]: Number(event.target.value) })}
                className="min-h-11 accent-primary"
                data-watermark-field={key}
            />
        </label>
    );

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
            <Segmented<Kind>
                legend={t("kind")}
                value={settings.kind}
                onChange={(kind) => update({ kind })}
                options={[
                    { value: "text", label: t("text") },
                    { value: "logo", label: t("logo") },
                ]}
            />
            {settings.kind === "text" ? (
                <div className="flex flex-wrap items-end gap-4">
                    <label
                        htmlFor={ids.text}
                        className="flex min-w-56 flex-1 flex-col gap-1.5 text-xs font-semibold text-muted"
                    >
                        {t("textLabel")}
                        <input
                            id={ids.text}
                            dir="auto"
                            value={settings.text}
                            onChange={(event) => update({ text: event.target.value })}
                            className={FIELD}
                            data-watermark-text=""
                        />
                    </label>
                    <label
                        htmlFor={ids.color}
                        className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
                    >
                        {t("color")}
                        <input
                            id={ids.color}
                            type="color"
                            value={settings.color}
                            onChange={(event) => update({ color: event.target.value })}
                            className="h-11 w-14 rounded-lg border border-border"
                        />
                    </label>
                </div>
            ) : (
                <FileDrop
                    locale={locale}
                    accept="image/png,image/webp,image/jpeg"
                    onFile={(picked) => void openLogo(picked)}
                    hint={t("chooseLogo")}
                />
            )}

            <Segmented<Layout>
                legend={t("layout")}
                value={settings.layout}
                onChange={(layout) =>
                    update({
                        layout,
                        angle: layout === "tiled" && settings.angle === 0 ? -30 : settings.angle,
                    })
                }
                options={[
                    { value: "single", label: t("single") },
                    { value: "tiled", label: t("tiled") },
                ]}
            />
            <div className="flex flex-wrap items-end gap-4">
                {settings.layout === "single" && (
                    <label
                        htmlFor={ids.position}
                        className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
                    >
                        {t("position")}
                        <select
                            id={ids.position}
                            value={settings.position}
                            onChange={(event) =>
                                update({ position: event.target.value as Position })
                            }
                            className={FIELD}
                        >
                            {POSITIONS.map((position) => (
                                <option key={position} value={position}>
                                    {POSITION_LABELS[position][locale]}
                                </option>
                            ))}
                        </select>
                    </label>
                )}
                {range("size", t("size"), 5, 90)}
                {range("opacity", t("opacity"), 5, 100)}
                {range("angle", t("angle"), -90, 90)}
            </div>
            <p className="text-xs text-muted">{t("tip")}</p>

            {/* Image coordinates run left to right in both languages. */}
            <div
                dir="ltr"
                className="flex justify-center rounded-2xl border border-border bg-surface-2/60 p-3"
            >
                <canvas
                    ref={previewCanvas}
                    role="img"
                    aria-label={t("preview")}
                    className="rounded-lg"
                    style={{
                        width: `min(100%, calc(28rem * ${image.width} / ${image.height}))`,
                        aspectRatio: `${image.width} / ${image.height}`,
                    }}
                    data-watermark-preview=""
                />
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
                        onChange={(event) => {
                            setFormat(event.target.value as Format);
                            setResult(null);
                        }}
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
                    onClick={() => void make()}
                    disabled={busy || (settings.kind === "logo" && !settings.logo)}
                    data-tool-run=""
                >
                    {busy ? UI_STRINGS.working[locale] : t("make")}
                </Button>
            </div>
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
