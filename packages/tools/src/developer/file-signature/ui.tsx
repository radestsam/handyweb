import { useId, useMemo, useState } from "react";
import { formatBytes } from "@handyweb/core/files";
import { ErrorMessage, FileDrop, Ltr, type ToolUiProps } from "@handyweb/core/ui";
import { strings } from "./i18n";
import { detect, HEADER_BYTES, type Detection } from "./logic";

export default function FileSignature({ locale }: ToolUiProps) {
    const [picked, setPicked] = useState<{ name: string; size: number; bytes: Uint8Array } | null>(
        null,
    );
    const [hex, setHex] = useState("");
    const hexId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];

    const pick = async (file: File) => {
        const bytes = new Uint8Array(await file.slice(0, HEADER_BYTES).arrayBuffer());
        setHex("");
        setPicked({ name: file.name, size: file.size, bytes });
    };

    const fromHex = useMemo(() => {
        const clean = hex.replace(/0x|[\s,:]/gi, "");
        if (clean === "") return null;
        if (!/^(?:[0-9a-f]{2})+$/i.test(clean)) return "bad" as const;
        return Uint8Array.from(clean.match(/../g) ?? [], (pair) => parseInt(pair, 16));
    }, [hex]);

    const result: Detection | null = picked
        ? detect(picked.bytes, picked.name)
        : fromHex instanceof Uint8Array
          ? detect(fromHex, "")
          : null;
    const top = result?.matches[0];
    const summary = top ? `${top.name} (${top.mime})` : result ? "unknown" : "";

    return (
        <div className="flex flex-col gap-5">
            <FileDrop locale={locale} onFile={(file) => void pick(file)} />
            <div className="flex flex-col gap-1.5">
                <label htmlFor={hexId} className="text-xs font-semibold text-muted">
                    {t("orHex")}
                </label>
                <input
                    id={hexId}
                    dir="ltr"
                    value={hex}
                    onChange={(event) => {
                        setPicked(null);
                        setHex(event.target.value);
                    }}
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="89 50 4E 47 0D 0A 1A 0A"
                    className="min-h-12 w-full rounded-xl border border-border bg-surface-2/60 px-4 font-mono text-sm text-text outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]"
                    data-tool-input=""
                />
            </div>
            {fromHex === "bad" && !picked && (
                <ErrorMessage
                    error={{ code: "invalid-input", message: strings.badHex }}
                    locale={locale}
                />
            )}
            {result && (
                <section className="overflow-hidden rounded-2xl border border-border bg-bg text-sm">
                    {picked && (
                        <p className="border-b border-border/70 px-4 py-2 text-xs text-muted">
                            <bdi className="font-semibold">{picked.name}</bdi> ·{" "}
                            {formatBytes(picked.size, locale)}
                        </p>
                    )}
                    <div className="px-4 py-3">
                        <p className="text-xs text-muted">{t("detected")}</p>
                        <p className="text-lg font-semibold" data-tool-type>
                            {top ? (
                                <Ltr>{top.name}</Ltr>
                            ) : result.looksLikeText ? (
                                t("text")
                            ) : (
                                t("unknown")
                            )}
                        </p>
                        {top && (
                            <p className="mt-1 text-xs text-muted">
                                <Ltr className="font-mono">{top.mime}</Ltr> · {t("extensions")}:{" "}
                                <Ltr className="font-mono">
                                    {top.extensions
                                        .filter(Boolean)
                                        .map((e) => `.${e}`)
                                        .join(" ")}
                                </Ltr>
                            </p>
                        )}
                        {picked && result.extension && (
                            <p className="mt-1 text-xs text-muted">
                                {t("fileExtension")}:{" "}
                                <Ltr className="font-mono">.{result.extension}</Ltr>
                            </p>
                        )}
                    </div>
                    {(result.mismatch || top?.kind === "executable") && (
                        <ul
                            className="flex flex-col gap-1 border-t border-border/70 bg-error-bg px-4 py-3 text-error"
                            data-tool-warning
                        >
                            {result.mismatch && <li>⚠ {t("mismatch")}</li>}
                            {top?.kind === "executable" && <li>⚠ {t("executable")}</li>}
                        </ul>
                    )}
                    <div className="border-t border-border/70 px-4 py-3">
                        <p className="text-xs text-muted">{t("firstBytes")}</p>
                        <Ltr as="code" className="font-mono text-xs break-all">
                            {result.hex}
                        </Ltr>
                    </div>
                </section>
            )}
            <p className="text-xs text-muted">{t("note")}</p>
            <input type="hidden" value={summary} readOnly data-tool-output="" />
        </div>
    );
}
