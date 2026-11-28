import { useState } from "react";
import {
    Checkbox,
    CopyButton,
    Ltr,
    Pane,
    PaneAction,
    PasteButton,
    Segmented,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { strings } from "./i18n";
import { eui64, formatMany, parseMac, type Style } from "./logic";

export default function MacFormatter({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const [text, setText] = useState("");
    const [style, setStyle] = useState<Style>("colon");
    const [upper, setUpper] = useState(true);
    const rows = formatMany(text, style, upper);
    const output = rows.map((row) => row.output ?? `# ${row.input} (${t("invalid")})`).join("\n");
    let first = null;
    const firstValid = rows.find((row) => row.output);
    if (firstValid) first = parseMac(firstValid.input);

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
                <Segmented<Style>
                    legend={t("style")}
                    value={style}
                    onChange={setStyle}
                    options={[
                        { value: "colon", label: "00:1A:2B" },
                        { value: "hyphen", label: "00-1A-2B" },
                        { value: "dot", label: "001A.2B3C" },
                        { value: "plain", label: t("plain") },
                    ]}
                />
                <Checkbox label={t("upper")} checked={upper} onChange={setUpper} />
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
                <Pane
                    label={t("input")}
                    locale={locale}
                    code
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="00-1a-2b-3c-4d-5e"
                    className="min-h-40"
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
                    label={t("output")}
                    locale={locale}
                    code
                    value={output}
                    readOnly
                    placeholder={UI_STRINGS.outputHere[locale]}
                    className="min-h-40"
                    actions={<CopyButton text={output} locale={locale} compact />}
                    data-tool-output=""
                />
            </div>
            {first && (
                <section className="overflow-hidden rounded-2xl border border-border bg-bg">
                    <h2 className="border-b border-border/70 px-4 py-2.5 text-sm font-semibold">
                        {t("about")}
                    </h2>
                    <dl className="divide-y divide-border/50 text-sm">
                        <div className="flex flex-col gap-0.5 px-4 py-2 sm:flex-row sm:gap-3">
                            <dt className="text-xs text-muted sm:w-48">{t("kind")}</dt>
                            <dd data-mac="kind">
                                {first.broadcast
                                    ? t("broadcast")
                                    : first.multicast
                                      ? t("multicast")
                                      : t("unicast")}
                            </dd>
                        </div>
                        <div className="flex flex-col gap-0.5 px-4 py-2 sm:flex-row sm:gap-3">
                            <dt className="text-xs text-muted sm:w-48">{t("origin")}</dt>
                            <dd data-mac="origin">{first.local ? t("local") : t("global")}</dd>
                        </div>
                        <div className="flex flex-col gap-0.5 px-4 py-2 sm:flex-row sm:gap-3">
                            <dt className="text-xs text-muted sm:w-48">{t("oui")}</dt>
                            <dd>
                                <Ltr as="code" className="font-mono">
                                    {first.oui}
                                </Ltr>
                            </dd>
                        </div>
                        <div className="flex flex-col gap-0.5 px-4 py-2 sm:flex-row sm:gap-3">
                            <dt className="text-xs text-muted sm:w-48">{t("eui64")}</dt>
                            <dd>
                                <Ltr as="code" className="font-mono">
                                    {eui64(first.bytes)}
                                </Ltr>
                            </dd>
                        </div>
                    </dl>
                </section>
            )}
            <p className="text-xs text-muted">{t("note")}</p>
        </div>
    );
}
