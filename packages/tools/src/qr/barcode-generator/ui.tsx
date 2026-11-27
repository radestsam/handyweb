import { useId, useMemo, useState } from "react";
import { downloadBlob } from "@handyweb/core/files";
import { toToolError } from "@handyweb/core/runtime";
import { Button, Checkbox, ErrorMessage, Segmented, type ToolUiProps } from "@handyweb/core/ui";
import { strings } from "./i18n";
import { encode, toSvg, type Format } from "./logic";

const FIELD =
    "min-h-11 w-full rounded-xl border border-border bg-surface-2/60 px-3 font-mono text-base text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";
const FORMATS: Format[] = ["code128", "ean13", "ean8", "upca"];
const LABELS: Record<Format, string> = {
    code128: "Code 128",
    ean13: "EAN-13",
    ean8: "EAN-8",
    upca: "UPC-A",
};
const HINTS = {
    code128: "hintCode128",
    ean13: "hintEan13",
    ean8: "hintEan8",
    upca: "hintUpca",
} as const;

export default function BarcodeGenerator({ locale, presetOptions }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const preset = FORMATS.find((format) => format === presetOptions?.["format"]);
    const [format, setFormat] = useState<Format>(preset ?? "code128");
    const [text, setText] = useState("");
    const [height, setHeight] = useState(80);
    const [module, setModule] = useState(2);
    const [showText, setShowText] = useState(true);
    const ids = { text: useId(), height: useId(), module: useId() };

    const outcome = useMemo(() => {
        if (!text.trim()) return null;
        try {
            const code = encode(text, format);
            return {
                ok: true as const,
                code,
                svg: toSvg(code, { module, height, showText, dark: "#000000", light: "#ffffff" }),
            };
        } catch (caught) {
            return { ok: false as const, error: toToolError(caught) };
        }
    }, [text, format, module, height, showText]);

    const savePng = async () => {
        if (!outcome?.ok) return;
        const image = new Image();
        image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(outcome.svg)}`;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        canvas.getContext("2d")?.drawImage(image, 0, 0);
        const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, "image/png"),
        );
        canvas.width = canvas.height = 0;
        if (blob) downloadBlob(blob, `barcode-${outcome.code.text.replace(/[^\w-]/g, "_")}.png`);
    };

    return (
        <div className="flex flex-col gap-5">
            <Segmented<Format>
                legend={t("format")}
                value={format}
                onChange={setFormat}
                options={FORMATS.map((value) => ({ value, label: LABELS[value] }))}
            />
            <label
                htmlFor={ids.text}
                className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
            >
                {t("content")}
                <input
                    id={ids.text}
                    dir="ltr"
                    autoComplete="off"
                    spellCheck={false}
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder={format === "code128" ? "HW-2026-001" : "400638133393"}
                    className={FIELD}
                    data-tool-input=""
                />
                <span className="font-normal">{t(HINTS[format])}</span>
            </label>
            <div className="flex flex-wrap items-end gap-4">
                <label
                    htmlFor={ids.height}
                    className="flex min-w-40 flex-1 flex-col gap-1.5 text-xs font-semibold text-muted"
                >
                    <span>
                        {t("height")}: <span className="tabular-nums">{height}</span>
                    </span>
                    <input
                        id={ids.height}
                        type="range"
                        min={30}
                        max={200}
                        dir="ltr"
                        value={height}
                        onChange={(event) => setHeight(Number(event.target.value))}
                        className="min-h-11 accent-primary"
                    />
                </label>
                <label
                    htmlFor={ids.module}
                    className="flex min-w-40 flex-1 flex-col gap-1.5 text-xs font-semibold text-muted"
                >
                    <span>
                        {t("module")}: <span className="tabular-nums">{module}</span>
                    </span>
                    <input
                        id={ids.module}
                        type="range"
                        min={1}
                        max={6}
                        dir="ltr"
                        value={module}
                        onChange={(event) => setModule(Number(event.target.value))}
                        className="min-h-11 accent-primary"
                    />
                </label>
                <Checkbox label={t("showText")} checked={showText} onChange={setShowText} />
            </div>
            {outcome && !outcome.ok && <ErrorMessage error={outcome.error} locale={locale} />}
            {outcome?.ok && (
                <section className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-white p-4">
                    <img
                        src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(outcome.svg)}`}
                        alt={`${t("preview")}: ${outcome.code.text}`}
                        className="max-w-full"
                        data-barcode-image=""
                    />
                    <div className="flex flex-wrap justify-center gap-2">
                        <Button
                            variant="primary"
                            onClick={() =>
                                downloadBlob(
                                    new Blob([outcome.svg], { type: "image/svg+xml" }),
                                    `barcode-${outcome.code.text.replace(/[^\w-]/g, "_")}.svg`,
                                )
                            }
                        >
                            {t("downloadSvg")}
                        </Button>
                        <Button onClick={() => void savePng()}>{t("downloadPng")}</Button>
                    </div>
                </section>
            )}
            <p className="text-xs text-muted">{t("note")}</p>
            <input
                type="hidden"
                value={outcome?.ok ? outcome.code.text : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
