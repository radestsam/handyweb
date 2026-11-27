import { useMemo, useState } from "react";
import type { LocalizedText } from "@handyweb/core";
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
import { formatCode, type Beautifier, type Indent } from "./logic";

const STRINGS = {
    indent: { fa: "تورفتگی", en: "Indent" },
    spaces2: { fa: "۲ اسپیس", en: "2 spaces" },
    spaces4: { fa: "۴ اسپیس", en: "4 spaces" },
    tab: { fa: "Tab", en: "Tab" },
    emptyLines: { fa: "خط‌های خالی", en: "Empty lines" },
    keepOne: { fa: "تا یکی", en: "Keep one" },
    removeAll: { fa: "پاک کردن", en: "Remove" },
    tooLarge: { fa: "ورودی بیش از ۲ مگابایت است.", en: "The input is larger than 2 MB." },
} as const satisfies Record<string, LocalizedText>;

const MAX = 2_000_000;

/** The shared UI of the HTML, CSS, and JavaScript formatters. */
export function FormatterTool({ locale, beautify }: ToolUiProps & { beautify: Beautifier }) {
    const [indent, setIndent] = useState<Indent>("2");
    const [emptyLines, setEmptyLines] = useState<"1" | "0">("1");
    const [text, setText] = useState("");
    const t = (key: keyof typeof STRINGS) => STRINGS[key][locale];

    const result = useMemo((): ToolResult<string> | null => {
        if (text.trim() === "") return null;
        if (text.length > MAX)
            return { ok: false, error: { code: "too-large", message: STRINGS.tooLarge } };
        try {
            return {
                ok: true,
                value: formatCode(text, beautify, { indent, maxEmptyLines: Number(emptyLines) }),
            };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [text, indent, emptyLines, beautify]);
    const output = result?.ok ? result.value : "";

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
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
                <Segmented<"1" | "0">
                    legend={t("emptyLines")}
                    value={emptyLines}
                    onChange={setEmptyLines}
                    options={[
                        { value: "1", label: t("keepOne") },
                        { value: "0", label: t("removeAll") },
                    ]}
                />
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
                <Pane
                    label={UI_STRINGS.input[locale]}
                    locale={locale}
                    code
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder={UI_STRINGS.inputHere[locale]}
                    className="min-h-80"
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
                <Pane
                    label={UI_STRINGS.output[locale]}
                    locale={locale}
                    code
                    value={output}
                    readOnly
                    placeholder={UI_STRINGS.outputHere[locale]}
                    className="min-h-80"
                    actions={<CopyButton text={output} locale={locale} compact />}
                    data-tool-output=""
                />
            </div>
            {result && !result.ok && <ErrorMessage error={result.error} locale={locale} />}
        </div>
    );
}
