import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { formatBytes } from "@handyweb/core/files";
import { checkCanvasSize, decodeImage, MAX_CANVAS_PIXELS } from "@handyweb/core/image";
import { toToolError, type ToolError } from "@handyweb/core/runtime";
import {
    Button,
    CopyButton,
    ErrorMessage,
    FileDrop,
    Ltr,
    Segmented,
    type ToolUiProps,
    useClient,
} from "@handyweb/core/ui";
import { formatColor, type Rgba } from "../../developer/color-converter/logic";
import { strings } from "./i18n";
import { averageAt, pixelAt, type Pixels } from "./logic";

type Sample = "0" | "1" | "2";

interface EyeDropperLike {
    open: () => Promise<{ sRGBHex: string }>;
}

export default function ImageColorPicker({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const canvas = useRef<HTMLCanvasElement>(null);
    const pixels = useRef<Pixels | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [size, setSize] = useState<{ width: number; height: number; scaled: boolean } | null>(
        null,
    );
    const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
    const [sample, setSample] = useState<Sample>("0");
    const [color, setColor] = useState<Rgba | null>(null);
    const [history, setHistory] = useState<string[]>([]);
    const [error, setError] = useState<ToolError | null>(null);
    const [ready, setReady] = useState(false);
    const [source, setSource] = useState<ImageBitmap | null>(null);

    // Draw after the canvas is in the page, then read the pixels once.
    useEffect(() => {
        const element = canvas.current;
        const context = element?.getContext("2d", { willReadFrequently: true });
        if (!source || !size || !element || !context) return;
        element.width = size.width;
        element.height = size.height;
        context.drawImage(source, 0, 0, size.width, size.height);
        source.close();
        const data = context.getImageData(0, 0, size.width, size.height);
        pixels.current = { data: data.data, width: size.width, height: size.height };
        setReady(true);
    }, [source, size]);
    const client = useClient();
    const hasEyeDropper = client && "EyeDropper" in window;

    const reset = () => {
        pixels.current = null;
        setReady(false);
        setSource(null);
        setFile(null);
        setSize(null);
        setPoint(null);
        setColor(null);
        setError(null);
    };

    const open = async (picked: File) => {
        reset();
        setFile(picked);
        try {
            const image = await decodeImage(picked);
            // A very large source is read at a size that every browser can draw.
            const scale = Math.min(1, Math.sqrt(MAX_CANVAS_PIXELS / (image.width * image.height)));
            const width = Math.max(1, Math.floor(image.width * scale));
            const height = Math.max(1, Math.floor(image.height * scale));
            checkCanvasSize(width, height);
            setSize({ width, height, scaled: scale < 1 });
            setSource(image.bitmap);
        } catch (caught) {
            setError(toToolError(caught));
        }
    };

    const pick = (x: number, y: number, radius = Number(sample)) => {
        if (!pixels.current) return;
        setPoint({ x, y });
        const value = averageAt(pixels.current, x, y, radius);
        setColor(value);
    };

    // The history keeps the last 8 colors in memory only.
    const remember = (hex: string) =>
        setHistory((list) => [hex, ...list.filter((item) => item !== hex)].slice(0, 8));

    const onClick = (event: MouseEvent<HTMLCanvasElement>) => {
        if (!size) return;
        const box = event.currentTarget.getBoundingClientRect();
        const { x, y } = pixelAt(
            event.clientX - box.left,
            event.clientY - box.top,
            box.width,
            box.height,
            size.width,
            size.height,
        );
        pick(x, y);
        if (pixels.current)
            remember(formatColor(averageAt(pixels.current, x, y, Number(sample))).hex);
    };

    const onKey = (event: KeyboardEvent<HTMLCanvasElement>) => {
        if (!size) return;
        const moves: Record<string, [number, number]> = {
            ArrowLeft: [-1, 0],
            ArrowRight: [1, 0],
            ArrowUp: [0, -1],
            ArrowDown: [0, 1],
        };
        const move = moves[event.key];
        if (move) {
            event.preventDefault();
            const step = event.shiftKey ? 10 : 1;
            const from = point ?? { x: Math.floor(size.width / 2), y: Math.floor(size.height / 2) };
            pick(
                Math.min(size.width - 1, Math.max(0, from.x + move[0] * step)),
                Math.min(size.height - 1, Math.max(0, from.y + move[1] * step)),
            );
        } else if (event.key === "Enter" && color) remember(formatColor(color).hex);
    };

    useEffect(() => {
        if (point) pick(point.x, point.y);
        // Only a new sample size reads the color again.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sample]);

    const fromScreen = async () => {
        try {
            const dropper = new (
                window as unknown as { EyeDropper: new () => EyeDropperLike }
            ).EyeDropper();
            const { sRGBHex } = await dropper.open();
            const hex = sRGBHex.startsWith("#") ? sRGBHex : formatColor(parseRgb(sRGBHex)).hex;
            const value = parseInt(hex.slice(1, 7), 16);
            setColor({ r: value >> 16, g: (value >> 8) & 255, b: value & 255, a: 1 });
            remember(hex.slice(0, 7));
        } catch {
            // The user closed the picker.
        }
    };

    const formats = color ? formatColor(color) : null;

    return (
        <div className="flex flex-col gap-5">
            {hasEyeDropper && (
                <Button className="w-fit" onClick={() => void fromScreen()}>
                    {t("screen")}
                </Button>
            )}
            {!file ? (
                <FileDrop
                    locale={locale}
                    accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
                    onFile={(picked) => void open(picked)}
                />
            ) : (
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2/60 p-3">
                    <div className="min-w-0 flex-1 text-sm">
                        <Ltr className="block truncate font-semibold">{file.name}</Ltr>
                        <span className="text-xs text-muted tabular-nums">
                            {size && <Ltr>{`${size.width} × ${size.height}`}</Ltr>} ·{" "}
                            {formatBytes(file.size, locale)}
                        </span>
                    </div>
                    <Button onClick={reset}>{t("another")}</Button>
                </div>
            )}
            {error && <ErrorMessage error={error} locale={locale} />}

            {size && (
                <>
                    <Segmented<Sample>
                        legend={t("sample")}
                        value={sample}
                        onChange={setSample}
                        options={[
                            { value: "0", label: t("one") },
                            { value: "1", label: t("three") },
                            { value: "2", label: t("five") },
                        ]}
                    />
                    {size.scaled && <p className="text-xs text-muted">{t("large")}</p>}
                    <div className="flex justify-center rounded-2xl border border-border bg-surface-2/60 p-3">
                        <canvas
                            ref={canvas}
                            tabIndex={0}
                            role="img"
                            aria-label={t("image")}
                            onClick={onClick}
                            onKeyDown={onKey}
                            className="cursor-crosshair rounded-lg outline-none [image-rendering:pixelated] focus-visible:outline-2 focus-visible:outline-focus"
                            // Fill the width, but stay at most 28rem high, and keep the shape.
                            style={{
                                aspectRatio: `${size.width} / ${size.height}`,
                                width: `min(100%, calc(28rem * ${size.width} / ${size.height}))`,
                            }}
                            data-tool-canvas=""
                            data-ready={ready ? "" : undefined}
                        />
                    </div>
                    <p className="-mt-2 text-xs text-muted">{t("help")}</p>
                </>
            )}

            {formats && color && (
                <section
                    className="overflow-hidden rounded-2xl border border-border bg-bg"
                    aria-live="polite"
                >
                    <div className="flex items-center gap-3 border-b border-border/70 px-4 py-3">
                        <span
                            className="size-12 shrink-0 rounded-xl border border-border"
                            style={{ backgroundColor: formats.rgb }}
                        />
                        {point && (
                            <span className="text-xs text-muted tabular-nums">
                                {t("position")}: <Ltr>{`${point.x}, ${point.y}`}</Ltr>
                            </span>
                        )}
                    </div>
                    <dl className="divide-y divide-border/50 text-sm">
                        {(["hex", "rgb", "hsl", "oklch", "cmyk"] as const).map((key) => (
                            <div key={key} className="flex items-center gap-3 px-4 py-1.5">
                                <dt className="w-14 shrink-0 text-xs text-muted uppercase">
                                    {key}
                                </dt>
                                <dd className="min-w-0 flex-1">
                                    <Ltr as="code" className="font-mono text-sm break-all">
                                        {formats[key]}
                                    </Ltr>
                                </dd>
                                <CopyButton text={formats[key]} locale={locale} compact />
                            </div>
                        ))}
                    </dl>
                </section>
            )}

            {history.length > 0 && (
                <section className="flex flex-col gap-2">
                    <h2 className="text-xs font-semibold text-muted">{t("picked")}</h2>
                    <ul className="flex flex-wrap gap-2">
                        {history.map((hex) => (
                            <li
                                key={hex}
                                className="flex items-center gap-1.5 rounded-full border border-border ps-1 pe-1 text-xs"
                            >
                                <span
                                    className="size-6 rounded-full border border-border"
                                    style={{ backgroundColor: hex }}
                                />
                                <Ltr as="code" className="font-mono">
                                    {hex}
                                </Ltr>
                                <CopyButton text={hex} locale={locale} compact />
                            </li>
                        ))}
                    </ul>
                </section>
            )}
            <input type="hidden" value={formats ? formats.hex : ""} readOnly data-tool-output="" />
        </div>
    );
}

function parseRgb(text: string): Rgba {
    const [r = 0, g = 0, b = 0] = (text.match(/\d+/g) ?? []).map(Number);
    return { r, g, b, a: 1 };
}
