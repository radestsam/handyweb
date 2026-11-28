import { useId, useMemo, useState } from "react";
import { downloadBlob } from "@handyweb/core/files";
import { toToolError, type ToolResult } from "@handyweb/core/runtime";
import {
    Button,
    ErrorMessage,
    Pane,
    PaneAction,
    PasteButton,
    Segmented,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { qrGeneratorMeta } from "./meta";
import { eccLabels, strings } from "./i18n";
import { colorWarning, ECC_LEVELS, makeQr, toSvg, type Ecc, type QrMatrix } from "./logic";

const MAX = qrGeneratorMeta.limits?.maxInputBytes ?? Infinity;
const PNG_SIZES = ["256", "512", "1024"] as const;
type PngSize = (typeof PNG_SIZES)[number];

/** Draws the grid on a canvas and returns a PNG. Each module is a whole number of pixels. */
function toPng(matrix: QrMatrix, dark: string, light: string, target: number): Promise<Blob> {
    const scale = Math.max(1, Math.floor(target / matrix.size));
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = matrix.size * scale;
    const context = canvas.getContext("2d");
    if (!context) return Promise.reject(new Error("canvas"));
    context.fillStyle = light;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = dark;
    matrix.modules.forEach((row, y) =>
        row.forEach((on, x) => {
            if (on) context.fillRect(x * scale, y * scale, scale, scale);
        }),
    );
    return new Promise((resolve, reject) =>
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("png"))), "image/png"),
    );
}

export default function QrGenerator({ locale }: ToolUiProps) {
    const [text, setText] = useState("");
    const [ecc, setEcc] = useState<Ecc>("M");
    const [dark, setDark] = useState("#000000");
    const [light, setLight] = useState("#ffffff");
    const [pngSize, setPngSize] = useState<PngSize>("512");
    const darkId = useId();
    const lightId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];
    const number = (n: number) => new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en").format(n);

    const result = useMemo((): ToolResult<QrMatrix> | null => {
        if (text === "") return null;
        if (text.length > MAX) {
            return {
                ok: false,
                error: {
                    code: "too-large",
                    message: { fa: "ورودی بیش از اندازه است.", en: "The input is too long." },
                },
            };
        }
        try {
            return { ok: true, value: makeQr(text, ecc) };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [text, ecc]);

    const matrix = result?.ok ? result.value : null;
    const svg = matrix ? toSvg(matrix, dark, light) : "";
    const warning = colorWarning(dark, light);
    // The same path as the SVG file, drawn by React without innerHTML.
    const path = useMemo(() => {
        if (!matrix) return "";
        let d = "";
        matrix.modules.forEach((row, y) =>
            row.forEach((on, x) => {
                if (on) d += `M${x} ${y}h1v1h-1z`;
            }),
        );
        return d;
    }, [matrix]);

    const savePng = async () => {
        if (!matrix) return;
        downloadBlob(await toPng(matrix, dark, light, Number(pngSize)), "qr-code.png");
    };

    return (
        <div className="flex flex-col gap-6">
            <Pane
                label={t("content")}
                locale={locale}
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="https://…"
                className="min-h-28"
                actions={
                    <>
                        <PasteButton locale={locale} onPaste={setText} />
                        <PaneAction
                            icon="clear"
                            label={UI_STRINGS.clear[locale]}
                            onClick={() => setText("")}
                            disabled={text === ""}
                        />
                    </>
                }
                data-tool-input=""
            />

            <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                <Segmented<Ecc>
                    legend={t("ecc")}
                    value={ecc}
                    onChange={setEcc}
                    options={ECC_LEVELS.map((value) => ({
                        value,
                        label: eccLabels[value][locale],
                    }))}
                />
                <div className="flex gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor={darkId} className="text-xs font-semibold text-muted">
                            {t("dark")}
                        </label>
                        <input
                            id={darkId}
                            type="color"
                            value={dark}
                            onChange={(event) => setDark(event.target.value)}
                            className="h-11 w-16 cursor-pointer rounded-lg border border-border bg-surface-2"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor={lightId} className="text-xs font-semibold text-muted">
                            {t("light")}
                        </label>
                        <input
                            id={lightId}
                            type="color"
                            value={light}
                            onChange={(event) => setLight(event.target.value)}
                            className="h-11 w-16 cursor-pointer rounded-lg border border-border bg-surface-2"
                        />
                    </div>
                </div>
            </div>

            {warning && (
                <p
                    role="note"
                    className="rounded-2xl border border-primary/40 bg-primary-soft px-4 py-3 text-sm"
                    data-tool-warning={warning}
                >
                    ⚠ {warning === "inverted" ? t("inverted") : t("lowContrast")}
                </p>
            )}

            {result && !result.ok && <ErrorMessage error={result.error} locale={locale} />}

            <section
                className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-bg p-4 sm:flex-row sm:items-start"
                aria-label={t("preview")}
            >
                <div className="w-full max-w-64 shrink-0">
                    {matrix ? (
                        <svg
                            viewBox={`0 0 ${matrix.size} ${matrix.size}`}
                            shapeRendering="crispEdges"
                            role="img"
                            aria-label={t("preview")}
                            className="block w-full rounded-lg border border-border"
                            data-tool-qr
                        >
                            <rect width={matrix.size} height={matrix.size} fill={light} />
                            <path d={path} fill={dark} />
                        </svg>
                    ) : (
                        <div className="grid aspect-square place-items-center rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted">
                            {t("empty")}
                        </div>
                    )}
                </div>
                {matrix && (
                    <div className="flex w-full flex-col gap-4">
                        <p className="text-sm text-muted" data-tool-version>
                            {t("version")} {number(matrix.version)} · {number(matrix.size)}×
                            {number(matrix.size)} {t("modules")}
                        </p>
                        <Segmented<PngSize>
                            legend={t("pngSize")}
                            value={pngSize}
                            onChange={setPngSize}
                            options={PNG_SIZES.map((value) => ({ value, label: `${value} px` }))}
                        />
                        <div className="flex flex-wrap gap-2">
                            <Button variant="primary" onClick={() => void savePng()}>
                                {t("downloadPng")}
                            </Button>
                            <Button
                                onClick={() =>
                                    downloadBlob(
                                        new Blob([svg], { type: "image/svg+xml" }),
                                        "qr-code.svg",
                                    )
                                }
                            >
                                {t("downloadSvg")}
                            </Button>
                        </div>
                    </div>
                )}
            </section>
            <input type="hidden" value={svg} readOnly data-tool-output="" />
        </div>
    );
}
