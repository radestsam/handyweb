import { useMemo, useState } from "react";
import { toToolError, type ToolResult } from "@handyweb/core/runtime";
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
import { strings } from "./i18n";
import { escapeJsonString, unescapeJsonString } from "./logic";

type Mode = "escape" | "unescape";

export default function JsonString({ locale, presetOptions }: ToolUiProps) {
    const [mode, setMode] = useState<Mode>(
        presetOptions?.["mode"] === "unescape" ? "unescape" : "escape",
    );
    const [asciiOnly, setAsciiOnly] = useState(false);
    const [quotes, setQuotes] = useState(false);
    const [input, setInput] = useState("");
    const t = (key: keyof typeof strings) => strings[key][locale];

    const result = useMemo((): ToolResult<string> => {
        if (input === "") return { ok: true, value: "" };
        try {
            return {
                ok: true,
                value:
                    mode === "escape"
                        ? escapeJsonString(input, { asciiOnly, quotes })
                        : unescapeJsonString(input),
            };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [input, mode, asciiOnly, quotes]);
    const output = result.ok ? result.value : "";

    const swap = () => {
        if (!result.ok || output === "") return;
        setInput(output);
        setMode(mode === "escape" ? "unescape" : "escape");
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                <Segmented<Mode>
                    legend={t("mode")}
                    value={mode}
                    onChange={setMode}
                    options={[
                        { value: "escape", label: t("escape") },
                        { value: "unescape", label: t("unescape") },
                    ]}
                />
                {mode === "escape" && (
                    <div className="flex flex-wrap gap-x-5 gap-y-1 pb-1">
                        <Checkbox
                            label={t("asciiOnly")}
                            checked={asciiOnly}
                            onChange={setAsciiOnly}
                        />
                        <Checkbox label={t("quotes")} checked={quotes} onChange={setQuotes} />
                    </div>
                )}
            </div>
            <div className="grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr]">
                <Pane
                    label={`${UI_STRINGS.input[locale]}: ${mode === "escape" ? t("text") : t("json")}`}
                    locale={locale}
                    code={mode === "unescape"}
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
                        disabled={!result.ok || output === ""}
                        aria-label={t("swap")}
                        title={t("swap")}
                        className="grid size-11 place-items-center rounded-full border border-border bg-surface text-muted transition-[color,transform,border-color] duration-200 hover:border-focus hover:text-text active:scale-95 disabled:opacity-40"
                    >
                        <Icon name="swap" className="size-4 rotate-90 lg:rotate-0" />
                    </button>
                </div>
                <Pane
                    label={`${UI_STRINGS.output[locale]}: ${mode === "escape" ? t("json") : t("text")}`}
                    locale={locale}
                    code={mode === "escape"}
                    value={output}
                    readOnly
                    placeholder={UI_STRINGS.outputHere[locale]}
                    actions={<CopyButton text={output} locale={locale} compact />}
                    data-tool-output=""
                />
            </div>
            {!result.ok && <ErrorMessage error={result.error} locale={locale} />}
        </div>
    );
}
