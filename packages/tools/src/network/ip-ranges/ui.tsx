import { useId, useState } from "react";
import { Ltr, type ToolUiProps } from "@handyweb/core/ui";
import { strings } from "./i18n";
import { rangesFor, SPECIAL } from "./logic";

export default function IpRanges({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const [text, setText] = useState("");
    const id = useId();
    const found = rangesFor(text);

    return (
        <div className="flex flex-col gap-5">
            <label htmlFor={id} className="flex flex-col gap-1.5 text-xs font-semibold text-muted">
                {t("lookup")}
                <input
                    id={id}
                    dir="ltr"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="10.0.0.1 · 100.64.1.1 · fe80::1"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    className="min-h-12 w-full rounded-xl border border-border bg-surface-2/60 px-3 font-mono text-base text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]"
                    data-tool-input=""
                />
            </label>
            {text.trim() && (
                <div
                    className="rounded-2xl border border-border bg-bg px-4 py-3 text-sm"
                    aria-live="polite"
                    data-range-answer=""
                >
                    {found === null ? (
                        <span className="text-error">{t("invalid")}</span>
                    ) : found.length === 0 ? (
                        t("public")
                    ) : (
                        <ul className="flex flex-col gap-1">
                            {found.map((range) => (
                                <li key={`${range.network}/${range.prefix}`}>
                                    <Ltr
                                        as="code"
                                        className="font-mono"
                                    >{`${range.network}/${range.prefix}`}</Ltr>{" "}
                                    · {range.name[locale]}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            <section className="overflow-hidden rounded-2xl border border-border bg-bg">
                <h2 className="border-b border-border/70 px-4 py-2.5 text-sm font-semibold">
                    {t("table")}
                </h2>
                <table className="w-full text-sm">
                    <thead className="sr-only">
                        <tr>
                            <th>{t("range")}</th>
                            <th>{t("use")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {SPECIAL.map((range) => (
                            <tr key={`${range.network}/${range.prefix}`}>
                                <td className="px-4 py-1.5 align-top">
                                    <Ltr
                                        as="code"
                                        className="font-mono text-xs break-all"
                                    >{`${range.network}/${range.prefix}`}</Ltr>
                                </td>
                                <td className="px-4 py-1.5">{range.name[locale]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            <p className="text-xs text-muted">{t("source")}</p>
            <input
                type="hidden"
                value={
                    found
                        ? found.map((range) => `${range.network}/${range.prefix}`).join(",") ||
                          "public"
                        : ""
                }
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
