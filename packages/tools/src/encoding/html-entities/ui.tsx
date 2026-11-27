import { useMemo, useState } from "react";
import type { ToolError } from "@handyweb/core/runtime";
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
import { htmlEntitiesMeta } from "./meta";
import { strings } from "./i18n";
import { decodeEntities, encodeEntities, type NumericFormat } from "./logic";

type Mode = "encode" | "decode";

const MAX = htmlEntitiesMeta.limits?.maxInputBytes ?? Infinity;

export default function HtmlEntities({ locale, presetOptions }: ToolUiProps) {
    const [mode, setMode] = useState<Mode>(
        presetOptions?.["mode"] === "decode" ? "decode" : "encode",
    );
    const [nonAscii, setNonAscii] = useState(false);
    const [format, setFormat] = useState<NumericFormat>("decimal");
    const [input, setInput] = useState("");
    const t = (key: keyof typeof strings) => strings[key][locale];

    const tooLarge = input.length > MAX;
    const output = useMemo(() => {
        if (tooLarge) return "";
        return mode === "encode"
            ? encodeEntities(input, { nonAscii, format })
            : decodeEntities(input);
    }, [input, mode, nonAscii, format, tooLarge]);

    const error: ToolError | null = tooLarge
        ? {
              code: "too-large",
              message: { fa: "ورودی بیش از ۵ مگابایت است.", en: "The input is larger than 5 MB." },
          }
        : null;

    const swap = () => {
        if (output === "") return;
        setInput(output);
        setMode(mode === "encode" ? "decode" : "encode");
    };

    const inputLabel = mode === "encode" ? t("text") : t("html");
    const outputLabel = mode === "encode" ? t("html") : t("text");

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
                    <div className="pb-1">
                        <Checkbox label={t("nonAscii")} checked={nonAscii} onChange={setNonAscii} />
                    </div>
                )}
                {mode === "encode" && nonAscii && (
                    <Segmented<NumericFormat>
                        legend={t("format")}
                        value={format}
                        onChange={setFormat}
                        options={[
                            { value: "decimal", label: t("decimal") },
                            { value: "hex", label: t("hex") },
                        ]}
                    />
                )}
            </div>
            {mode === "encode" && <p className="-mt-3 text-sm text-muted">{t("encodeHint")}</p>}

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
                        disabled={output === ""}
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
                    value={output}
                    readOnly
                    placeholder={UI_STRINGS.outputHere[locale]}
                    actions={<CopyButton text={output} locale={locale} compact />}
                    data-tool-output=""
                />
            </div>

            {error && <ErrorMessage error={error} locale={locale} />}
        </div>
    );
}
