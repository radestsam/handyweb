import { useMemo, useState } from "react";
import type { LocalizedText } from "@handyweb/core";
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
import { decodeBytes, encodeBytes, type Radix, type Separator } from "./logic";

const STRINGS = {
    mode: { fa: "کار", en: "Action" },
    encode: { fa: "نوشته به بایت", en: "Text to bytes" },
    decode: { fa: "بایت به نوشته", en: "Bytes to text" },
    separator: { fa: "جداکننده", en: "Separator" },
    space: { fa: "اسپیس", en: "Space" },
    none: { fa: "هیچ", en: "None" },
    colon: { fa: ":", en: ":" },
    comma: { fa: "،", en: "," },
    prefix: { fa: "پیشوند 0x", en: "0x prefix" },
    uppercase: { fa: "حروف بزرگ", en: "Uppercase" },
    text: { fa: "نوشته", en: "Text" },
    swap: { fa: "جابه‌جایی ورودی و خروجی", en: "Swap input and output" },
    tooLarge: { fa: "ورودی بیش از ۵ مگابایت است.", en: "The input is larger than 5 MB." },
} as const satisfies Record<string, LocalizedText>;

type Mode = "encode" | "decode";

/** The shared UI of the hex and binary tools. */
export function ByteCodecTool({
    locale,
    presetOptions,
    radix,
    name,
}: ToolUiProps & { radix: Radix; name: LocalizedText }) {
    const [mode, setMode] = useState<Mode>(
        presetOptions?.["mode"] === "decode" ? "decode" : "encode",
    );
    const [separator, setSeparator] = useState<Separator>("space");
    const [prefix, setPrefix] = useState(false);
    const [uppercase, setUppercase] = useState(radix === 16);
    const [input, setInput] = useState("");
    const t = (key: keyof typeof STRINGS) => STRINGS[key][locale];

    const result = useMemo((): ToolResult<string> => {
        if (input === "") return { ok: true, value: "" };
        if (input.length > 5_000_000)
            return { ok: false, error: { code: "too-large", message: STRINGS.tooLarge } };
        try {
            return {
                ok: true,
                value:
                    mode === "encode"
                        ? encodeBytes(input, radix, { separator, prefix, uppercase })
                        : decodeBytes(input, radix),
            };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [input, mode, radix, separator, prefix, uppercase]);
    const output = result.ok ? result.value : "";
    const swap = () => {
        if (!result.ok || output === "") return;
        setInput(output);
        setMode(mode === "encode" ? "decode" : "encode");
    };

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
                    <Segmented<Separator>
                        legend={t("separator")}
                        value={separator}
                        onChange={setSeparator}
                        options={(["space", "none", "colon", "comma"] as const).map((value) => ({
                            value,
                            label: t(value),
                        }))}
                    />
                )}
                {mode === "encode" && radix === 16 && (
                    <div className="flex flex-wrap gap-x-5 gap-y-1 pb-1">
                        <Checkbox
                            label={t("uppercase")}
                            checked={uppercase}
                            onChange={setUppercase}
                        />
                        <Checkbox label={t("prefix")} checked={prefix} onChange={setPrefix} />
                    </div>
                )}
            </div>
            <div className="grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr]">
                <Pane
                    label={`${UI_STRINGS.input[locale]}: ${mode === "encode" ? t("text") : name[locale]}`}
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
                        disabled={!result.ok || output === ""}
                        aria-label={t("swap")}
                        title={t("swap")}
                        className="grid size-11 place-items-center rounded-full border border-border bg-surface text-muted transition-[color,transform,border-color] duration-200 hover:border-focus hover:text-text active:scale-95 disabled:opacity-40"
                    >
                        <Icon name="swap" className="size-4 rotate-90 lg:rotate-0" />
                    </button>
                </div>
                <Pane
                    label={`${UI_STRINGS.output[locale]}: ${mode === "encode" ? name[locale] : t("text")}`}
                    locale={locale}
                    code={mode === "encode"}
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
