import { useEffect, useId, useRef, useState } from "react";
import { ObjectUrls } from "@handyweb/core/files";
import { decodeImage, drawScaled, renderToBlob, type DecodedImage } from "@handyweb/core/image";
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
import { compressedName, fitInside } from "./logic";

type Target = "image/jpeg" | "image/webp";
const SIDES = [null, 3840, 2560, 1920, 1280, 800] as const;

export default function ImageCompressor({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const urls = useRef(new ObjectUrls());
    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<DecodedImage | null>(null);
    const [type, setType] = useState<Target>("image/webp");
    const [quality, setQuality] = useState(75);
    const [maxSide, setMaxSide] = useState<number | null>(null);
    const [result, setResult] = useState<{
        url: string;
        blob: Blob;
        name: string;
        width: number;
        height: number;
    } | null>(null);
    const [error, setError] = useState<ToolError | null>(null);
    const [busy, setBusy] = useState(false);
    const ids = { quality: useId(), side: useId() };

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

    const compress = async () => {
        if (!image || !file) return;
        setBusy(true);
        setError(null);
        try {
            const size = fitInside(image.width, image.height, maxSide);
            const blob = await renderToBlob(
                size.width,
                size.height,
                (context) => drawScaled(context, image.bitmap, size.width, size.height),
                type,
                quality / 100,
            );
            clearResult();
            const written = blob.type === type ? type : "image/png";
            setResult({
                url: urls.current.create(blob),
                blob,
                name: compressedName(file.name, written as Target),
                ...size,
            });
        } catch (caught) {
            setError(toToolError(caught));
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="flex flex-col gap-5">
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
                    <Segmented<Target>
                        legend={shared.format[locale]}
                        value={type}
                        onChange={(next) => {
                            setType(next);
                            clearResult();
                        }}
                        options={[
                            { value: "image/webp", label: "WebP" },
                            { value: "image/jpeg", label: "JPEG" },
                        ]}
                    />
                    <div className="flex flex-wrap items-end gap-4">
                        <label
                            htmlFor={ids.quality}
                            className="flex min-w-48 flex-1 flex-col gap-1.5 text-xs font-semibold text-muted"
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
                                data-tool-quality=""
                            />
                        </label>
                        <label
                            htmlFor={ids.side}
                            className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
                        >
                            {t("maxSide")}
                            <select
                                id={ids.side}
                                value={maxSide ?? ""}
                                onChange={(event) => {
                                    setMaxSide(
                                        event.target.value === ""
                                            ? null
                                            : Number(event.target.value),
                                    );
                                    clearResult();
                                }}
                                className="min-h-11 rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text outline-none focus-visible:border-focus"
                            >
                                {SIDES.map((side) => (
                                    <option key={side ?? "none"} value={side ?? ""}>
                                        {side === null ? t("original") : `${side} px`}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    {image.format === "png" && <p className="text-xs text-muted">{t("pngNote")}</p>}
                    <Button
                        variant="primary"
                        className="w-fit"
                        onClick={() => void compress()}
                        disabled={busy}
                        data-tool-run=""
                    >
                        {busy ? UI_STRINGS.working[locale] : t("compress")}
                    </Button>
                    {error && <ErrorMessage error={error} locale={locale} />}
                    {result && result.blob.type !== type && (
                        <p className="text-sm text-error">{shared.noWebp[locale]}</p>
                    )}
                    {result && result.blob.size >= file.size && (
                        <p
                            role="note"
                            className="rounded-2xl border border-primary/40 bg-primary-soft px-4 py-3 text-sm"
                            data-tool-larger=""
                        >
                            {t("larger")}
                        </p>
                    )}
                    {result && <ResultCard locale={locale} {...result} sourceBytes={file.size} />}
                </>
            )}
            <p className="text-xs text-muted">{shared.metadata[locale]}</p>
            <input
                type="hidden"
                value={result ? String(result.blob.size) : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
