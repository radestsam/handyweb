import { useMemo, useState } from "react";
import type { ToolError } from "@handyweb/core/runtime";
import { toToolError } from "@handyweb/core/runtime";
import {
    Checkbox,
    CopyButton,
    ErrorMessage,
    Icon,
    Pane,
    PaneAction,
    PasteButton,
    Segmented,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { base64Meta } from "./meta";
import { strings } from "./i18n";
import { decodeBase64, encodeBase64 } from "./logic";

type Mode = "encode" | "decode";

const MAX_BYTES = base64Meta.limits?.maxInputBytes ?? Infinity;

export default function Base64Tool({ locale, presetOptions }: ToolUiProps) {
    const initialMode: Mode = presetOptions?.["mode"] === "decode" ? "decode" : "encode";
    const [mode, setMode] = useState<Mode>(initialMode);
    const [input, setInput] = useState("");
    const [urlSafe, setUrlSafe] = useState(false);
    const [padding, setPadding] = useState(true);
    const t = (key: keyof typeof strings) => strings[key][locale];

    // The conversion is fast and runs on every change. Above the size limit it
    // stops and asks for a smaller input instead of freezing the page.
    const result = useMemo((): { output: string; error: ToolError | null } => {
        if (input === "") return { output: "", error: null };
        if (input.length > MAX_BYTES) {
            return { output: "", error: { code: "too-large", message: strings.tooLarge } };
        }
        try {
            const output =
                mode === "encode" ? encodeBase64(input, { urlSafe, padding }) : decodeBase64(input);
            return { output, error: null };
        } catch (error) {
            return { output: "", error: toToolError(error) };
        }
    }, [input, mode, urlSafe, padding]);

    const swap = () => {
        if (result.error || result.output === "") return;
        setInput(result.output);
        setMode(mode === "encode" ? "decode" : "encode");
    };

    const textLabel = t("textInput");
    const codeLabel = t("base64Input");

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
                    <div className="flex flex-wrap gap-x-5 gap-y-1 pb-1">
                        <Checkbox label={t("urlSafe")} checked={urlSafe} onChange={setUrlSafe} />
                        <Checkbox label={t("padding")} checked={padding} onChange={setPadding} />
                    </div>
                )}
            </div>

            <div className="grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr]">
                <Pane
                    label={`${UI_STRINGS.input[locale]}: ${mode === "encode" ? textLabel : codeLabel}`}
                    locale={locale}
                    code={mode === "decode"}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder={UI_STRINGS.inputHere[locale]}
                    meta={mode === "decode" ? <span>{t("decodeHint")}</span> : undefined}
                    actions={
                        <>
                            <PasteButton locale={locale} onPaste={setInput} />
                            <PaneAction
                                icon="clear"
                                label={UI_STRINGS.clear[locale]}
                                onClick={() => setInput("")}
                                disabled={input === ""}
                            />
                        </>
                    }
                    data-tool-input=""
                />
                <div className="flex items-center justify-center">
                    <button
                        type="button"
                        onClick={swap}
                        disabled={result.error !== null || result.output === ""}
                        aria-label={t("swap")}
                        title={t("swap")}
                        className="grid size-11 place-items-center rounded-full border border-border bg-surface text-muted transition-[color,transform,border-color] duration-200 hover:border-focus hover:text-text active:scale-95 disabled:opacity-40"
                    >
                        <Icon name="swap" className="size-4 rotate-90 lg:rotate-0" />
                    </button>
                </div>
                <Pane
                    label={`${UI_STRINGS.output[locale]}: ${mode === "encode" ? codeLabel : textLabel}`}
                    locale={locale}
                    code={mode === "encode"}
                    value={result.output}
                    readOnly
                    placeholder={UI_STRINGS.outputHere[locale]}
                    actions={<CopyButton text={result.output} locale={locale} compact />}
                    data-tool-output=""
                />
            </div>

            {result.error && <ErrorMessage error={result.error} locale={locale} />}
        </div>
    );
}
