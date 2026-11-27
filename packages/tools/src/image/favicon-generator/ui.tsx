import { useEffect, useId, useRef, useState } from "react";
import { downloadBlob, makeZip, ObjectUrls } from "@handyweb/core/files";
import { decodeImage, type DecodedImage } from "@handyweb/core/image";
import { toToolError, type ToolError } from "@handyweb/core/runtime";
import {
    Button,
    CopyButton,
    ErrorMessage,
    FileDrop,
    Ltr,
    Segmented,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { SourceCard } from "../shared/cards";
import { strings } from "./i18n";
import { fitBox, HTML_SNIPPET, makeIco, manifest } from "./logic";

type Shape = "transparent" | "square" | "rounded" | "circle";

const FIELD =
    "min-h-11 rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";

async function renderIcon(
    bitmap: ImageBitmap,
    size: number,
    shape: Shape,
    color: string,
    padding: number,
    opaque: boolean,
): Promise<Uint8Array> {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    context.imageSmoothingQuality = "high";
    const fill = shape === "transparent" ? (opaque ? "#ffffff" : null) : color;
    if (fill) {
        context.fillStyle = fill;
        context.beginPath();
        // The Apple icon is always a full square; iOS rounds the corners itself.
        if (shape === "circle" && !opaque)
            context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        else if (shape === "rounded" && !opaque) context.roundRect(0, 0, size, size, size * 0.2);
        else context.rect(0, 0, size, size);
        context.fill();
    }
    const box = fitBox(size, bitmap.width, bitmap.height, padding);
    context.drawImage(bitmap, box.x, box.y, box.width, box.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    canvas.width = canvas.height = 0;
    if (!blob) throw new Error("encode");
    return new Uint8Array(await blob.arrayBuffer());
}

export default function FaviconGenerator({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const urls = useRef(new ObjectUrls());
    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<DecodedImage | null>(null);
    const [name, setName] = useState("My Site");
    const [padding, setPadding] = useState(8);
    const [shape, setShape] = useState<Shape>("transparent");
    const [color, setColor] = useState("#bc4a3c");
    const [result, setResult] = useState<{
        zip: Uint8Array;
        previews: Array<{ name: string; size: number; url: string }>;
    } | null>(null);
    const [error, setError] = useState<ToolError | null>(null);
    const [busy, setBusy] = useState(false);
    const ids = { name: useId(), padding: useId(), color: useId() };

    useEffect(() => {
        const store = urls.current;
        return () => store.revokeAll();
    }, []);
    useEffect(() => () => image?.bitmap.close(), [image]);

    const clear = () => {
        urls.current.revokeAll();
        setResult(null);
    };
    const reset = () => {
        clear();
        setFile(null);
        setImage(null);
        setError(null);
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

    const make = async () => {
        if (!image) return;
        setBusy(true);
        setError(null);
        try {
            clear();
            const render = (size: number, opaque = false) =>
                renderIcon(image.bitmap, size, shape, color, padding, opaque);
            const [p16, p32, p48, p180, p192, p512] = await Promise.all([
                render(16),
                render(32),
                render(48),
                render(180, true),
                render(192),
                render(512),
            ]);
            const files = [
                {
                    name: "favicon.ico",
                    data: makeIco([
                        { size: 16, png: p16 },
                        { size: 32, png: p32 },
                        { size: 48, png: p48 },
                    ]),
                },
                { name: "apple-touch-icon.png", data: p180 },
                { name: "icon-192.png", data: p192 },
                { name: "icon-512.png", data: p512 },
                {
                    name: "site.webmanifest",
                    data: new TextEncoder().encode(
                        manifest({
                            name,
                            themeColor: shape === "transparent" ? "#ffffff" : color,
                            backgroundColor: "#ffffff",
                        }),
                    ),
                },
            ];
            const preview = (fileName: string, size: number, data: Uint8Array) => ({
                name: fileName,
                size,
                url: urls.current.create(
                    new Blob([data as Uint8Array<ArrayBuffer>], { type: "image/png" }),
                ),
            });
            setResult({
                zip: makeZip(files),
                previews: [
                    preview("16", 16, p16),
                    preview("32", 32, p32),
                    preview("48", 48, p48),
                    preview("apple-touch-icon.png", 180, p180),
                    preview("icon-192.png", 192, p192),
                    preview("icon-512.png", 512, p512),
                ],
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
            {Math.min(image.width, image.height) < 512 && (
                <p className="-mt-2 text-xs text-muted">{t("small")}</p>
            )}
            <Segmented<Shape>
                legend={t("background")}
                value={shape}
                onChange={(next) => {
                    setShape(next);
                    clear();
                }}
                options={[
                    { value: "transparent", label: t("transparent") },
                    { value: "square", label: t("square") },
                    { value: "rounded", label: t("rounded") },
                    { value: "circle", label: t("circle") },
                ]}
            />
            <div className="flex flex-wrap items-end gap-4">
                {shape !== "transparent" && (
                    <label
                        htmlFor={ids.color}
                        className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
                    >
                        {t("color")}
                        <input
                            id={ids.color}
                            type="color"
                            value={color}
                            onChange={(event) => {
                                setColor(event.target.value);
                                clear();
                            }}
                            className="h-11 w-14 rounded-lg border border-border"
                        />
                    </label>
                )}
                <label
                    htmlFor={ids.padding}
                    className="flex min-w-40 flex-1 flex-col gap-1.5 text-xs font-semibold text-muted"
                >
                    <span>
                        {t("padding")}: <span className="tabular-nums">{padding}</span>
                    </span>
                    <input
                        id={ids.padding}
                        type="range"
                        min={0}
                        max={30}
                        dir="ltr"
                        value={padding}
                        onChange={(event) => {
                            setPadding(Number(event.target.value));
                            clear();
                        }}
                        className="min-h-11 accent-primary"
                    />
                </label>
                <label
                    htmlFor={ids.name}
                    className="flex min-w-48 flex-1 flex-col gap-1.5 text-xs font-semibold text-muted"
                >
                    {t("name")}
                    <input
                        id={ids.name}
                        dir="auto"
                        value={name}
                        onChange={(event) => {
                            setName(event.target.value);
                            clear();
                        }}
                        className={FIELD}
                    />
                </label>
            </div>
            <p className="text-xs text-muted">{t("appleNote")}</p>
            <Button
                variant="primary"
                className="w-fit"
                onClick={() => void make()}
                disabled={busy}
                data-tool-run=""
            >
                {busy ? UI_STRINGS.working[locale] : t("make")}
            </Button>
            {error && <ErrorMessage error={error} locale={locale} />}

            {result && (
                <section className="flex flex-col gap-4 rounded-2xl border border-border bg-bg p-4">
                    <ul className="flex flex-wrap items-end gap-4" data-favicon-previews="">
                        {result.previews.map((preview) => (
                            <li
                                key={preview.name}
                                className="flex flex-col items-center gap-1 text-xs text-muted"
                            >
                                <img
                                    src={preview.url}
                                    alt=""
                                    width={Math.min(preview.size, 96)}
                                    height={Math.min(preview.size, 96)}
                                    className="rounded border border-border/60 bg-[repeating-conic-gradient(#ddd_0_25%,#fff_0_50%)] [background-size:12px_12px]"
                                />
                                <Ltr>{`${preview.size}px`}</Ltr>
                            </li>
                        ))}
                    </ul>
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between gap-2">
                            <h2 className="text-xs font-semibold text-muted">{t("html")}</h2>
                            <CopyButton text={HTML_SNIPPET} locale={locale} compact />
                        </div>
                        <pre
                            dir="ltr"
                            className="overflow-x-auto rounded-xl bg-surface-2/60 px-3 py-2 font-mono text-xs"
                        >
                            {HTML_SNIPPET}
                        </pre>
                    </div>
                    <p className="text-xs text-muted">
                        {t("files")}:{" "}
                        <Ltr>
                            favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png,
                            site.webmanifest
                        </Ltr>
                    </p>
                    <Button
                        variant="primary"
                        className="w-fit"
                        onClick={() =>
                            downloadBlob(
                                new Blob([result.zip as Uint8Array<ArrayBuffer>], {
                                    type: "application/zip",
                                }),
                                "favicon.zip",
                            )
                        }
                    >
                        {t("download")}
                    </Button>
                </section>
            )}
            <input
                type="hidden"
                value={result ? String(result.zip.length) : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
