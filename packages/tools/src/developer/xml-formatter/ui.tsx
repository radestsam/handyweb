import { useMemo, useState } from "react";
import { toToolError, type ToolResult } from "@handyweb/core/runtime";
import {
    CopyButton,
    ErrorMessage,
    Pane,
    PaneAction,
    PasteButton,
    Segmented,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { xmlFormatterMeta } from "./meta";
import { strings, wellFormed } from "./i18n";
import { processXml, type Action, type Indent, type XmlOutput } from "./logic";

const MAX = xmlFormatterMeta.limits?.maxInputBytes ?? Infinity;

export default function XmlFormatter({ locale, presetOptions }: ToolUiProps) {
    const preset = presetOptions?.["action"];
    const [action, setAction] = useState<Action>(
        preset === "validate" || preset === "minify" ? preset : "format",
    );
    const [indent, setIndent] = useState<Indent>("2");
    const [text, setText] = useState("");
    const t = (key: keyof typeof strings) => strings[key][locale];

    // DOMParser does not exist in a worker, so the parse runs on the page. The
    // size limit keeps it short.
    const result = useMemo((): ToolResult<XmlOutput> | null => {
        if (text === "") return null;
        if (text.length > MAX) {
            return { ok: false, error: { code: "too-large", message: strings.tooLarge } };
        }
        try {
            return { ok: true, value: processXml({ text, action, indent }) };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [text, action, indent]);

    const output = result?.ok ? result.value.text : "";
    const status = result?.ok ? (
        <span className="font-semibold text-success" data-tool-status="valid">
            ✓ {wellFormed(result.value.root, result.value.elements, locale)}
        </span>
    ) : null;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                <Segmented<Action>
                    legend={t("action")}
                    value={action}
                    onChange={setAction}
                    options={[
                        { value: "format", label: t("format") },
                        { value: "minify", label: t("minify") },
                        { value: "validate", label: t("validate") },
                    ]}
                />
                {action === "format" && (
                    <Segmented<Indent>
                        legend={t("indent")}
                        value={indent}
                        onChange={setIndent}
                        options={[
                            { value: "2", label: t("spaces2") },
                            { value: "4", label: t("spaces4") },
                            { value: "tab", label: t("tab") },
                        ]}
                    />
                )}
            </div>

            <div className={action === "validate" ? "grid gap-3" : "grid gap-3 lg:grid-cols-2"}>
                <Pane
                    label={UI_STRINGS.input[locale]}
                    locale={locale}
                    code
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder={UI_STRINGS.inputHere[locale]}
                    className="min-h-80"
                    meta={action === "validate" ? status : undefined}
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
                {action !== "validate" && (
                    <Pane
                        label={UI_STRINGS.output[locale]}
                        locale={locale}
                        code
                        value={output}
                        readOnly
                        placeholder={UI_STRINGS.outputHere[locale]}
                        className="min-h-80"
                        meta={status}
                        actions={<CopyButton text={output} locale={locale} compact />}
                        data-tool-output=""
                    />
                )}
            </div>

            {result && !result.ok && <ErrorMessage error={result.error} locale={locale} />}
        </div>
    );
}
