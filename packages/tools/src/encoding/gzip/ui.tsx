import { useEffect, useState } from "react";
import { downloadBlob, formatBytes } from "@handyweb/core/files";
import { toToolError, type ToolError } from "@handyweb/core/runtime";
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
import { base64ToBytes, bytesToBase64 } from "../base64/logic";
import { strings } from "./i18n";
import { compress, decompress, detectFormat, FORMATS, type Format } from "./logic";

type Mode = "compress" | "decompress";
const EXTENSIONS: Record<Format, string> = { gzip: "gz", deflate: "zz", "deflate-raw": "deflate" };

interface Output {
    input: number;
    bytes: Uint8Array;
    text: string | null;
    detected: Format | null;
}

export default function Gzip({ locale, presetOptions }: ToolUiProps) {
    const [mode, setMode] = useState<Mode>(
        presetOptions?.["mode"] === "decompress" ? "decompress" : "compress",
    );
    const [format, setFormat] = useState<Format>(
        presetOptions?.["format"] === "deflate" ? "deflate" : "gzip",
    );
    const [text, setText] = useState("");
    const [file, setFile] = useState<{ name: string; bytes: Uint8Array } | null>(null);
    const [output, setOutput] = useState<Output | null>(null);
    const [error, setError] = useState<ToolError | null>(null);
    const t = (key: keyof typeof strings) => strings[key][locale];

    useEffect(() => {
        let current = true;
        void (async () => {
            if (!file && text === "") {
                if (current) {
                    setOutput(null);
                    setError(null);
                }
                return;
            }
            try {
                if (mode === "compress") {
                    const input = file?.bytes ?? new TextEncoder().encode(text);
                    const bytes = await compress(input, format);
                    if (current)
                        setOutput({ input: input.length, bytes, text: null, detected: null });
                } else {
                    const input = file?.bytes ?? base64ToBytes(text);
                    const detected = detectFormat(input);
                    const used = detected ?? format;
                    const bytes = await decompress(input, used);
                    let decoded: string | null = null;
                    try {
                        decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
                    } catch {
                        decoded = null;
                    }
                    if (current) {
                        setOutput({ input: input.length, bytes, text: decoded, detected });
                    }
                }
                if (current) setError(null);
            } catch (caught) {
                if (current) {
                    setOutput(null);
                    setError(toToolError(caught));
                }
            }
        })();
        return () => {
            current = false;
        };
    }, [mode, format, text, file]);

    const pick = async (picked: File) => {
        if (picked.size > 50_000_000) {
            setError({
                code: "too-large",
                message: {
                    fa: "فایل بیش از ۵۰ مگابایت است.",
                    en: "The file is larger than 50 MB.",
                },
            });
            return;
        }
        setFile({ name: picked.name, bytes: new Uint8Array(await picked.arrayBuffer()) });
    };
    const base64 =
        output && mode === "compress"
            ? bytesToBase64(output.bytes, { urlSafe: false, padding: true })
            : "";
    const fileName = (() => {
        const name = file?.name ?? "text.txt";
        return mode === "compress"
            ? `${name}.${EXTENSIONS[format]}`
            : name.replace(/\.(gz|zz|deflate)$/i, "") || "file.bin";
    })();
    const number = (n: number) => new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en").format(n);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                <Segmented<Mode>
                    legend={t("mode")}
                    value={mode}
                    onChange={(next) => {
                        setMode(next);
                        setText("");
                        setFile(null);
                    }}
                    options={[
                        { value: "compress", label: t("compress") },
                        { value: "decompress", label: t("decompress") },
                    ]}
                />
                <Segmented<Format>
                    legend={t("format")}
                    value={format}
                    onChange={setFormat}
                    options={FORMATS.map((value) => ({ value, label: value }))}
                />
            </div>
            {file ? (
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2/60 p-4 text-sm">
                    <bdi className="min-w-0 flex-1 truncate font-semibold">{file.name}</bdi>
                    <span className="text-muted">{formatBytes(file.bytes.length, locale)}</span>
                    <PaneAction
                        icon="clear"
                        label={UI_STRINGS.clear[locale]}
                        onClick={() => setFile(null)}
                    />
                </div>
            ) : (
                <>
                    <Pane
                        label={mode === "compress" ? t("text") : t("base64")}
                        locale={locale}
                        code={mode === "decompress"}
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        placeholder={UI_STRINGS.inputHere[locale]}
                        className="min-h-36"
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
                        onFile={(picked) => void pick(picked)}
                        hint={t("orFile")}
                    />
                </>
            )}
            {error && <ErrorMessage error={error} locale={locale} />}
            {output && (
                <section className="flex flex-col gap-3 rounded-2xl border border-border bg-bg p-4 text-sm">
                    <p className="flex flex-wrap gap-x-5 gap-y-1" data-tool-sizes>
                        <span>
                            {t("original")}:{" "}
                            {formatBytes(
                                mode === "compress" ? output.input : output.bytes.length,
                                locale,
                            )}
                        </span>
                        <span>
                            {t("compressed")}:{" "}
                            {formatBytes(
                                mode === "compress" ? output.bytes.length : output.input,
                                locale,
                            )}
                        </span>
                        {mode === "compress" && output.input > 0 && (
                            <span>
                                {t("saved")}:{" "}
                                {number(Math.round((1 - output.bytes.length / output.input) * 100))}
                                %
                            </span>
                        )}
                    </p>
                    {output.detected && (
                        <p className="text-xs text-muted">
                            {t("detected")}: {output.detected}
                        </p>
                    )}
                    {mode === "compress" ? (
                        <Pane
                            label={t("base64")}
                            locale={locale}
                            code
                            readOnly
                            stats={false}
                            value={base64}
                            className="min-h-28 break-all"
                            actions={<CopyButton text={base64} locale={locale} compact />}
                        />
                    ) : output.text !== null ? (
                        <Pane
                            label={t("result")}
                            locale={locale}
                            readOnly
                            value={output.text}
                            className="min-h-28"
                            actions={<CopyButton text={output.text} locale={locale} compact />}
                        />
                    ) : (
                        <p className="text-muted">{t("notText")}</p>
                    )}
                    <div>
                        <Button
                            variant="primary"
                            onClick={() =>
                                downloadBlob(
                                    new Blob([output.bytes as Uint8Array<ArrayBuffer>]),
                                    fileName,
                                )
                            }
                        >
                            {t("download")}
                        </Button>
                    </div>
                </section>
            )}
            <input
                type="hidden"
                value={
                    output
                        ? mode === "compress"
                            ? base64
                            : (output.text ?? String(output.bytes.length))
                        : ""
                }
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
