import { useMemo, useState } from "react";
import { downloadBlob } from "@handyweb/core/files";
import { toToolError, type ToolResult } from "@handyweb/core/runtime";
import {
    Button,
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
import { jsonCsvMeta } from "./meta";
import { strings } from "./i18n";
import { csvToJson, jsonToCsv, type Delimiter } from "./logic";

type Direction = "json-to-csv" | "csv-to-json";
type DelimiterChoice = "auto" | "comma" | "semicolon" | "tab";
const DELIMITERS: Record<Exclude<DelimiterChoice, "auto">, Delimiter> = {
    comma: ",",
    semicolon: ";",
    tab: "\t",
};
const MAX = jsonCsvMeta.limits?.maxInputBytes ?? Infinity;

export default function JsonCsv({ locale, presetOptions }: ToolUiProps) {
    const [direction, setDirection] = useState<Direction>(
        presetOptions?.["direction"] === "csv-to-json" ? "csv-to-json" : "json-to-csv",
    );
    const [delimiter, setDelimiter] = useState<DelimiterChoice>("comma");
    const [readDelimiter, setReadDelimiter] = useState<DelimiterChoice>("auto");
    const [flatten, setFlatten] = useState(false);
    const [header, setHeader] = useState(true);
    const [types, setTypes] = useState(true);
    const [bom, setBom] = useState(true);
    const [input, setInput] = useState("");
    const t = (key: keyof typeof strings) => strings[key][locale];

    const result = useMemo((): ToolResult<string> | null => {
        if (input.trim() === "") return null;
        if (input.length > MAX) {
            return {
                ok: false,
                error: {
                    code: "too-large",
                    message: {
                        fa: "ورودی بیش از ۱۰ مگابایت است.",
                        en: "The input is larger than 10 MB.",
                    },
                },
            };
        }
        try {
            return {
                ok: true,
                value:
                    direction === "json-to-csv"
                        ? jsonToCsv(input, {
                              delimiter: DELIMITERS[delimiter === "auto" ? "comma" : delimiter],
                              flatten,
                          })
                        : csvToJson(input, {
                              delimiter:
                                  readDelimiter === "auto" ? "auto" : DELIMITERS[readDelimiter],
                              header,
                              types,
                          }),
            };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [input, direction, delimiter, readDelimiter, flatten, header, types]);
    const output = result?.ok ? result.value : "";

    const save = () => {
        if (direction === "json-to-csv") {
            downloadBlob(
                new Blob([bom ? `\uFEFF${output}` : output], { type: "text/csv;charset=utf-8" }),
                "data.csv",
            );
        } else {
            downloadBlob(new Blob([output], { type: "application/json" }), "data.json");
        }
    };

    const delimiterOptions = (withAuto: boolean) =>
        (withAuto
            ? (["auto", "comma", "semicolon", "tab"] as const)
            : (["comma", "semicolon", "tab"] as const)
        ).map((value) => ({ value, label: t(value) }));

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                <Segmented<Direction>
                    legend={t("direction")}
                    value={direction}
                    onChange={setDirection}
                    options={[
                        { value: "json-to-csv", label: t("jsonToCsv") },
                        { value: "csv-to-json", label: t("csvToJson") },
                    ]}
                />
                {direction === "json-to-csv" ? (
                    <Segmented<DelimiterChoice>
                        legend={t("delimiter")}
                        value={delimiter}
                        onChange={setDelimiter}
                        options={delimiterOptions(false)}
                    />
                ) : (
                    <Segmented<DelimiterChoice>
                        legend={t("delimiter")}
                        value={readDelimiter}
                        onChange={setReadDelimiter}
                        options={delimiterOptions(true)}
                    />
                )}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
                {direction === "json-to-csv" ? (
                    <Checkbox label={t("flatten")} checked={flatten} onChange={setFlatten} />
                ) : (
                    <>
                        <Checkbox label={t("header")} checked={header} onChange={setHeader} />
                        <Checkbox label={t("types")} checked={types} onChange={setTypes} />
                    </>
                )}
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
                <Pane
                    label={`${UI_STRINGS.input[locale]}: ${direction === "json-to-csv" ? "JSON" : "CSV"}`}
                    locale={locale}
                    code
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder={UI_STRINGS.inputHere[locale]}
                    className="min-h-72"
                    wrap="off"
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
                <Pane
                    label={`${UI_STRINGS.output[locale]}: ${direction === "json-to-csv" ? "CSV" : "JSON"}`}
                    locale={locale}
                    code
                    value={output}
                    readOnly
                    wrap="off"
                    placeholder={UI_STRINGS.outputHere[locale]}
                    className="min-h-72"
                    actions={<CopyButton text={output} locale={locale} compact />}
                    data-tool-output=""
                />
            </div>
            {result && !result.ok && <ErrorMessage error={result.error} locale={locale} />}
            {result?.ok && (
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <Button variant="primary" onClick={save}>
                        {t("download")}
                    </Button>
                    {direction === "json-to-csv" && (
                        <Checkbox label={t("bom")} checked={bom} onChange={setBom} />
                    )}
                </div>
            )}
        </div>
    );
}
