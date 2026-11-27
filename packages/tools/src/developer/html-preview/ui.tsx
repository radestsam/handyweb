import { useDeferredValue, useState } from "react";
import {
    Checkbox,
    Pane,
    PaneAction,
    PasteButton,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { strings } from "./i18n";
import { buildSrcdoc, sandboxTokens } from "./logic";

export default function HtmlPreview({ locale }: ToolUiProps) {
    const [html, setHtml] = useState("");
    const [scripts, setScripts] = useState(false);
    const [rtl, setRtl] = useState(locale === "fa");
    const t = (key: keyof typeof strings) => strings[key][locale];
    const deferred = useDeferredValue(html);
    const options = { scripts, rtl };
    const srcdoc = buildSrcdoc(deferred, options);

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-x-6 gap-y-1">
                <Checkbox label={t("scripts")} checked={scripts} onChange={setScripts} />
                <Checkbox label={t("rtl")} checked={rtl} onChange={setRtl} />
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
                <Pane
                    label={t("html")}
                    locale={locale}
                    code
                    value={html}
                    onChange={(event) => setHtml(event.target.value)}
                    placeholder={UI_STRINGS.inputHere[locale]}
                    className="min-h-96"
                    actions={
                        <>
                            <PasteButton locale={locale} onPaste={setHtml} />
                            <PaneAction
                                icon="clear"
                                label={UI_STRINGS.clear[locale]}
                                onClick={() => setHtml("")}
                                disabled={html === ""}
                            />
                        </>
                    }
                    data-tool-input=""
                />
                <section className="flex min-h-96 flex-col overflow-hidden rounded-2xl border border-border bg-bg">
                    <h2 className="border-b border-border/70 px-4 py-2.5 text-xs font-semibold text-muted">
                        {t("preview")}
                    </h2>
                    <iframe
                        // The key resets the frame when the sandbox changes, because browsers read it only once.
                        key={sandboxTokens(options)}
                        title={t("preview")}
                        sandbox={sandboxTokens(options)}
                        srcDoc={srcdoc}
                        referrerPolicy="no-referrer"
                        className="min-h-80 w-full flex-1 bg-white"
                        data-tool-frame=""
                    />
                </section>
            </div>
            <p className="text-xs text-muted">{t("note")}</p>
            <input type="hidden" value={deferred} readOnly data-tool-output="" />
        </div>
    );
}
