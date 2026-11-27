import { useId, useMemo, useState } from "react";
import { Button, CopyButton, Ltr, type ToolUiProps } from "@handyweb/core/ui";
import { deviceLabels, strings } from "./i18n";
import { parseUserAgent } from "./logic";

export default function UserAgentParser({ locale }: ToolUiProps) {
    const [text, setText] = useState("");
    const inputId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];
    const agent = useMemo(() => (text.trim() === "" ? null : parseUserAgent(text)), [text]);
    const join = (...parts: Array<string | null>) =>
        parts.filter(Boolean).join(" ") || t("unknownValue");
    const rows = agent
        ? ([
              ["browser", join(agent.browser, agent.browserVersion)],
              ["engine", join(agent.engine)],
              ["os", join(agent.os, agent.osVersion)],
              ["device", deviceLabels[agent.device]?.[locale] ?? agent.device],
              ...(agent.bot ? [["bot", agent.bot]] : []),
          ] as Array<[keyof typeof strings, string]>)
        : [];
    const summary = rows.map(([key, value]) => `${strings[key].en}: ${value}`).join("\n");

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
                <label htmlFor={inputId} className="text-xs font-semibold text-muted">
                    {t("ua")}
                </label>
                <textarea
                    id={inputId}
                    dir="ltr"
                    rows={3}
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    spellCheck={false}
                    autoComplete="off"
                    className="w-full resize-y rounded-xl border border-border bg-surface-2/60 px-4 py-3 font-mono text-sm break-all text-text outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]"
                    data-tool-input=""
                />
                <div>
                    <Button onClick={() => setText(navigator.userAgent)}>{t("mine")}</Button>
                </div>
            </div>
            {agent && (
                <section className="overflow-hidden rounded-2xl border border-border bg-bg">
                    <div className="flex min-h-11 items-center justify-end border-b border-border/70 pe-1.5">
                        <CopyButton text={summary} locale={locale} compact />
                    </div>
                    <dl className="divide-y divide-border/50">
                        {rows.map(([key, value]) => (
                            <div key={key} className="flex items-center gap-3 px-4 py-2.5">
                                <dt className="w-36 shrink-0 text-xs text-muted">{t(key)}</dt>
                                <dd className="text-sm font-semibold" data-field={key}>
                                    <Ltr>{value}</Ltr>
                                </dd>
                            </div>
                        ))}
                    </dl>
                    <p className="border-t border-border/70 px-4 py-2 text-xs text-muted">
                        {t("note")}
                    </p>
                </section>
            )}
            <input type="hidden" value={summary} readOnly data-tool-output="" />
        </div>
    );
}
