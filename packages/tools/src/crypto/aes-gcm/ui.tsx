import { useEffect, useId, useState } from "react";
import { toToolError, type ToolError } from "@handyweb/core/runtime";
import {
    Checkbox,
    CopyButton,
    ErrorMessage,
    Pane,
    PaneAction,
    PasteButton,
    Segmented,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { strings } from "./i18n";
import { decryptText, encryptText } from "./logic";

type Mode = "encrypt" | "decrypt";

export default function AesGcm({ locale, presetOptions }: ToolUiProps) {
    const [mode, setMode] = useState<Mode>(
        presetOptions?.["mode"] === "decrypt" ? "decrypt" : "encrypt",
    );
    const [passphrase, setPassphrase] = useState("");
    const [show, setShow] = useState(false);
    const [text, setText] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState<ToolError | null>(null);
    const [busy, setBusy] = useState(false);
    const passId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];

    // Key derivation is slow on purpose, so the work starts after a short pause.
    useEffect(() => {
        let current = true;
        const timer = setTimeout(() => {
            void (async () => {
                if (passphrase === "" || (mode === "decrypt" && text.trim() === "")) {
                    setOutput("");
                    setError(null);
                    return;
                }
                setBusy(true);
                try {
                    const value =
                        mode === "encrypt"
                            ? await encryptText(text, passphrase)
                            : await decryptText(text, passphrase);
                    if (current) {
                        setOutput(value);
                        setError(null);
                    }
                } catch (caught) {
                    if (current) {
                        setOutput("");
                        setError(toToolError(caught));
                    }
                } finally {
                    if (current) setBusy(false);
                }
            })();
        }, 400);
        return () => {
            current = false;
            clearTimeout(timer);
        };
    }, [mode, passphrase, text]);

    return (
        <div className="flex flex-col gap-5">
            <Segmented<Mode>
                legend={t("mode")}
                value={mode}
                onChange={(next) => {
                    setMode(next);
                    setText(output);
                }}
                options={[
                    { value: "encrypt", label: t("encrypt") },
                    { value: "decrypt", label: t("decrypt") },
                ]}
            />
            <div className="flex flex-col gap-1.5">
                <label htmlFor={passId} className="text-xs font-semibold text-muted">
                    {t("passphrase")}
                </label>
                <input
                    id={passId}
                    type={show ? "text" : "password"}
                    value={passphrase}
                    onChange={(event) => setPassphrase(event.target.value)}
                    autoComplete="new-password"
                    spellCheck={false}
                    className="min-h-12 w-full rounded-xl border border-border bg-surface-2/60 px-4 text-base text-text outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]"
                    data-tool-input=""
                />
                <Checkbox label={t("show")} checked={show} onChange={setShow} />
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
                <Pane
                    label={mode === "encrypt" ? t("text") : t("encrypted")}
                    locale={locale}
                    code={mode === "decrypt"}
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder={UI_STRINGS.inputHere[locale]}
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
                />
                <Pane
                    label={mode === "encrypt" ? t("encrypted") : t("text")}
                    locale={locale}
                    code={mode === "encrypt"}
                    value={output}
                    readOnly
                    placeholder={busy ? t("working") : UI_STRINGS.outputHere[locale]}
                    className="min-h-48 break-all"
                    actions={<CopyButton text={output} locale={locale} compact />}
                    data-tool-output=""
                />
            </div>
            {error && <ErrorMessage error={error} locale={locale} />}
            <p className="text-xs text-muted">{t("note")}</p>
        </div>
    );
}
