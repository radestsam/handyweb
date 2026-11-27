import { useMemo, useState } from "react";
import { toToolError, type ToolError } from "@handyweb/core/runtime";
import {
    Checkbox,
    CopyButton,
    ErrorMessage,
    Icon,
    Ltr,
    Pane,
    PaneAction,
    PasteButton,
    Segmented,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { unicodeEscapeMeta } from "./meta";
import { strings } from "./i18n";
import { ESCAPE_FORMATS, escapeText, unescapeText, type EscapeFormat } from "./logic";

type Mode = "encode" | "decode";

const DECODE_FORMS = "\\u0633  \\u{633}  \\U0001F600  \\x41  U+0633";

const MAX = unicodeEscapeMeta.limits?.maxInputBytes ?? Infinity;

export default function UnicodeEscape({ locale, presetOptions }: ToolUiProps) {
    const [mode, setMode] = useState<Mode>(
        presetOptions?.["mode"] === "decode" ? "decode" : "encode",
    );
    const [format, setFormat] = useState<EscapeFormat>("js");
    const [all, setAll] = useState(false);
    const [input, setInput] = useState("");
    const t = (key: keyof typeof strings) => strings[key][locale];

    const result = useMemo((): { output: string; error: ToolError | null } => {
        if (input === "") return { output: "", error: null };
        if (input.length > MAX) {
            return {
                output: "",
                error: {
                    code: "too-large",
                    message: {
                        fa: "ورودی بیش از ۵ مگابایت است.",
                        en: "The input is larger than 5 MB.",
                    },
                },
            };
        }
        try {
            const output =
                mode === "encode" ? escapeText(input, { format, all }) : unescapeText(input);
            return { output, error: null };
        } catch (error) {
            return { output: "", error: toToolError(error) };
        }
    }, [input, mode, format, all]);

    const swap = () => {
        if (result.error || result.output === "") return;
        setInput(result.output);
        setMode(mode === "encode" ? "decode" : "encode");
    };

    const inputLabel = mode === "encode" ? t("text") : t("escaped");
    const outputLabel = mode === "encode" ? t("escaped") : t("text");

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
                    <Segmented<EscapeFormat>
                        legend={t("format")}
                        value={format}
                        onChange={setFormat}
                        options={ESCAPE_FORMATS.map((value) => ({ value, label: t(value) }))}
                    />
                )}
                {mode === "encode" && format !== "codepoint" && (
                    <div className="pb-1">
                        <Checkbox label={t("all")} checked={all} onChange={setAll} />
                    </div>
                )}
            </div>
            {mode === "decode" && (
                <p className="-mt-3 text-sm text-muted">
                    {t("decodeHint")}{" "}
                    <Ltr as="code" className="font-mono">
                        {DECODE_FORMS}
                    </Ltr>
                </p>
            )}

            <div className="grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr]">
                <Pane
                    label={`${UI_STRINGS.input[locale]}: ${inputLabel}`}
                    locale={locale}
                    code={mode === "decode"}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder={UI_STRINGS.inputHere[locale]}
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
                    label={`${UI_STRINGS.output[locale]}: ${outputLabel}`}
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
