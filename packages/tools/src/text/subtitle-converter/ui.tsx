import { useId, useMemo, useState } from "react";
import { downloadBlob } from "@handyweb/core/files";
import { toToolError, type ToolResult } from "@handyweb/core/runtime";
import {
    Button,
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
import {
    decodeSubtitleFile,
    detectFormat,
    parseSubtitles,
    shiftCues,
    writeSubtitles,
    type SubtitleFormat,
} from "./logic";

export default function SubtitleConverter({ locale, presetOptions }: ToolUiProps) {
    const [text, setText] = useState("");
    const [target, setTarget] = useState<SubtitleFormat>(
        presetOptions?.["to"] === "srt" ? "srt" : "vtt",
    );
    const [shift, setShift] = useState("0");
    const [fileName, setFileName] = useState("subtitles");
    const [converted, setConverted] = useState(false);
    const shiftId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];
    const number = (n: number) => new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en").format(n);

    const result = useMemo((): ToolResult<{ text: string; count: number }> | null => {
        if (text.trim() === "") return null;
        try {
            const cues = shiftCues(parseSubtitles(text), Math.round((Number(shift) || 0) * 1000));
            return { ok: true, value: { text: writeSubtitles(cues, target), count: cues.length } };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [text, target, shift]);
    const output = result?.ok ? result.value.text : "";

    const pick = async (picked: File) => {
        const decoded = decodeSubtitleFile(new Uint8Array(await picked.arrayBuffer()));
        setConverted(decoded.encoding === "windows-1256");
        setFileName(picked.name.replace(/\.(srt|vtt|txt)$/i, ""));
        setText(decoded.text);
        if (detectFormat(decoded.text) === target) setTarget(target === "srt" ? "vtt" : "srt");
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                <Segmented<SubtitleFormat>
                    legend={t("target")}
                    value={target}
                    onChange={setTarget}
                    options={[
                        { value: "vtt", label: "WebVTT" },
                        { value: "srt", label: "SRT" },
                    ]}
                />
                <div className="flex flex-col gap-1.5">
                    <label htmlFor={shiftId} className="text-xs font-semibold text-muted">
                        {t("shift")}
                    </label>
                    <input
                        id={shiftId}
                        type="number"
                        dir="ltr"
                        step={0.1}
                        value={shift}
                        onChange={(event) => setShift(event.target.value)}
                        aria-describedby={`${shiftId}-hint`}
                        className="min-h-11 w-28 rounded-xl border border-border bg-surface-2/60 px-3 text-base tabular-nums text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]"
                    />
                </div>
            </div>
            <p id={`${shiftId}-hint`} className="-mt-3 text-xs text-muted">
                {t("shiftHint")}
            </p>
            <FileDrop
                locale={locale}
                accept=".srt,.vtt,.txt"
                onFile={(picked) => void pick(picked)}
                hint={t("orFile")}
            />
            {converted && <p className="text-sm text-success">✓ {t("windows1256")}</p>}
            <div className="grid gap-3 lg:grid-cols-2">
                <Pane
                    label={t("subtitles")}
                    locale={locale}
                    value={text}
                    onChange={(event) => {
                        setConverted(false);
                        setText(event.target.value);
                    }}
                    placeholder={UI_STRINGS.inputHere[locale]}
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
                    label={UI_STRINGS.output[locale]}
                    locale={locale}
                    value={output}
                    readOnly
                    placeholder={UI_STRINGS.outputHere[locale]}
                    className="min-h-72"
                    meta={
                        result?.ok ? (
                            <span data-tool-count>
                                {number(result.value.count)} {t("cues")}
                            </span>
                        ) : undefined
                    }
                    actions={<CopyButton text={output} locale={locale} compact />}
                    data-tool-output=""
                />
            </div>
            {result && !result.ok && <ErrorMessage error={result.error} locale={locale} />}
            {result?.ok && (
                <div>
                    <Button
                        variant="primary"
                        onClick={() =>
                            downloadBlob(
                                new Blob([output], {
                                    type:
                                        target === "vtt"
                                            ? "text/vtt;charset=utf-8"
                                            : "application/x-subrip;charset=utf-8",
                                }),
                                `${fileName}.${target}`,
                            )
                        }
                    >
                        {t("download")}
                    </Button>
                </div>
            )}
        </div>
    );
}
