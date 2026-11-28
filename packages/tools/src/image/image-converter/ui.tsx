import { useEffect, useId, useRef, useState } from "react";
import { ObjectUrls } from "@handyweb/core/files";
import {
    decodeImage,
    renderToBlob,
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
import { shared } from "../shared/i18n";
import { strings } from "./i18n";
import { convertedName, parseTarget, wroteType } from "./logic";

const LABELS: Record<OutputType, string> = {
    "image/png": "PNG",
    "image/jpeg": "JPEG",
    "image/webp": "WebP",
};

export default function ImageConverter({ locale, presetOptions }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const urls = useRef(new ObjectUrls());
    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<DecodedImage | null>(null);
    const [type, setType] = useState<OutputType>(parseTarget(presetOptions?.["to"]) ?? "image/png");
    const [quality, setQuality] = useState(92);
    const [background, setBackground] = useState("#ffffff");
    const [result, setResult] = useState<{ url: string; blob: Blob; name: string } | null>(null);
    const [error, setError] = useState<ToolError | null>(null);
    const [busy, setBusy] = useState(false);
    const ids = { quality: useId(), background: useId() };

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
    };

    const clearResult = () => {
        if (result) urls.current.revoke(result.url);
        setResult(null);
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

    const convert = async () => {
        if (!image || !file) return;
        setBusy(true);
        setError(null);
        try {
            const blob = await renderToBlob(
                image.width,
                image.height,
                (context) => {
                    if (type === "image/jpeg") {
                        context.fillStyle = background;
                        context.fillRect(0, 0, image.width, image.height);
                    }
                    context.drawImage(image.bitmap, 0, 0);
                },
                type,
                quality / 100,
            );
            clearResult();
            const written = wroteType(blob, type) ? type : "image/png";
            setResult({
                url: urls.current.create(blob),
                blob,
                name: convertedName(file.name, written),
            });
        } catch (caught) {
            setError(toToolError(caught));
        } finally {
            setBusy(false);
        }
    };

    const fallback = result && !wroteType(result.blob, type);

    return (
        <div className="flex flex-col gap-5">
            <Segmented<OutputType>
                legend={shared.format[locale]}
                value={type}
                onChange={(next) => {
                    setType(next);
                    clearResult();
                }}
                options={(Object.keys(LABELS) as OutputType[]).map((value) => ({
                    value,
                    label: LABELS[value],
                }))}
            />
            {!image || !file ? (
                <>
                    <FileDrop
                        locale={locale}
                        accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
                        onFile={(picked) => void open(picked)}
                    />
                    {error && <ErrorMessage error={error} locale={locale} />}
                </>
            ) : (
                <>
                    <SourceCard
                        locale={locale}
                        name={file.name}
                        width={image.width}
                        height={image.height}
                        bytes={file.size}
                        onReset={reset}
                    />
                    {type !== "image/png" && (
                        <label
                            htmlFor={ids.quality}
                            className="flex max-w-md flex-col gap-1.5 text-xs font-semibold text-muted"
                        >
                            <span>
                                {shared.quality[locale]}:{" "}
                                <span className="tabular-nums">{quality}</span>
                            </span>
                            <input
                                id={ids.quality}
                                type="range"
                                min={10}
                                max={100}
                                value={quality}
                                onChange={(event) => {
                                    setQuality(Number(event.target.value));
                                    clearResult();
                                }}
                                className="min-h-11 accent-primary"
                            />
                        </label>
                    )}
                    {type === "image/jpeg" && (
                        <div className="flex flex-wrap items-center gap-3">
                            <label
                                htmlFor={ids.background}
                                className="flex items-center gap-2 text-sm"
                            >
                                {t("background")}
                                <input
                                    id={ids.background}
                                    type="color"
                                    value={background}
                                    onChange={(event) => {
                                        setBackground(event.target.value);
                                        clearResult();
                                    }}
                                    className="h-11 w-14 rounded-lg border border-border"
                                />
                            </label>
                            <p className="text-xs text-muted">{t("jpegAlpha")}</p>
                        </div>
                    )}
                    <Button
                        variant="primary"
                        className="w-fit"
                        onClick={() => void convert()}
                        disabled={busy}
                        data-tool-run=""
                    >
                        {busy ? UI_STRINGS.working[locale] : `${t("convert")} → ${LABELS[type]}`}
                    </Button>
                    {error && <ErrorMessage error={error} locale={locale} />}
                    {fallback && <p className="text-sm text-error">{shared.noWebp[locale]}</p>}
                    {result && (
                        <ResultCard
                            locale={locale}
                            {...result}
                            width={image.width}
                            height={image.height}
                            sourceBytes={file.size}
                        />
                    )}
                </>
            )}
            <p className="text-xs text-muted">{shared.metadata[locale]}</p>
            <input type="hidden" value={result ? result.name : ""} readOnly data-tool-output="" />
        </div>
    );
}
