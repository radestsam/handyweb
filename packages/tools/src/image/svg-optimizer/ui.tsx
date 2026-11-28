import { useDeferredValue, useMemo, useState } from "react";
import { downloadBlob, formatBytes } from "@handyweb/core/files";
import { toToolError } from "@handyweb/core/runtime";
import {
    Button,
    Checkbox,
    CopyButton,
    ErrorMessage,
    FileDrop,
    Pane,
    PaneAction,
    PasteButton,
    Segmented,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { strings } from "./i18n";
import { optimizeSvg } from "./logic";

type Precision = "0" | "1" | "2" | "3" | "4";

const dataUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

export default function SvgOptimizer({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const [text, setText] = useState("");
    const [name, setName] = useState("image");
    const [precision, setPrecision] = useState<Precision>("2");
    const [keepTitle, setKeepTitle] = useState(true);
    const [sanitize, setSanitize] = useState(true);
    const deferred = useDeferredValue(text);

    const outcome = useMemo(() => {
        if (deferred.trim() === "") return null;
        try {
            return {
                ok: true as const,
                value: optimizeSvg(deferred, { precision: Number(precision), keepTitle, sanitize }),
            };
        } catch (caught) {
            return { ok: false as const, error: toToolError(caught) };
        }
    }, [deferred, precision, keepTitle, sanitize]);
    const result = outcome?.ok ? outcome.value : null;
    const saving = result ? Math.round((1 - result.after / result.before) * 100) : 0;

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
                <Segmented<Precision>
                    legend={t("precision")}
                    value={precision}
                    onChange={setPrecision}
                    options={(["0", "1", "2", "3", "4"] as const).map((value) => ({
                        value,
                        label: value,
                    }))}
                />
                <div className="flex flex-col gap-1">
                    <Checkbox label={t("keepTitle")} checked={keepTitle} onChange={setKeepTitle} />
                    <Checkbox label={t("sanitize")} checked={sanitize} onChange={setSanitize} />
                </div>
            </div>
            <p className="-mt-2 text-xs text-muted">{t("precisionHelp")}</p>
            <div className="grid gap-3 lg:grid-cols-2">
                <Pane
                    label={t("input")}
                    locale={locale}
                    code
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder='<svg xmlns="http://www.w3.org/2000/svg" …'
                    className="min-h-72"
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
                <Pane
                    label={t("output")}
                    locale={locale}
                    code
                    value={result?.svg ?? ""}
                    readOnly
                    placeholder={UI_STRINGS.outputHere[locale]}
                    className="min-h-72"
                    actions={<CopyButton text={result?.svg ?? ""} locale={locale} compact />}
                    data-tool-output=""
                />
            </div>
            <FileDrop
                locale={locale}
                accept=".svg,image/svg+xml"
                hint={t("orFile")}
                onFile={(file) => {
                    setName(file.name.replace(/\.svg$/i, "") || "image");
                    void file.text().then(setText);
                }}
            />
            {outcome && !outcome.ok && <ErrorMessage error={outcome.error} locale={locale} />}
            {result && (
                <section className="flex flex-col gap-3 rounded-2xl border border-border bg-bg p-4">
                    <p className="text-sm tabular-nums" data-svg-saving="">
                        {formatBytes(result.before, locale)} → {formatBytes(result.after, locale)}
                        {saving > 0 && (
                            <span className="text-success">
                                {" "}
                                ({saving}% {t("smaller")})
                            </span>
                        )}
                    </p>
                    {/* Both copies are shown as images, so no script runs. */}
                    <div className="grid grid-cols-2 gap-3">
                        {(
                            [
                                ["before", deferred],
                                ["after", result.svg],
                            ] as const
                        ).map(([key, svg]) => (
                            <figure key={key} className="flex flex-col items-center gap-1">
                                <div className="flex h-32 w-full items-center justify-center rounded-xl border border-border bg-[repeating-conic-gradient(#d4d4d8_0_25%,#ffffff_0_50%)] [background-size:16px_16px] p-2">
                                    <img
                                        src={dataUrl(
                                            key === "before" && sanitize ? result.svg : svg,
                                        )}
                                        alt={t(key)}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                                <figcaption className="text-xs text-muted">{t(key)}</figcaption>
                            </figure>
                        ))}
                    </div>
                    <Button
                        variant="primary"
                        className="w-fit"
                        onClick={() =>
                            downloadBlob(
                                new Blob([result.svg], { type: "image/svg+xml" }),
                                `${name}.min.svg`,
                            )
                        }
                    >
                        {t("download")}
                    </Button>
                </section>
            )}
        </div>
    );
}
