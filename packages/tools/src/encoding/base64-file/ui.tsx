import { useMemo, useState } from "react";
import { downloadBlob, formatBytes } from "@handyweb/core/files";
import { toToolError, type ToolError, type ToolResult } from "@handyweb/core/runtime";
import {
    Button,
    CopyButton,
    ErrorMessage,
    FileDrop,
    Icon,
    Ltr,
    Pane,
    PaneAction,
    PasteButton,
    Segmented,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { strings } from "./i18n";
import {
    decodeFile,
    encodeFile,
    MAX_FILE_BYTES,
    type DecodedFile,
    type EncodedFile,
} from "./logic";

type Mode = "encode" | "decode";

export default function Base64File({ locale, presetOptions }: ToolUiProps) {
    const [mode, setMode] = useState<Mode>(
        presetOptions?.["mode"] === "decode" ? "decode" : "encode",
    );
    const [format, setFormat] = useState<"dataUri" | "base64">("dataUri");
    const [file, setFile] = useState<{ name: string; size: number; encoded: EncodedFile } | null>(
        null,
    );
    const [fileError, setFileError] = useState<ToolError | null>(null);
    const [text, setText] = useState("");
    const [plain, setPlain] = useState("");
    const t = (key: keyof typeof strings) => strings[key][locale];

    const pick = async (picked: File) => {
        setFile(null);
        setFileError(null);
        if (picked.size > MAX_FILE_BYTES) {
            setFileError({ code: "too-large", message: strings.tooLarge });
            return;
        }
        const bytes = new Uint8Array(await picked.arrayBuffer());
        setFile({ name: picked.name, size: picked.size, encoded: encodeFile(bytes, picked.type) });
    };

    const decoded = useMemo((): ToolResult<DecodedFile> | null => {
        if (mode !== "decode" || text.trim() === "") return null;
        try {
            return { ok: true, value: decodeFile(text) };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [mode, text]);

    // Text in the encode box is encoded as UTF-8 text/plain when no file is chosen.
    const encoded = useMemo(
        () =>
            file?.encoded ??
            (plain === ""
                ? null
                : encodeFile(new TextEncoder().encode(plain), "text/plain;charset=utf-8")),
        [file, plain],
    );
    const output = encoded ? (format === "dataUri" ? encoded.dataUri : encoded.base64) : "";
    const summary = decoded?.ok ? `${decoded.value.mime} ${decoded.value.bytes.length}` : output;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                <Segmented<Mode>
                    legend={t("mode")}
                    value={mode}
                    onChange={setMode}
                    options={[
                        { value: "encode", label: t("encode") },
                        { value: "decode", label: t("decode") },
                    ]}
                />
                {mode === "encode" && (
                    <Segmented<"dataUri" | "base64">
                        legend={t("format")}
                        value={format}
                        onChange={setFormat}
                        options={[
                            { value: "dataUri", label: t("dataUri") },
                            { value: "base64", label: t("base64") },
                        ]}
                    />
                )}
            </div>
            {mode === "encode" ? (
                <>
                    {file ? (
                        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2/60 p-4">
                            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface text-muted">
                                <Icon name="file" className="size-5" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <Ltr className="block truncate font-semibold">{file.name}</Ltr>
                                <span className="text-xs text-muted">
                                    <Ltr>{file.encoded.mime}</Ltr> ·{" "}
                                    {formatBytes(file.size, locale)}
                                </span>
                            </div>
                            <PaneAction
                                icon="clear"
                                label={UI_STRINGS.clear[locale]}
                                onClick={() => setFile(null)}
                            />
                        </div>
                    ) : (
                        <FileDrop locale={locale} onFile={(picked) => void pick(picked)} />
                    )}
                    {!file && (
                        <Pane
                            label={t("orText")}
                            locale={locale}
                            value={plain}
                            onChange={(event) => setPlain(event.target.value)}
                            placeholder={UI_STRINGS.inputHere[locale]}
                            className="min-h-24"
                            stats={false}
                            data-tool-input=""
                        />
                    )}
                    {fileError && <ErrorMessage error={fileError} locale={locale} />}
                    {encoded && (
                        <Pane
                            label={UI_STRINGS.output[locale]}
                            locale={locale}
                            code
                            value={output}
                            readOnly
                            className="min-h-48 break-all"
                            meta={<span>{t("hint")}</span>}
                            actions={<CopyButton text={output} locale={locale} compact />}
                        />
                    )}
                </>
            ) : (
                <>
                    <Pane
                        label={t("input")}
                        locale={locale}
                        code
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        placeholder="data:image/png;base64,…"
                        className="min-h-48 break-all"
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
                    {decoded && !decoded.ok && (
                        <ErrorMessage error={decoded.error} locale={locale} />
                    )}
                    {decoded?.ok && (
                        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-bg p-4 text-sm">
                            <span data-tool-decoded>
                                {t("type")}: <Ltr className="font-mono">{decoded.value.mime}</Ltr> ·{" "}
                                {t("size")}: {formatBytes(decoded.value.bytes.length, locale)}
                            </span>
                            <Button
                                variant="primary"
                                onClick={() =>
                                    downloadBlob(
                                        new Blob([decoded.value.bytes as Uint8Array<ArrayBuffer>], {
                                            type: decoded.value.mime,
                                        }),
                                        decoded.value.fileName,
                                    )
                                }
                            >
                                {t("download")}
                            </Button>
                        </div>
                    )}
                </>
            )}
            <input type="hidden" value={summary} readOnly data-tool-output="" />
        </div>
    );
}
