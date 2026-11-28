import { useMemo, useState } from "react";
import { toToolError, type ToolResult } from "@handyweb/core/runtime";
import {
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
import { jsonToYaml, yamlToJson, type Direction } from "./logic";

export default function JsonYaml({ locale, presetOptions }: ToolUiProps) {
    const [direction, setDirection] = useState<Direction>(
        presetOptions?.["direction"] === "yaml-to-json" ? "yaml-to-json" : "json-to-yaml",
    );
    const [input, setInput] = useState("");
    const t = (key: keyof typeof strings) => strings[key][locale];

    const result = useMemo((): ToolResult<string> | null => {
        if (input.trim() === "") return null;
        try {
            return {
                ok: true,
                value: direction === "json-to-yaml" ? jsonToYaml(input) : yamlToJson(input, 2),
            };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [input, direction]);
    const output = result?.ok ? result.value : "";

    const swap = () => {
        if (!result?.ok) return;
        setInput(output);
        setDirection(direction === "json-to-yaml" ? "yaml-to-json" : "json-to-yaml");
    };

    return (
        <div className="flex flex-col gap-6">
            <Segmented<Direction>
                legend={t("direction")}
                value={direction}
                onChange={setDirection}
                options={[
                    { value: "json-to-yaml", label: t("jsonToYaml") },
                    { value: "yaml-to-json", label: t("yamlToJson") },
                ]}
            />
            <div className="grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr]">
                <Pane
                    label={`${UI_STRINGS.input[locale]}: ${direction === "json-to-yaml" ? "JSON" : "YAML"}`}
                    locale={locale}
                    code
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder={UI_STRINGS.inputHere[locale]}
                    className="min-h-72"
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
                        disabled={!result?.ok}
                        aria-label={t("swap")}
                        title={t("swap")}
                        className="grid size-11 place-items-center rounded-full border border-border bg-surface text-muted transition-[color,transform,border-color] duration-200 hover:border-focus hover:text-text active:scale-95 disabled:opacity-40"
                    >
                        <Icon name="swap" className="size-4 rotate-90 lg:rotate-0" />
                    </button>
                </div>
                <Pane
                    label={`${UI_STRINGS.output[locale]}: ${direction === "json-to-yaml" ? "YAML" : "JSON"}`}
                    locale={locale}
                    code
                    value={output}
                    readOnly
                    placeholder={UI_STRINGS.outputHere[locale]}
                    className="min-h-72"
                    actions={<CopyButton text={output} locale={locale} compact />}
                    data-tool-output=""
                />
            </div>
            {result && !result.ok && <ErrorMessage error={result.error} locale={locale} />}
        </div>
    );
}
