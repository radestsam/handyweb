import { useMemo, useState } from "react";
import { downloadBlob, formatBytes } from "@handyweb/core/files";
import { toToolError } from "@handyweb/core/runtime";
import {
    Button,
    CopyButton,
    ErrorMessage,
    FileDrop,
    Ltr,
    Pane,
    PaneAction,
    PasteButton,
    Segmented,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { RISKS, strings } from "./i18n";
import { inspectSvg, pngSize } from "./logic";

type Background = "checker" | "light" | "dark";
type PngSide = "256" | "512" | "1024" | "2048";

const BACKGROUNDS: Record<Background, string> = {
    checker:
        "bg-[repeating-conic-gradient(#d4d4d8_0_25%,#ffffff_0_50%)] [background-size:16px_16px]",
    light: "bg-white",
    dark: "bg-zinc-900",
};

/** The clean SVG with a pixel width and height, so every browser draws it at that size. */
function sized(svg: string, width: number, height: number): string {
    const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
    doc.documentElement.setAttribute("width", String(width));
    doc.documentElement.setAttribute("height", String(height));
    return new XMLSerializer().serializeToString(doc.documentElement);
}

export default function SvgViewer({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const [text, setText] = useState("");
    const [name, setName] = useState("image");
    const [background, setBackground] = useState<Background>("checker");
    const [side, setSide] = useState<PngSide>("512");

    const parsed = useMemo(() => {
        if (text.trim() === "") return { info: null, error: null };
        try {
            return { info: inspectSvg(text), error: null };
        } catch (caught) {
            return { info: null, error: toToolError(caught) };
        }
    }, [text]);
    const { info, error } = parsed;

    // The preview is the clean SVG as a data: URL, shown in an <img>.
    const url = useMemo(
        () => (info ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(info.clean)}` : null),
        [info],
    );

    const downloadPng = async () => {
        if (!info) return;
        const size = pngSize(info, Number(side));
        const blobUrl = URL.createObjectURL(
            new Blob([sized(info.clean, size.width, size.height)], { type: "image/svg+xml" }),
        );
        try {
            const image = new Image();
            image.src = blobUrl;
            await image.decode();
            const canvas = document.createElement("canvas");
            canvas.width = size.width;
            canvas.height = size.height;
            canvas.getContext("2d")?.drawImage(image, 0, 0, size.width, size.height);
            const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob(resolve, "image/png"),
            );
            canvas.width = canvas.height = 0;
            if (blob) downloadBlob(blob, `${name}-${size.width}x${size.height}.png`);
        } finally {
            URL.revokeObjectURL(blobUrl);
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <Pane
                label={t("input")}
                locale={locale}
                code
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder='<svg xmlns="http://www.w3.org/2000/svg" …'
                className="min-h-40"
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
            <FileDrop
                locale={locale}
                accept=".svg,image/svg+xml"
                hint={t("orFile")}
                onFile={(file) => {
                    setName(file.name.replace(/\.svg$/i, "") || "image");
                    void file.text().then(setText);
                }}
            />
            {error && <ErrorMessage error={error} locale={locale} />}

            {info && (
                <>
                    {info.risks.length > 0 && (
                        <div
                            role="alert"
                            className="rounded-2xl border border-error/40 bg-error-bg px-4 py-3 text-sm text-error"
                            data-svg-risks=""
                        >
                            <p>⚠ {t("risky")}</p>
                            <ul className="ms-5 list-disc">
                                {info.risks.map((risk) => (
                                    <li key={risk}>{RISKS[risk][locale]}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <Segmented<Background>
                        legend={t("background")}
                        value={background}
                        onChange={setBackground}
                        options={[
                            { value: "checker", label: t("checker") },
                            { value: "light", label: t("light") },
                            { value: "dark", label: t("dark") },
                        ]}
                    />
                    <section
                        className={`flex min-h-48 items-center justify-center rounded-2xl border border-border p-4 ${BACKGROUNDS[background]}`}
                        aria-label={t("preview")}
                    >
                        {url && (
                            <img
                                src={url}
                                alt={t("preview")}
                                className="max-h-96 w-full max-w-md object-contain"
                                data-svg-preview=""
                            />
                        )}
                    </section>
                    <p className="text-xs text-muted tabular-nums">
                        {t("size")}:{" "}
                        <Ltr>
                            {[
                                info.width && `width=${info.width}`,
                                info.height && `height=${info.height}`,
                                info.viewBox && `viewBox="${info.viewBox}"`,
                            ]
                                .filter(Boolean)
                                .join(" ") || "—"}
                        </Ltr>{" "}
                        · {info.elements} {t("elements")} ·{" "}
                        {formatBytes(new Blob([info.clean]).size, locale)}
                    </p>
                    <p className="text-xs text-muted">{t("safeNote")}</p>
                    <div className="flex flex-wrap items-end gap-3">
                        <Segmented<PngSide>
                            legend={t("pngSize")}
                            value={side}
                            onChange={setSide}
                            options={(["256", "512", "1024", "2048"] as const).map((value) => ({
                                value,
                                label: value,
                            }))}
                        />
                        <Button
                            variant="primary"
                            onClick={() => void downloadPng()}
                            data-svg-png=""
                        >
                            {t("downloadPng")}
                        </Button>
                        <Button
                            onClick={() =>
                                downloadBlob(
                                    new Blob([info.clean], { type: "image/svg+xml" }),
                                    `${name}-clean.svg`,
                                )
                            }
                        >
                            {t("downloadSvg")}
                        </Button>
                        <span className="flex items-center gap-1 text-sm">
                            {t("copyClean")}
                            <CopyButton text={info.clean} locale={locale} compact />
                        </span>
                    </div>
                </>
            )}
            <input type="hidden" value={info ? info.clean : ""} readOnly data-tool-output="" />
        </div>
    );
}
