import { useEffect, useMemo, useRef, useState } from "react";
import { decodeImage } from "@handyweb/core/image";
import { toToolError, type ToolError } from "@handyweb/core/runtime";
import {
    CopyButton,
    ErrorMessage,
    FileDrop,
    Ltr,
    Segmented,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { formatColor } from "../../developer/color-converter/logic";
import type { Pixels } from "../image-color-picker/logic";
import { SourceCard } from "../shared/cards";
import { strings } from "./i18n";
import { exportPalette, extractPalette, sampleSize, type ExportFormat } from "./logic";

type Count = "5" | "8" | "12";

export default function ImagePalette({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const canvas = useRef<HTMLCanvasElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [source, setSource] = useState<{
        bitmap: ImageBitmap;
        width: number;
        height: number;
    } | null>(null);
    const [pixels, setPixels] = useState<Pixels | null>(null);
    const [count, setCount] = useState<Count>("8");
    const [format, setFormat] = useState<ExportFormat>("css");
    const [error, setError] = useState<ToolError | null>(null);

    // Draw a small copy after the canvas is in the page, and read its pixels once.
    useEffect(() => {
        const element = canvas.current;
        const context = element?.getContext("2d", { willReadFrequently: true });
        if (!source || !element || !context) return;
        const size = sampleSize(source.width, source.height);
        element.width = size.width;
        element.height = size.height;
        context.drawImage(source.bitmap, 0, 0, size.width, size.height);
        source.bitmap.close();
        const data = context.getImageData(0, 0, size.width, size.height);
        setPixels({ data: data.data, width: size.width, height: size.height });
    }, [source]);

    const reset = () => {
        setFile(null);
        setSource(null);
        setPixels(null);
        setError(null);
    };

    const open = async (picked: File) => {
        reset();
        setFile(picked);
        try {
            const image = await decodeImage(picked);
            setSource({ bitmap: image.bitmap, width: image.width, height: image.height });
        } catch (caught) {
            setError(toToolError(caught));
        }
    };

    const palette = useMemo(
        () => (pixels ? extractPalette(pixels, Number(count)) : []),
        [pixels, count],
    );
    const hexes = palette.map((swatch) => formatColor(swatch.color).hex);
    const exported = exportPalette(hexes, format);

    return (
        <div className="flex flex-col gap-5">
            {!file ? (
                <FileDrop
                    locale={locale}
                    accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
                    onFile={(picked) => void open(picked)}
                />
            ) : (
                source && (
                    <SourceCard
                        locale={locale}
                        name={file.name}
                        width={source.width}
                        height={source.height}
                        bytes={file.size}
                        onReset={reset}
                    />
                )
            )}
            {error && <ErrorMessage error={error} locale={locale} />}

            {source && (
                <div className="flex justify-center rounded-2xl border border-border bg-surface-2/60 p-3">
                    <canvas
                        ref={canvas}
                        aria-hidden="true"
                        className="rounded-lg [image-rendering:auto]"
                        style={{
                            aspectRatio: `${source.width} / ${source.height}`,
                            width: `min(100%, calc(16rem * ${source.width} / ${source.height}))`,
                        }}
                    />
                </div>
            )}

            {palette.length > 0 && (
                <>
                    <Segmented<Count>
                        legend={t("count")}
                        value={count}
                        onChange={setCount}
                        options={[
                            { value: "5", label: "5" },
                            { value: "8", label: "8" },
                            { value: "12", label: "12" },
                        ]}
                    />
                    <section className="flex flex-col gap-2">
                        <h2 className="text-xs font-semibold text-muted">{t("palette")}</h2>
                        <div
                            className="flex h-12 overflow-hidden rounded-xl border border-border"
                            aria-hidden="true"
                        >
                            {palette.map((swatch, index) => (
                                <span
                                    key={index}
                                    style={{
                                        backgroundColor: hexes[index],
                                        flexGrow: swatch.share,
                                    }}
                                />
                            ))}
                        </div>
                        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2" data-tool-palette="">
                            {palette.map((swatch, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-3 rounded-xl border border-border bg-bg p-2"
                                >
                                    <span
                                        className="size-10 shrink-0 rounded-lg border border-border"
                                        style={{ backgroundColor: hexes[index] }}
                                    />
                                    <Ltr as="code" className="flex-1 font-mono text-sm">
                                        {hexes[index]}
                                    </Ltr>
                                    <span className="text-xs text-muted tabular-nums">
                                        {Math.round(swatch.share * 100)}%
                                    </span>
                                    <CopyButton
                                        text={hexes[index] as string}
                                        locale={locale}
                                        compact
                                    />
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section className="overflow-hidden rounded-2xl border border-border bg-bg">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 px-3 py-2">
                            <Segmented<ExportFormat>
                                legend={t("export")}
                                value={format}
                                onChange={setFormat}
                                options={[
                                    { value: "css", label: t("css") },
                                    { value: "hex", label: t("hex") },
                                    { value: "json", label: t("json") },
                                ]}
                            />
                            <CopyButton text={exported} locale={locale} compact />
                        </div>
                        <pre dir="ltr" className="overflow-x-auto px-4 py-3 font-mono text-xs">
                            {exported}
                        </pre>
                    </section>
                    <p className="text-xs text-muted">{t("note")}</p>
                </>
            )}
            <input type="hidden" value={hexes.join(",")} readOnly data-tool-output="" />
        </div>
    );
}
