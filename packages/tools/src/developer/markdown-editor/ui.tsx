import { useDeferredValue, useMemo, useState } from "react";
import { downloadBlob } from "@handyweb/core/files";
import {
    Button,
    Checkbox,
    CopyButton,
    Pane,
    PaneAction,
    PasteButton,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { buildSrcdoc } from "../html-preview/logic";
import { strings } from "./i18n";
import { htmlDocument, markdownToHtml } from "./logic";

export default function MarkdownEditor({ locale }: ToolUiProps) {
    const [markdown, setMarkdown] = useState("");
    const [rtl, setRtl] = useState(locale === "fa");
    const t = (key: keyof typeof strings) => strings[key][locale];
    const deferred = useDeferredValue(markdown);
    const html = useMemo(() => markdownToHtml(deferred), [deferred]);
    const style = `<style>body{font-family:system-ui,sans-serif;line-height:1.7;padding:8px 12px;margin:0}img{max-width:100%}table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:4px 8px}pre{background:#f4f4f4;padding:8px;overflow:auto}</style>`;
    const title = /^#\s+(.+)$/m.exec(deferred)?.[1] ?? "document";

    return (
        <div className="flex flex-col gap-5">
            <Checkbox label={t("rtl")} checked={rtl} onChange={setRtl} />
            <div className="grid gap-3 lg:grid-cols-2">
                <Pane
                    label={t("markdown")}
                    locale={locale}
                    value={markdown}
                    onChange={(event) => setMarkdown(event.target.value)}
                    placeholder={UI_STRINGS.inputHere[locale]}
                    className="min-h-96"
                    actions={
                        <>
                            <PasteButton locale={locale} onPaste={setMarkdown} />
                            <PaneAction
                                icon="clear"
                                label={UI_STRINGS.clear[locale]}
                                onClick={() => setMarkdown("")}
                                disabled={markdown === ""}
                            />
                        </>
                    }
                    data-tool-input=""
                />
                <section className="flex min-h-96 flex-col overflow-hidden rounded-2xl border border-border bg-bg">
                    <div className="flex min-h-11 items-center justify-between gap-2 border-b border-border/70 ps-4 pe-1.5">
                        <h2 className="text-xs font-semibold text-muted">{t("preview")}</h2>
                        <span className="flex items-center gap-1 text-xs">
                            {t("copyHtml")}
                            <CopyButton text={html} locale={locale} compact />
                        </span>
                    </div>
                    <iframe
                        title={t("preview")}
                        sandbox=""
                        srcDoc={buildSrcdoc(style + html, { scripts: false, rtl })}
                        referrerPolicy="no-referrer"
                        className="min-h-80 w-full flex-1 bg-white"
                        data-tool-frame=""
                    />
                </section>
            </div>
            <div className="flex flex-wrap gap-2">
                <Button
                    variant="primary"
                    onClick={() =>
                        downloadBlob(
                            new Blob([htmlDocument(html, title, rtl)], { type: "text/html" }),
                            `${title}.html`,
                        )
                    }
                    disabled={markdown === ""}
                >
                    {t("downloadHtml")}
                </Button>
                <Button
                    onClick={() =>
                        downloadBlob(new Blob([markdown], { type: "text/markdown" }), `${title}.md`)
                    }
                    disabled={markdown === ""}
                >
                    {t("downloadMd")}
                </Button>
            </div>
            <p className="text-xs text-muted">{t("note")}</p>
            <input type="hidden" value={html} readOnly data-tool-output="" />
        </div>
    );
}
